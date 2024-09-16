import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import accountServices from "../services/account-services";
import roleServices from "../services/role-service";
import {ACCOUNTS_LIST, IMAGE_URL} from "../constants/constants";

const Accounts = () => {
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


    const [accounts, setAccounts] = useState([])
    const [roles, setRoles] = useState([])

    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sortField, setSortField] = useState('id')
    const [sortDir, setSortDir] = useState('asc')
    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [roleId, setRoleId] = useState('')
    const [pageArr, setPageArr] = useState([])
    const pageSizeOptions = [10, 25, 50];
    const [filterChange, setFilterChange] = useState(false);

    const [usernameInput, setUsernameInput] = useState('')
    const [fullNameInput, setFullNameInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [rePasswordInput, setRePasswordInput] = useState('')
    const [roleIdInput, setRoleIdInput] = useState('')

    const [editAccount, setEditAccount] = useState({});
    const [deleteAccount, setDeleteAccount] = useState({});

    const fetchAccounts = async () => {
        const data = await accountServices.getAccountsList(pageNo, pageSize, sortField, sortDir, username, fullName, email, roleId, axiosConfig);
        setAccounts(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
    }

    const fetchRoles = async () => {
        const data = await roleServices.getRolesChoice();
        setRoles(data);
    }

    useEffect(() => {
        fetchRoles();
    }, [])

    useEffect(() => {
        fetchAccounts();
    }, [pageNo, pageSize, sortField, sortDir, filterChange])

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name === 'username') setUsername(value);
        if (name === 'fullName') setFullName(value);
        if (name === 'email') setEmail(value);
        if (name === 'roleId') setRoleId(value);
        if (name === 'pageSize') setPageSize(value);
        if (name === 'usernameInput') setUsernameInput(value);
        if (name === 'fullNameInput') setFullNameInput(value);
        if (name === 'emailInput') setEmailInput(value);
        if (name === 'passwordInput') setPasswordInput(value);
        if (name === 'rePasswordInput') setRePasswordInput(value);
        if (name === 'roleIdInput') setRoleIdInput(value);
    }

    const handleFilter = async () => {
        const data = await accountServices.getAccountsList(pageNo, pageSize, sortField, sortDir, username, fullName, email, roleId, axiosConfig);
        setAccounts(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
    }

    const handleClearFilter = async () => {
        setUsername('');
        setFullName('');
        setEmail('');
        setRoleId('');
        const data = await accountServices.getAccountsList(pageNo, pageSize, sortField, sortDir, username, fullName, email, roleId, axiosConfig);
        setAccounts(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
        setFilterChange(!filterChange);
    };

    const isPasswordMatch = passwordInput === rePasswordInput;

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (isPasswordMatch) {
            const formData = {
                username: usernameInput,
                fullName: fullNameInput,
                email: emailInput,
                password: passwordInput,
                roleId: roleIdInput
            }
            const data = await accountServices.createAccount(formData);
            if (data && data.responseCode === 201) {
                fetchAccounts();
                closeCreateModal.current.click();
                setToastMessage(data.message);
                setToastType('success');
                setShowToast(true);
                navigate(ACCOUNTS_LIST);
            }
        }
    }

    const onChangeEdit = (e) => {
        const {name, value} = e.target;
        if (name === 'roleId') {
            setEditAccount(prevAcc => ({
                ...prevAcc,
                role: {
                    ...prevAcc.role,
                    id: value
                }
            }));
        } else {
            setEditAccount(prevAcc => ({
                ...prevAcc, [name]: value
            }));
        }
    }


    const handleEditAccount = async (e) => {
        e.preventDefault();
        const formData = {
            id: editAccount.id,
            fullName: editAccount.fullName,
            email: editAccount.email,
            roleId: editAccount.role.id
        }
        const data = await accountServices.updateAccount(formData);
        if (data && data.responseCode === 200) {
            fetchAccounts();
            setEditAccount({});
            setToastMessage(data.message);
            setToastType('success');
            setShowToast(true);
            closeEditModal.current.click();
            navigate(ACCOUNTS_LIST);
        }
    }

    const handleDeleteAccount = async () => {
        const data = await accountServices.deleteAccount(deleteAccount.id);
        if (data && data.responseCode === 200) {
            fetchAccounts();
            setToastMessage(data.message);
            setToastType('danger');
            setShowToast(true);
            closeDeleteModal.current.click();
            navigate(ACCOUNTS_LIST);
        }
    }

    return (
        <div className={'content-wrapper'}>
            <div className={'container-xxl flex-grow-1 container-p-y'}>
                <div className="card">
                    <div className="card-body p-4">
                        <div className="table-responsive text-nowrap">
                            <h3 className={'text-primary mb-0'}>Accounts</h3>
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
                                            <span className="tf-icons bx bx-plus"></span>&nbsp; Create new account
                                        </button>
                                        <button type="button"
                                                className="btn btn-sm btn-warning"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#filtersOffcanvas"
                                                aria-controls="filtersOffcanvas"
                                        >
                                            <span className="tf-icons bx bxs-filter-alt"></span>&nbsp; Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Avatar</th>
                                    <th>Username</th>
                                    <th>Full name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th className={'text-center'}>Actions</th>
                                </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                {Array.isArray(accounts.data) && accounts.data.length > 0 ? accounts.data.map((account, index) => (
                                    <tr key={index}>
                                        <td className={'avatar'}>
                                            <img src={imgUrl + account.avatar} alt={account.username}
                                                 className="w-px-40 h-auto rounded-circle"/>
                                        </td>
                                        <td>
                                            <strong>{account.username}</strong>
                                        </td>
                                        <td>
                                            <span>{account.fullName}</span>
                                        </td>
                                        <td>
                                            <span>{account.email}</span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge bg-label-${account.role.bsColor} me-1`}>{account.role.name}</span>
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
                                                                setEditAccount(account);
                                                            }}
                                                    >
                                                        <i className="bx bx-edit-alt me-1"></i> Edit
                                                    </button>
                                                    <button className="dropdown-item">
                                                        <i className="bx bxs-lock-open me-1"></i> Edit role
                                                    </button>
                                                    <button className="dropdown-item"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteModal"
                                                            onClick={() => {
                                                                setDeleteAccount(account);
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
                                    <strong>Showing {accounts.fromItem} to {accounts.toItem} of {accounts.totalItems} entries</strong>
                                </div>
                                <div className="col">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination pagination-sm justify-content-end">
                                            {accounts.currentPage > 1 ? (
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
                                            {accounts.currentPage < accounts.totalPages ? (
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
                            <h4 className="modal-title text-primary">Create new admin account</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleCreateAccount}>
                            <div className="modal-body">
                                <div className="col mb-3">
                                    <label htmlFor="usernameInput" className="form-label">Username</label>
                                    <input type="text"
                                           id="usernameInput"
                                           className="form-control"
                                           placeholder="Username"
                                           name={'usernameInput'}
                                           value={usernameInput}
                                           onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="fullNameInput" className="form-label">Full name</label>
                                    <input type="text"
                                           id="fullNameInput"
                                           className="form-control"
                                           placeholder="Full name"
                                           name={'fullNameInput'}
                                           value={fullNameInput}
                                           onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="emailInput" className="form-label">Email</label>
                                    <input type="text"
                                           id="emailInput"
                                           className="form-control"
                                           placeholder="xxxx@xxx.xx"
                                           name={'emailInput'}
                                           value={emailInput}
                                           onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="passwordInput" className="form-label">Password</label>
                                    <input type="password"
                                           id="passwordInput"
                                           className="form-control"
                                           placeholder="Password"
                                           name={'passwordInput'}
                                           value={passwordInput}
                                           onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="re-passwordInput" className="form-label">Re-enter
                                        password</label>
                                    <input type="password"
                                           id="re-passwordInput"
                                           className="form-control"
                                           placeholder="Re-enter password"
                                           name={'rePasswordInput'}
                                           value={rePasswordInput}
                                           onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="roleIdInput" className="form-label">Select role</label>
                                    <select
                                        className="form-select"
                                        id="roleIdInput"
                                        name={'roleIdInput'}
                                        value={roleIdInput}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select role</option>
                                        {Array.isArray(roles) && roles.length > 0 ? roles.map((role, index) => (
                                            <option key={index} value={role.id}>{role.name}</option>
                                        )) : ([])}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-outline-success">
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
                            <h4 className="modal-title text-primary">Edit account: <span
                                className={'text-info'}>{editAccount.username}</span></h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleEditAccount}>
                            <div className="modal-body">
                                <input type={'text'} value={editAccount.id} name={'idEdit'} hidden/>
                                <div className="col mb-3">
                                    <label htmlFor="usernameEdit" className="form-label">Username</label>
                                    <input type="text"
                                           id="usernameEdit"
                                           className="form-control"
                                           placeholder="Username"
                                           name={'usernameEdit'}
                                           value={editAccount.username}
                                           disabled
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="fullNameEdit" className="form-label">Full name</label>
                                    <input type="text"
                                           id="fullNameEdit"
                                           className="form-control"
                                           placeholder="Full name"
                                           name={'fullName'}
                                           value={editAccount.fullName}
                                           onChange={onChangeEdit}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="emailEdit" className="form-label">Email</label>
                                    <input type="text"
                                           id="emailEdit"
                                           className="form-control"
                                           placeholder="xxxx@xxx.xx"
                                           name={'email'}
                                           value={editAccount.email}
                                           onChange={onChangeEdit}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="roleIdEdit" className="form-label">Select role</label>
                                    <select
                                        className="form-select"
                                        id="roleIdEdit"
                                        name={'roleId'}
                                        value={editAccount && editAccount.role ? editAccount.role.id : ''}
                                        onChange={onChangeEdit}
                                    >
                                        {Array.isArray(roles) && roles.length > 0 ? roles.map((role, index) => (
                                            <option key={index} value={role.id}>{role.name}</option>
                                        )) : ([])}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-outline-info">
                                    <span className="tf-icons bx bx-send"></span>&nbsp; Update
                                </button>
                                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"
                                        ref={closeEditModal}
                                >
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
                                className={'text-danger'}>{deleteAccount.username}</span></h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <strong>This account will be removed from accounts list. Are you sure?</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="submit"
                                    className="btn btn-outline-danger"
                                    onClick={handleDeleteAccount}
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

            {/*Filters Offcanvas*/}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="filtersOffcanvas"
                aria-labelledby="offcanvasEndLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="offcanvasEndLabel" className="offcanvas-title text-primary">Account Filter</h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <hr/>
                <div className="offcanvas-body">
                    <div className="mb-3">
                        <label htmlFor="usernameFilter" className="form-label">By Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="usernameFilter"
                            placeholder="Username"
                            name={'username'}
                            value={username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fullNameFilter" className="form-label">By Full name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="fullNameFilter"
                            placeholder="Full name"
                            name={'fullName'}
                            value={fullName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailFilter" className="form-label">By Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="emailFilter"
                            placeholder="Email"
                            name={'email'}
                            value={email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailFilter" className="form-label">By Role</label>
                        <select
                            className="form-select"
                            id="roleFilter"
                            name={'roleId'}
                            value={roleId}
                            onChange={handleInputChange}
                        >
                            <option value="">Select role</option>
                            {Array.isArray(roles) && roles.length > 0 ? roles.map((role, index) => (
                                <option key={index} value={role.id}>{role.name}</option>
                            )) : ([])}
                        </select>
                    </div>
                </div>
                <hr/>
                <div className={'canvas-bottom mb-3 mt-0 pt-0 px-2 flex-grow-0'}>
                    <div className="d-flex justify-content-end mb-3">
                        <div className="demo-inline-spacing">
                            <button type="button"
                                    className="btn btn-sm btn-outline-warning"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#filtersOffcanvas"
                                    onClick={handleFilter}
                            >
                                <span className="tf-icons bx bx-check"></span>&nbsp; Apply filter
                            </button>
                            <button type="button"
                                    className="btn btn-sm btn-outline-secondary"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#filtersOffcanvas"
                                    onClick={handleClearFilter}
                            >
                                <span className="tf-icons bx bx-reset"></span>&nbsp; Clear filter
                            </button>
                            <button type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#filtersOffcanvas"
                                    aria-controls="filtersOffcanvas"
                            >
                                <span className="tf-icons bx bx-x"></span>&nbsp; Close
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
    )
}

export default Accounts;
