import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {CREATE_MOVIE, IMAGE_URL} from "../../constants/constants";
import {useEffect, useRef, useState} from "react";


const Movies = () => {
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

    const [movies, setMovies] = useState([]);


    return (
        <div className={'content-wrapper'}>
            <div className={'container-xxl flex-grow-1 container-p-y'}>
                <div className="card">
                    <div className="card-body p-4">
                        <div className="table-responsive text-nowrap">
                            <h3 className={'text-primary mb-0'}>Movies</h3>
                            <div className={'row'}>
                                <div className="col d-flex align-items-center justify-content-start mt-3">
                                    <strong className="me-2">Items per page:</strong>
                                    <select className="form-select-sm"
                                            style={{width: "20%"}}
                                            name={'pageSize'}
                                            // onChange={handleInputChange}
                                    >
                                        {Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0 ? pageSizeOptions.map((size, index) => (
                                            <option key={index} value={size}>{size}</option>
                                        )) : ([])}
                                    </select>
                                </div>
                                <div className="col d-flex justify-content-end mb-3">
                                    <div className="demo-inline-spacing">
                                        <Link type="button"
                                                className="btn btn-sm btn-success"
                                                to={CREATE_MOVIE}
                                        >
                                            <span className="tf-icons bx bx-plus"></span>&nbsp; Create new movie
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Poster</th>
                                    <th>Title</th>
                                    <th>Duration</th>
                                    <th>Year</th>
                                    <th>Status</th>
                                    <th>Show at home</th>
                                    <th className={'text-center'}>Actions</th>
                                </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                {/*{Array.isArray(roles.data) && roles.data.length > 0 ? roles.data.map((role, index) => (*/}
                                {/*    <tr key={index}>*/}
                                {/*        <td className={'d-flex align-items-center'}>*/}
                                {/*            <button type="button"*/}
                                {/*                    className={`btn-sm btn-${role.bsColor} btn-icon rounded-pill me-2`}>*/}
                                {/*            </button>*/}
                                {/*            <strong>{role.name}</strong>*/}
                                {/*        </td>*/}
                                {/*        <td>*/}
                                {/*            <span>{role.description}</span>*/}
                                {/*        </td>*/}
                                {/*        <td>*/}
                                {/*            {Array.isArray(role.functions) && role.functions.length > 0 ? role.functions.map((func, index) => (*/}
                                {/*                <span key={index}*/}
                                {/*                      className={`badge bg-label-${getRandomColor()}  me-1`}>{func.name}</span>*/}
                                {/*            )) : []}*/}
                                {/*        </td>*/}
                                {/*        <td className={'text-center'}>*/}
                                {/*            <div className="dropdown justify-content-center">*/}
                                {/*                <button type="button"*/}
                                {/*                        className="btn-sm btn-primary btn-icon rounded-pill dropdown-toggle hide-arrow"*/}
                                {/*                        data-bs-toggle="dropdown">*/}
                                {/*                    <i className="bx bx-dots-vertical-rounded"></i>*/}
                                {/*                </button>*/}
                                {/*                <div className="dropdown-menu">*/}
                                {/*                    <button className="dropdown-item"*/}
                                {/*                            data-bs-toggle="modal"*/}
                                {/*                            data-bs-target="#editModal"*/}
                                {/*                            onClick={() => {*/}
                                {/*                                setEditRole(role);*/}
                                {/*                            }}*/}
                                {/*                    >*/}
                                {/*                        <i className="bx bx-edit-alt me-1"></i> Edit*/}
                                {/*                    </button>*/}
                                {/*                    <button className="dropdown-item"*/}
                                {/*                            data-bs-toggle="modal"*/}
                                {/*                            data-bs-target="#functionsModal"*/}
                                {/*                            onClick={() => {*/}
                                {/*                                setEditRole(role);*/}
                                {/*                            }}*/}
                                {/*                    >*/}
                                {/*                        <i className="bx bxs-lock-open me-1"></i> Edit Role's Function*/}
                                {/*                    </button>*/}
                                {/*                    <button className="dropdown-item"*/}
                                {/*                            data-bs-toggle="modal"*/}
                                {/*                            data-bs-target="#deleteModal"*/}
                                {/*                            onClick={() => {*/}
                                {/*                                setDeleteRole(role);*/}
                                {/*                            }}*/}
                                {/*                    >*/}
                                {/*                        <i className="bx bx-trash me-1"></i> Delete*/}
                                {/*                    </button>*/}
                                {/*                </div>*/}
                                {/*            </div>*/}
                                {/*        </td>*/}
                                {/*    </tr>*/}
                                {/*)) : (*/}
                                {/*    <tr className={'text-center'}>*/}
                                {/*        <td colSpan="6"><strong>No records</strong></td>*/}
                                {/*    </tr>*/}
                                {/*)}*/}

                                </tbody>
                            </table>
                            <hr/>
                            <div className={'row'}>
                                <div className="col">
                                    <strong>Showing {movies.fromItem} to {movies.toItem} of {movies.totalItems} entries</strong>
                                </div>
                                <div className="col">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination pagination-sm justify-content-end">
                                            {movies.currentPage > 1 ? (
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
                                            {movies.currentPage < movies.totalPages ? (
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

            {/*/!*Create Modal*!/*/}
            {/*<div className="modal fade" id="createModal" tabIndex="-1" aria-hidden="true">*/}
            {/*    <div className="modal-dialog modal-dialog-centered" role="document">*/}
            {/*        <div className="modal-content">*/}
            {/*            <div className="modal-header">*/}
            {/*                <h4 className="modal-title text-primary">Create new role</h4>*/}
            {/*                <button*/}
            {/*                    type="button"*/}
            {/*                    className="btn-close"*/}
            {/*                    data-bs-dismiss="modal"*/}
            {/*                    aria-label="Close"*/}
            {/*                ></button>*/}
            {/*            </div>*/}
            {/*            <form onSubmit={handleCreateRole}>*/}
            {/*                <div className="modal-body">*/}
            {/*                    <div className="col mb-3">*/}
            {/*                        <label htmlFor="roleNameInput" className="form-label">Name</label>*/}
            {/*                        <input type="text"*/}
            {/*                               id="roleNameInput"*/}
            {/*                               className="form-control"*/}
            {/*                               placeholder="Name"*/}
            {/*                               name={'roleNameInput'}*/}
            {/*                               value={roleNameInput}*/}
            {/*                               onChange={handleInputChange}*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                    <div className="col mb-3">*/}
            {/*                        <label htmlFor="roleDescriptionInput" className="form-label">Descriptions</label>*/}
            {/*                        <textarea id="roleDescriptionInput"*/}
            {/*                                  className="form-control"*/}
            {/*                                  placeholder="Decsriptions"*/}
            {/*                                  name={'roleDescriptionInput'}*/}
            {/*                                  value={roleDescriptionInput}*/}
            {/*                                  onChange={handleInputChange}*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                    <div className="col mb-3">*/}
            {/*                        <label htmlFor="roleSlugInput" className="form-label">Slug</label>*/}
            {/*                        <input type="text"*/}
            {/*                               id="roleSlugInput"*/}
            {/*                               className="form-control"*/}
            {/*                               placeholder="Slug"*/}
            {/*                               name={'roleSlugInput'}*/}
            {/*                               value={roleSlugInput}*/}
            {/*                               onChange={handleInputChange}*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                    <div className="col mb-3">*/}
            {/*                        <label htmlFor="bsColorInput" className="form-label">Select color</label>*/}
            {/*                        <select*/}
            {/*                            className="form-select"*/}
            {/*                            id="bsColorInput"*/}
            {/*                            name={'bsColorInput'}*/}
            {/*                            value={bsColorInput}*/}
            {/*                            onChange={handleInputChange}*/}
            {/*                        >*/}
            {/*                            <option value="">Choose a color</option>*/}
            {/*                            {Array.isArray(bsColors) && bsColors.length > 0 ? bsColors.map((color, index) => (*/}
            {/*                                <option key={index}*/}
            {/*                                        value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>*/}
            {/*                            )) : ([])}*/}
            {/*                        </select>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="modal-footer">*/}
            {/*                    <button type="submit"*/}
            {/*                            className="btn btn-outline-success"*/}
            {/*                    >*/}
            {/*                        <span className="tf-icons bx bx-plus"></span>&nbsp; Create*/}
            {/*                    </button>*/}
            {/*                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"*/}
            {/*                            ref={closeCreateModal}>*/}
            {/*                        <span className="tf-icons bx bx-x"></span>&nbsp; Cancel*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            </form>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*/!*Edit Modal*!/*/}
            {/*<div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">*/}
            {/*    <div className="modal-dialog modal-dialog-centered" role="document">*/}
            {/*        <div className="modal-content">*/}
            {/*            <div className="modal-header">*/}
            {/*                <h4 className="modal-title text-primary">Edit role: <span*/}
            {/*                    className={'text-info'}>{editRole.name}</span></h4>*/}
            {/*                <button*/}
            {/*                    type="button"*/}
            {/*                    className="btn-close"*/}
            {/*                    data-bs-dismiss="modal"*/}
            {/*                    aria-label="Close"*/}
            {/*                ></button>*/}
            {/*            </div>*/}
            {/*            <form onSubmit={handleEditRole}>*/}
            {/*                <div className="modal-body">*/}
            {/*                    <div className="col mb-3">*/}
            {/*                        <label htmlFor="roleNameEdit" className="form-label">Name</label>*/}
            {/*                        <input type="text"*/}
            {/*                               id="roleNameEdit"*/}
            {/*                               className="form-control"*/}
            {/*                               placeholder="Name"*/}
            {/*                               name={'name'}*/}
            {/*                               value={editRole.name}*/}
            {/*                               onChange={onChangeEdit}*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                    <div className="col mb-3">*/}
            {/*                        <label htmlFor="roleDescriptionEdit" className="form-label">Descriptions</label>*/}
            {/*                        <textarea id="roleDescriptionEdit"*/}
            {/*                                  className="form-control"*/}
            {/*                                  placeholder="Decsriptions"*/}
            {/*                                  name={'description'}*/}
            {/*                                  value={editRole.description}*/}
            {/*                                  onChange={onChangeEdit}*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                    <div className="col mb-3">*/}
            {/*                        <label htmlFor="roleSlugEdit" className="form-label">Slug</label>*/}
            {/*                        <input type="text"*/}
            {/*                               id="roleSlugEdit"*/}
            {/*                               className="form-control"*/}
            {/*                               placeholder="Slug"*/}
            {/*                               name={'slug'}*/}
            {/*                               value={editRole.slug}*/}
            {/*                               onChange={handleInputChange}*/}
            {/*                        />*/}
            {/*                    </div>*/}
            {/*                    <div className="col mb-3">*/}
            {/*                        <label htmlFor="bsColorEdit" className="form-label">Select color</label>*/}
            {/*                        <select*/}
            {/*                            className="form-select"*/}
            {/*                            id="bsColorEdit"*/}
            {/*                            name={'bsColor'}*/}
            {/*                            value={editRole.bsColor}*/}
            {/*                            onChange={onChangeEdit}*/}
            {/*                        >*/}
            {/*                            {Array.isArray(bsColors) && bsColors.length > 0 ? bsColors.map((color, index) => (*/}
            {/*                                <option key={index}*/}
            {/*                                        value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>*/}
            {/*                            )) : ([])}*/}
            {/*                        </select>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="modal-footer">*/}
            {/*                    <button type="submit"*/}
            {/*                            className="btn btn-outline-success"*/}
            {/*                    >*/}
            {/*                        <span className="tf-icons bx bx-send"></span>&nbsp; Update*/}
            {/*                    </button>*/}
            {/*                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"*/}
            {/*                            ref={closeEditModal}>*/}
            {/*                        <span className="tf-icons bx bx-x"></span>&nbsp; Cancel*/}
            {/*                    </button>*/}
            {/*                </div>*/}
            {/*            </form>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*/!*Delete Modal*!/*/}
            {/*<div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">*/}
            {/*    <div className="modal-dialog modal-dialog-centered" role="document">*/}
            {/*        <div className="modal-content">*/}
            {/*            <div className="modal-header">*/}
            {/*                <h4 className="modal-title text-primary">Delete account: <span*/}
            {/*                    className={'text-danger'}>{deleteRole.name}</span></h4>*/}
            {/*                <button*/}
            {/*                    type="button"*/}
            {/*                    className="btn-close"*/}
            {/*                    data-bs-dismiss="modal"*/}
            {/*                    aria-label="Close"*/}
            {/*                ></button>*/}
            {/*            </div>*/}
            {/*            <div className="modal-body">*/}
            {/*                <strong>This role will be removed from roles list. Are you sure?</strong>*/}
            {/*            </div>*/}
            {/*            <div className="modal-footer">*/}
            {/*                <button type="submit"*/}
            {/*                        className="btn btn-outline-danger"*/}
            {/*                        onClick={handleDeleteRole}*/}
            {/*                >*/}
            {/*                    <span className="tf-icons bx bxs-trash"></span>&nbsp; Delete*/}
            {/*                </button>*/}
            {/*                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"*/}
            {/*                        ref={closeDeleteModal}>*/}
            {/*                    <span className="tf-icons bx bx-x"></span>&nbsp; Cancel*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}


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
    )
}

export default Movies;
