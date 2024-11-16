import {Link} from "react-router-dom";
import movies from "./movie/Movies";
import {IMAGE_URL} from "../constants/constants";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import userServices from "../services/user-services";


const Users = () => {
    const admin = useSelector(state => state.auth);
    const imgUrl = IMAGE_URL;

    const token = admin.adminData.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const closeDetailsModal = useRef(null);
    const closeBlockModal = useRef(null);
    const closeUnblockModal = useRef(null);
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

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const data = await userServices.getAllUsers(pageNo, pageSize, sortField, sortDir, fullName, phone, email, axiosConfig);
        setUsers(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name === 'pageSize') setPageSize(value);
        if (name === 'fullName') setFullName(value);
        if (name === 'phone') setPhone(value);
        if (name === 'email') setEmail(value);
    }

    useEffect(() => {
        fetchUsers();
    }, [pageNo, pageSize, sortField, sortDir, fullName, phone, email, filterChange]);

    const handleFilter = async () => {
        const data = await userServices.getAllUsers(pageNo, pageSize, sortField, sortDir, fullName, phone, email, axiosConfig);
        setUsers(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
    }

    const handleClearFilter = async () => {
        setFullName('');
        setPhone('');
        setEmail('');
        const data = await userServices.getAllUsers(pageNo, pageSize, sortField, sortDir, fullName, phone, email,axiosConfig);
        setUsers(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
        setFilterChange(!filterChange);
    };

    const [blockUser, setBlockUser] = useState({});

    const handleBlockUser = async () => {
        const formData = new FormData();
        formData.append('userId', blockUser.id);
        const data = await userServices.blockUser(formData, axiosConfig);
        console.log(data);
        if (data.responseCode === 200) {
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeBlockModal.current.click();
            fetchUsers();
        } else {
            setToastType('danger');
            setToastMessage(data.responseMessage);
            setShowToast(true);
        }
    }

    const handleUnblockUser = async () => {
        const formData = new FormData();
        formData.append('userId', blockUser.id);
        const data = await userServices.unblockUser(formData, axiosConfig);
        console.log(data);
        if (data.responseCode === 200) {
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeUnblockModal.current.click();
            fetchUsers();
        } else {
            setToastType('danger');
            setToastMessage(data.responseMessage);
            setShowToast(true);
        }
    }

    return (
        <div className={'content-wrapper'}>
            <div className={'container-xxl flex-grow-1 container-p-y'}>
                <div className="card">
                    <div className="card-body p-4">
                        <div className="table-responsive text-nowrap">
                            <h3 className={'text-primary mb-0'}>Users</h3>
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
                                    <th>Full name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th className={'text-center'}>Actions</th>
                                </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                {Array.isArray(users.data) && users.data.length > 0 ? users.data.map((user, index) => (
                                    <tr key={index}>
                                        <td className={'avatar'}>
                                            <img src={imgUrl + user.avatar} alt={user.fullName}
                                                 className="w-px-40 h-auto rounded-circle"/>
                                        </td>
                                        <td>
                                            <strong>
                                                {user.fullName}
                                                {!user.isActive ? (
                                                    <i className="bx bx-block ms-1 text-danger"></i>) : []}
                                            </strong>
                                        </td>
                                        <td>
                                            <span>{user.phone}</span>
                                        </td>
                                        <td>
                                            <span>{user.email}</span>
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
                                                            data-bs-target="#detailsModal"
                                                        // onClick={() => {
                                                        //     setViewStudio(stu);
                                                        // }}
                                                    >
                                                        <i className="bx bx-detail me-1"></i> View {user.fullName} details
                                                    </button>
                                                    {user.isActive ? (
                                                        <button className="dropdown-item"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#blockModal"
                                                                onClick={() => {
                                                                    setBlockUser(user);
                                                                }}
                                                        >
                                                            <i className="bx bx-block me-1"></i> Block {user.fullName}
                                                        </button>
                                                    ) :(
                                                        <button className="dropdown-item"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#unBlockModal"
                                                                onClick={() => {
                                                                    setBlockUser(user);
                                                                }}
                                                        >
                                                            <i className="bx bx-check me-1"></i> Un-Block {user.fullName}
                                                        </button>
                                                    )}

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

            {/*Details Modal*/}
            {/*<div className="modal fade" id="detailsModal" tabIndex="-1" aria-hidden="true">*/}
            {/*    <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable" role="document">*/}
            {/*        <div className="modal-content">*/}
            {/*            <div className="modal-header">*/}
            {/*                <h4 className="modal-title text-primary">Studio details: <strong*/}
            {/*                    className={'text-info'}>{viewStudio.name}</strong></h4>*/}
            {/*            </div>*/}
            {/*            <div className="modal-body">*/}
            {/*                <div className="row">*/}
            {/*                    <div className="col-md-3 mb-3">*/}
            {/*                        <strong>Address</strong>*/}
            {/*                    </div>*/}
            {/*                    <div className="col-md-9 mb-3">*/}
            {/*                        <p>{viewStudio.address}, {viewStudio.country}</p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="row">*/}
            {/*                    <div className="col-md-3 mb-3">*/}
            {/*                        <strong>Established in</strong>*/}
            {/*                    </div>*/}
            {/*                    <div className="col-md-9 mb-3">*/}
            {/*                        <p>{viewStudio.establishedYear}</p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="row">*/}
            {/*                    <div className="col-md-3 mb-3">*/}
            {/*                        <strong>Website</strong>*/}
            {/*                    </div>*/}
            {/*                    <div className="col-md-9 mb-3">*/}
            {/*                        <p><Link to={viewStudio.website}>{viewStudio.website}</Link></p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="row">*/}
            {/*                    <div className="col-md-3 mb-3">*/}
            {/*                        <strong>Description</strong>*/}
            {/*                    </div>*/}
            {/*                    <div className="col-md-9 mb-3">*/}
            {/*                        <p>{viewStudio.description}</p>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="row">*/}
            {/*                    <div className="col-md-3 mb-3">*/}
            {/*                        <strong>Logo</strong>*/}
            {/*                    </div>*/}
            {/*                    <div className="col-md-3 mb-3">*/}
            {/*                        <img src={imgUrl + viewStudio.logo} alt={viewStudio.name} className={'img-fluid'}*/}
            {/*                             style={{border: '1px solid #6a6cff'}}/>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className="row">*/}
            {/*                    <div className="col-md-3 mb-3">*/}
            {/*                        <strong>Banner</strong>*/}
            {/*                    </div>*/}
            {/*                    <div className="col-md-9 mb-3">*/}
            {/*                        <img src={imgUrl + viewStudio.banner} alt={viewStudio.name} className={'img-fluid'}*/}
            {/*                             style={{border: '1px solid #6a6cff'}}/>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <div className="modal-footer">*/}
            {/*                <button type="button"*/}
            {/*                        className="btn btn-outline-warning"*/}
            {/*                        data-bs-toggle="modal"*/}
            {/*                        data-bs-target="#editModal"*/}
            {/*                        onClick={() => {*/}
            {/*                            setEditStudio(viewStudio);*/}
            {/*                        }}*/}
            {/*                >*/}
            {/*                    <span className="tf-icons bx bx-edit-alt"></span>&nbsp; Edit {viewStudio.name}*/}
            {/*                </button>*/}
            {/*                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"*/}
            {/*                        ref={closeDetailsModal}>*/}
            {/*                    <span className="tf-icons bx bx-x"></span>&nbsp; Cancel*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*Block Modal*/}
            <div className="modal fade" id="blockModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Block user: <span
                                className={'text-danger'}>{blockUser.fullName}</span></h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <strong><span className={'text-danger'}>{blockUser.fullName}</span> will be block to using
                                your services. Are you sure?</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="submit"
                                    className="btn btn-outline-danger"
                                    onClick={handleBlockUser}
                            >
                                <span className="tf-icons bx bx-block"></span>&nbsp; Block
                            </button>
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"
                                    ref={closeBlockModal}>
                                <span className="tf-icons bx bx-x"></span>&nbsp; Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/*Unblock Modal*/}
            <div className="modal fade" id="unBlockModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Un-Block user: <span
                                className={'text-danger'}>{blockUser.fullName}</span></h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <strong><span className={'text-danger'}>{blockUser.fullName}</span> will be un-block and continue using
                                your services. Are you sure?</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="submit"
                                    className="btn btn-outline-success"
                                    onClick={handleUnblockUser}
                            >
                                <span className="tf-icons bx bx-check"></span>&nbsp; Un-Block
                            </button>
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"
                                    ref={closeUnblockModal}>
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
                    <h5 id="offcanvasEndLabel" className="offcanvas-title text-primary">User Filter</h5>
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
                        <label htmlFor="phoneFilter" className="form-label">By Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            id="phoneFilter"
                            placeholder="Phone"
                            name={'phone'}
                            value={phone}
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
    );
}

export default Users;
