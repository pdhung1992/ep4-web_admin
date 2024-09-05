import {useEffect, useRef, useState} from "react";
import roleServices from "../services/role-service";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {BS_COLORS, IMAGE_URL, ROLES_LIST} from "../constants/constants";
import functionServices from "../services/function-services";


const Roles = () => {

    const admin = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const imgUrl = IMAGE_URL;

    const token = admin.adminData.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const closeCreateModal = useRef(null);
    const closeEditModal = useRef(null);
    const closeDeleteModal = useRef(null);
    const closeFunctionModal = useRef(null)
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const closeToast = useRef(null);
    const [toastType, setToastType] = useState('');
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                if (closeToast.current) {
                    closeToast.current.click();
                }
                setShowToast(false);
                setToastType('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sortField, setSortField] = useState('id')
    const [sortDir, setSortDir] = useState('asc')
    const [pageArr, setPageArr] = useState([])
    const pageSizeOptions = [10, 25, 50];
    const [filterChange, setFilterChange] = useState(false);


    const [roles, setRoles] = useState([]);
    const [parentFunctions, setParentFunctions] = useState([]);
    const [roleFunctions, setRoleFunctions] = useState([]);
    const [editRole, setEditRole] = useState({});

    const [roleNameInput, setRoleNameInput] = useState('');
    const [roleDescriptionInput, setRoleDescriptionInput] = useState('');
    const [roleSlugInput, setRoleSlugInput] = useState('');
    const [bsColorInput, setBsColorInput] = useState('');

    const bsColors = BS_COLORS;
    function getRandomColor() {
        return bsColors[Math.floor(Math.random() * bsColors.length)];
    }

    const fetchRoles = async () => {
        const data = await roleServices.getRoles(pageNo, pageSize, sortField, sortDir, filterChange);
        setRoles(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
    }

    const fetchParentFunctions = async () => {
        const data = await functionServices.getParentFunctions();
        setParentFunctions(data);
    }

    const fetchRoleFunctions = async (roleId) => {
        const data = await functionServices.getFunctionByRole(roleId);
        setRoleFunctions(data);
    }

    useEffect(() => {
        fetchRoles();
    }, [pageNo, pageSize, sortField, sortDir, filterChange]);

    useEffect(() => {
        fetchParentFunctions();
    }, []);

    useEffect(() => {
        fetchRoleFunctions(editRole.id);
    }, [editRole]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name === 'pageSize') setPageSize(value);
        if (name === 'roleNameInput') setRoleNameInput(value);
        if (name === 'roleDescriptionInput') setRoleDescriptionInput(value);
        if (name === 'roleSlugInput') setRoleSlugInput(value);
        if (name === 'bsColorInput') setBsColorInput(value);
    }

    const handleCreateRole = async (e) => {
        e.preventDefault();
        const formData = {
            name: roleNameInput,
            description: roleDescriptionInput,
            slug: roleSlugInput,
            bsColor: bsColorInput
        }
        const data = await roleServices.createRole(formData);
        if (data && data.responseCode === 201) {
            fetchRoles();
            closeCreateModal.current.click();
            setToastMessage(data.message);
            setToastType('success');
            setShowToast(true);
            navigate(ROLES_LIST);
        }
    }

    const onChangeEdit = (e) => {
        const {name, value} = e.target;
        setEditRole(prevRole => ({
            ...prevRole, [name]: value
        }));
    }

    const handleEditRole = async (e) => {
        e.preventDefault();
        const formData = {
            id: editRole.id,
            name: editRole.name,
            description: editRole.description,
            slug: editRole.slug,
            bsColor: editRole.bsColor
        }
        const data = await roleServices.updateRole(formData);
        if (data && data.responseCode === 200) {
            fetchRoles();
            setEditRole({});
            closeEditModal.current.click();
            setToastMessage(data.message);
            setToastType('success');
            setShowToast(true);
            navigate(ROLES_LIST);
        }
    }

    const [deleteRole, setDeleteRole] = useState({});

    const handleDeleteRole = async () => {
        const data = await roleServices.deleteRole(deleteRole.id);
        if (data && data.responseCode === 200) {
            fetchRoles();
            closeDeleteModal.current.click();
            setToastMessage(data.message);
            setToastType('danger');
            setShowToast(true);
            navigate(ROLES_LIST);
        }
    }

    const [functionIds, setFunctionIds] = useState([]);

    useEffect(() => {
        if (Array.isArray(roleFunctions)) {
            const initialCheckedIds = roleFunctions.map(roleFunction => roleFunction.id);
            setFunctionIds(initialCheckedIds);
        }
    }, [roleFunctions]);

    const handleCheckboxChange = (id) => {
        setFunctionIds((prevFunctionIds) => {
            if (prevFunctionIds.includes(id)) {
                return prevFunctionIds.filter((functionId) => functionId !== id);
            } else {
                return [...prevFunctionIds, id];
            }
        });
    };


    const handleFunctionChange = async (e) => {
        e.preventDefault();
        const roleId = editRole.id;
        const data = await roleServices.updateRoleFunctions(roleId, functionIds);
        if (data && data.responseCode === 200) {
            fetchRoles();
            closeFunctionModal.current.click();
            setToastMessage(data.message);
            setToastType('success');
            setShowToast(true);
            navigate(ROLES_LIST);
        }
    }

    return (
        <div className={'content-wrapper'}>
            <div className={'container-xxl flex-grow-1 container-p-y'}>
                <div className="card">
                    <div className="card-body p-4">
                        <div className="table-responsive text-nowrap">
                            <h3 className={'text-primary mb-0'}>Roles</h3>
                            <div className={'row'}>
                                <div className="col d-flex align-items-center justify-content-start mt-3">
                                    <strong className="me-2">Items per page:</strong>
                                    <select className="form-select-sm"
                                            style={{width: "20%"}}
                                            name={'pageSize'}
                                            onChange={handleInputChange}
                                    >
                                        {Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0 ? pageSizeOptions.map((size, index) => (
                                            <option key={index} value={size}>{size}</option>
                                        )) : ([])}
                                    </select>
                                </div>
                                <div className="col d-flex justify-content-end mb-3">
                                    <div className="demo-inline-spacing">
                                        <button type="button"
                                                className="btn btn-sm btn-success"
                                                data-bs-toggle="modal"
                                                data-bs-target="#createModal"
                                        >
                                            <span className="tf-icons bx bx-plus"></span>&nbsp; Create new role
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Functions Group</th>
                                    <th className={'text-center'}>Actions</th>
                                </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                {Array.isArray(roles.data) && roles.data.length > 0 ? roles.data.map((role, index) => (
                                    <tr key={index}>
                                        <td className={'d-flex align-items-center'}>
                                            <button type="button"
                                                    className={`btn-sm btn-${role.bsColor} btn-icon rounded-pill me-2`}>
                                            </button>
                                            <strong>{role.name}</strong>
                                        </td>
                                        <td>
                                            <span>{role.description}</span>
                                        </td>
                                        <td>
                                            {Array.isArray(role.functions) && role.functions.length > 0 ? role.functions.map((func, index) => (
                                                <span key={index}
                                                      className={`badge bg-label-${getRandomColor()}  me-1`}>{func.name}</span>
                                            )) : []}
                                        </td>
                                        <td className={'text-center'}>
                                            <div className="dropdown justify-content-center">
                                                <button type="button"
                                                        className="btn-sm btn-primary btn-icon rounded-pill dropdown-toggle hide-arrow"
                                                        data-bs-toggle="dropdown">
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                    <button className="dropdown-item"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editModal"
                                                            onClick={() => {
                                                                setEditRole(role);
                                                            }}
                                                    >
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </button>
                                                    <button className="dropdown-item"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#functionsModal"
                                                            onClick={() => {
                                                                setEditRole(role);
                                                            }}
                                                    >
                                                        <i className="bx bxs-lock-open me-1"></i> Edit Role's Function
                                                    </button>
                                                    <button className="dropdown-item"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteModal"
                                                            onClick={() => {
                                                                setDeleteRole(role);
                                                            }}
                                                    >
                                                        <i className="bx bx-trash me-1"></i> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr className={'text-center'}>
                                        <td colSpan="6"><strong>No records</strong></td>
                                    </tr>
                                )}

                                </tbody>
                            </table>
                            <hr/>
                            <div className={'row'}>
                                <div className="col">
                                    <strong>Showing {roles.fromItem} to {roles.toItem} of {roles.totalItems} entries</strong>
                                </div>
                                <div className="col">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination pagination-sm justify-content-end">
                                            {roles.currentPage > 1 ? (
                                                <li className="page-item">
                                                    <button className="page-link" onClick={() => {
                                                        setPageNo(pageNo - 1)
                                                    }}>Previous
                                                    </button>
                                                </li>
                                            ) : ([])}
                                            {Array.isArray(pageArr) && pageArr.length > 0 ? pageArr.map((page, index) => (
                                                <div>
                                                    {page === pageNo ? (
                                                        <li className="page-item" key={index}>
                                                            <button className="page-link text-danger"
                                                                    onClick={() => setPageNo(page)}>{page}</button>
                                                        </li>
                                                    ) : (
                                                        <li className="page-item" key={index}>
                                                            <button className="page-link"
                                                                    onClick={() => setPageNo(page)}>{page}</button>
                                                        </li>
                                                    )}
                                                </div>
                                            )) : ([])}
                                            {roles.currentPage < roles.totalPages ? (
                                                <li className="page-item">
                                                    <button className="page-link" onClick={() => {
                                                        setPageNo(pageNo + 1)
                                                    }}>Next
                                                    </button>
                                                </li>
                                            ) : ([])}
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*Create Modal*/}
            <div className="modal fade" id="createModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Create new role</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleCreateRole}>
                            <div className="modal-body">
                                <div className="col mb-3">
                                    <label htmlFor="roleNameInput" className="form-label">Name</label>
                                    <input type="text"
                                           id="roleNameInput"
                                           className="form-control"
                                           placeholder="Name"
                                           name={'roleNameInput'}
                                           value={roleNameInput}
                                           onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="roleDescriptionInput" className="form-label">Descriptions</label>
                                    <textarea id="roleDescriptionInput"
                                              className="form-control"
                                              placeholder="Decsriptions"
                                              name={'roleDescriptionInput'}
                                              value={roleDescriptionInput}
                                              onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="roleSlugInput" className="form-label">Slug</label>
                                    <input type="text"
                                           id="roleSlugInput"
                                           className="form-control"
                                           placeholder="Slug"
                                           name={'roleSlugInput'}
                                           value={roleSlugInput}
                                           onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="bsColorInput" className="form-label">Select color</label>
                                    <select
                                        className="form-select"
                                        id="bsColorInput"
                                        name={'bsColorInput'}
                                        value={bsColorInput}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Choose a color</option>
                                        {Array.isArray(bsColors) && bsColors.length > 0 ? bsColors.map((color, index) => (
                                            <option key={index}
                                                    value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
                                        )) : ([])}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit"
                                        className="btn btn-outline-success"
                                >
                                    <span className="tf-icons bx bx-plus"></span>&nbsp; Create
                                </button>
                                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"
                                        ref={closeCreateModal}>
                                    <span className="tf-icons bx bx-x"></span>&nbsp; Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/*Edit Modal*/}
            <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Edit role: <span
                                className={'text-info'}>{editRole.name}</span></h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleEditRole}>
                            <div className="modal-body">
                                <div className="col mb-3">
                                    <label htmlFor="roleNameEdit" className="form-label">Name</label>
                                    <input type="text"
                                           id="roleNameEdit"
                                           className="form-control"
                                           placeholder="Name"
                                           name={'name'}
                                           value={editRole.name}
                                           onChange={onChangeEdit}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="roleDescriptionEdit" className="form-label">Descriptions</label>
                                    <textarea id="roleDescriptionEdit"
                                              className="form-control"
                                              placeholder="Decsriptions"
                                              name={'description'}
                                              value={editRole.description}
                                              onChange={onChangeEdit}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="roleSlugEdit" className="form-label">Slug</label>
                                    <input type="text"
                                           id="roleSlugEdit"
                                           className="form-control"
                                           placeholder="Slug"
                                           name={'slug'}
                                           value={editRole.slug}
                                           onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="bsColorEdit" className="form-label">Select color</label>
                                    <select
                                        className="form-select"
                                        id="bsColorEdit"
                                        name={'bsColor'}
                                        value={editRole.bsColor}
                                        onChange={onChangeEdit}
                                    >
                                        {Array.isArray(bsColors) && bsColors.length > 0 ? bsColors.map((color, index) => (
                                            <option key={index}
                                                    value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
                                        )) : ([])}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit"
                                        className="btn btn-outline-success"
                                >
                                    <span className="tf-icons bx bx-send"></span>&nbsp; Update
                                </button>
                                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"
                                        ref={closeEditModal}>
                                    <span className="tf-icons bx bx-x"></span>&nbsp; Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/*Delete Modal*/}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Delete account: <span
                                className={'text-danger'}>{deleteRole.name}</span></h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <strong>This role will be removed from roles list. Are you sure?</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="submit"
                                    className="btn btn-outline-danger"
                                    onClick={handleDeleteRole}
                            >
                                <span className="tf-icons bx bxs-trash"></span>&nbsp; Delete
                            </button>
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"
                                    ref={closeDeleteModal}>
                                <span className="tf-icons bx bx-x"></span>&nbsp; Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/*Edit Function Modal*/}
            <div className="modal fade" id="functionsModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Update <span
                                className={'text-info'}>{editRole.name}</span> functions:</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <strong>Select function groups what <span className={'text-info'}>{editRole.name}</span> can use.</strong>
                            <form action="">
                                <div className="row">
                                    {Array.isArray(parentFunctions) && parentFunctions.length > 0 ? parentFunctions.map((parent, index) => (
                                        <div className="col-md-4" key={index}>
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="form-check">
                                                        <input className="form-check-input"
                                                               type="checkbox"
                                                               id={`functionCheckBox-${index}`}
                                                               checked={functionIds.includes(parent.id)}
                                                               onChange={() => handleCheckboxChange(parent.id)}
                                                        />
                                                        <label className="form-check-label" htmlFor="functionCheckBox"><h5 className={'card-title'}>{parent.name}</h5></label>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    {parent.description}
                                                </div>
                                            </div>
                                        </div>
                                    )) : []}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="submit"
                                    className="btn btn-outline-info"
                                onClick={handleFunctionChange}
                            >
                                <span className="tf-icons bx bxs-send"></span>&nbsp; Update
                            </button>
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"
                                    ref={closeFunctionModal}>
                                <span className="tf-icons bx bx-x"></span>&nbsp; Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/*Alert toast*/}
            <div
                className={`bs-toast toast toast-placement-ex m-3 fade bg-${toastType} top-0 end-0 ${showToast ? 'show' : ''}`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                data-bs-delay="3000"
            >
                <div className="toast-header">
                    <i className="bx bx-bell me-2"></i>
                    <div className="me-auto fw-semibold">Alert</div>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"
                            ref={closeToast}></button>
                </div>
                <div className="toast-body">
                    {toastMessage}
                </div>
            </div>
        </div>
    );
}

export default Roles;
