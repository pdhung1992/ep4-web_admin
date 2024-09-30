import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {IMAGE_URL} from "../constants/constants";
import {useEffect, useRef, useState} from "react";
import studioServices from "../services/studio-services";
import accountServices from "../services/account-services";
import packageServices from "../services/package-services";


const Packages = () => {

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
    const closeDetailsModal = useRef(null)
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

    const [name, setName] = useState('');

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name === 'pageSize') setPageSize(value);
        if (name === 'name') setName(value);
    }

    const handleFilter = async () => {
        const data = await packageServices.getPackages(pageNo, pageSize, sortField, sortDir, name);
        setPackages(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
    }

    const handleClearFilter = async () => {
        setName('');
        const data = await packageServices.getPackages(pageNo, pageSize, sortField, sortDir, name);
        setPackages(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
        setFilterChange(!filterChange);
    };

    const [packages, setPackages] = useState([]);

    const fetchPackages = async () => {
        const data = await packageServices.getPackages(pageNo, pageSize, sortField, sortDir, name);
        setPackages(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
    }

    useEffect(() => {
        fetchPackages();
    }, [pageNo, pageSize, sortField, sortDir, filterChange]);

    // Create package
    const initPackage = {
        name: '',
        price: '',
        expirationUnit: '',
        description: '',
        slug: '',
    };

    const [newPackage, setNewPackage] = useState(initPackage);

    const onChangePackage = (e) => {
        const {name, value} = e.target;
        setNewPackage(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleCreatePackage = async (e) => {
        e.preventDefault();
        const formData = {
            name: newPackage.name,
            price: newPackage.price,
            expirationUnit: newPackage.expirationUnit,
            description: newPackage.description,
            slug: newPackage.slug,
        }

        console.log('formData', formData);

        const data = await packageServices.createPackage(formData, axiosConfig);
        if (data && data.responseCode === 201){
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeCreateModal.current.click();
            setNewPackage(initPackage);
            fetchPackages();
        } else {
            setToastType('danger');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeCreateModal.current.click();
        }
    }

    //View package
    const [packageDetails, setPackageDetails] = useState({});

    //Edit package
    const [editPackage, setEditPackage] = useState({});

    const onChangeEditPackage = (e) => {
        const {name, value} = e.target;
        setEditPackage(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleEditPackage = async (e) => {
        e.preventDefault();
        const formData = {
            id: editPackage.id,
            name: editPackage.name,
            price: editPackage.price,
            expirationUnit: editPackage.expirationUnit,
            description: editPackage.description,
            slug: editPackage.slug,
        }

        const data = await packageServices.updatePackage(formData, axiosConfig);
        if (data && data.responseCode === 200){
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeEditModal.current.click();
            setEditPackage({});
            fetchPackages();
        } else {
            setToastType('danger');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeEditModal.current.click();
        }
    }

    //Delete package
    const [deletePackage, setDeletePackage] = useState({});
    const handleDeletePackage = async () => {
        const data = await packageServices.deletePackage(deletePackage.id, axiosConfig);
        if (data && data.responseCode === 200){
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeDeleteModal.current.click();
            fetchPackages();
        } else {
            setToastType('danger');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeDeleteModal.current.click();
        }
    }


    return (
        <div className={'content-wrapper'}>
            <div className={'container-xxl flex-grow-1 container-p-y'}>
                <div className="card">
                    <div className="card-body p-4">
                        <div className="table-responsive text-nowrap">
                            <h3 className={'text-primary mb-0'}>Packages</h3>
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
                                            <span className="tf-icons bx bx-plus"></span>&nbsp; Create new package
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
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Expired days</th>
                                    <th className={'text-center'}>Actions</th>
                                </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                {Array.isArray(packages.data) && packages.data.length > 0 ? packages.data.map((pkg, index) => (
                                    <tr key={index}>
                                        <td>
                                            <strong>{pkg.name}</strong>
                                        </td>
                                        <td>
                                            <span>$ {pkg.price}</span>
                                        </td>
                                        <td>
                                            <span>{pkg.expirationUnit} days</span>
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
                                                            onClick={() => {
                                                                setPackageDetails(pkg);
                                                            }}
                                                    >
                                                        <i className="bx bxs-lock-open me-1"></i> View {pkg.name} details
                                                    </button>
                                                    <button className="dropdown-item"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editModal"
                                                            onClick={() => {
                                                                setEditPackage(pkg);
                                                            }}
                                                    >
                                                        <i className="bx bx-edit-alt me-1"></i> Edit {pkg.name}
                                                    </button>

                                                    <button className="dropdown-item"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteModal"
                                                            onClick={() => {
                                                                setDeletePackage(pkg);
                                                            }}
                                                    >
                                                        <i className="bx bx-trash me-1"></i> Delete {pkg.name}
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
                                    <strong>Showing {packages.fromItem} to {packages.toItem} of {packages.totalItems} entries</strong>
                                </div>
                                <div className="col">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination pagination-sm justify-content-end">
                                            {packages.currentPage > 1 ? (
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
                                            {packages.currentPage < packages.totalPages ? (
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
                            <h4 className="modal-title text-primary">Create new package</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleCreatePackage}>
                            <div className="modal-body">
                                <div className="col mb-3">
                                    <label htmlFor="nameInput" className="form-label">Name</label>
                                    <input type="text"
                                           id="nameInput"
                                           className="form-control"
                                           placeholder="Package name"
                                           name={'name'}
                                           value={newPackage.name}
                                           onChange={onChangePackage}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="priceInput" className="form-label">Price</label>
                                        <div className="input-group input-group-merge">
                                            <span className="input-group-text">$</span>
                                            <input type="number"
                                                   id="priceInput"
                                                   className="form-control"
                                                   placeholder="Price"
                                                   name={'price'}
                                                   value={newPackage.price}
                                                   onChange={onChangePackage}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="expirationUnitInput" className="form-label">Expired days</label>
                                        <div className="input-group input-group-merge">
                                            <input type="text"
                                                   id="expirationUnitInput"
                                                   className="form-control"
                                                   placeholder="Expired"
                                                   name={'expirationUnit'}
                                                   value={newPackage.expirationUnit}
                                                   onChange={onChangePackage}
                                            />
                                            <span className="input-group-text">days</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="slugInput" className="form-label">Slug</label>
                                        <input type="text"
                                               id="slugInput"
                                               className="form-control"
                                               placeholder="Slug"
                                               name={'slug'}
                                               value={newPackage.slug}
                                               onChange={onChangePackage}
                                        />
                                    </div>
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="descriptionInput" className="form-label">Descriptions</label>
                                    <textarea id="descriptionInput"
                                              className="form-control"
                                              placeholder="Decsriptions"
                                              name={'description'}
                                              value={newPackage.description}
                                              onChange={onChangePackage}
                                    />
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

            {/*Details Modal*/}
            <div className="modal fade" id="detailsModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Package details: <strong className={'text-info'}>{packageDetails.name}</strong></h4>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <strong>Price</strong>
                                </div>
                                <div className="col-md-9 mb-3">
                                    <p>$ {packageDetails.price}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <strong>Expire after</strong>
                                </div>
                                <div className="col-md-9 mb-3">
                                    <p>{packageDetails.expirationUnit} days</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <strong>Description</strong>
                                </div>
                                <div className="col-md-9 mb-3">
                                    <p>{packageDetails.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                    className="btn btn-outline-warning"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editModal"
                                    onClick={() => {
                                        setEditPackage(packageDetails);
                                    }}
                            >
                                <span className="tf-icons bx bx-edit-alt"></span>&nbsp; Edit {packageDetails.name}
                            </button>
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"
                                    ref={closeDetailsModal}>
                                <span className="tf-icons bx bx-x"></span>&nbsp; Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/*Edit Modal*/}
            <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Edit package <span
                                className={'text-info'}>{editPackage.name}</span></h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleEditPackage}>
                            <div className="modal-body">
                                <div className="col mb-3">
                                    <label htmlFor="nameInput" className="form-label">Name</label>
                                    <input type="text"
                                           id="nameInput"
                                           className="form-control"
                                           placeholder="Package name"
                                           name={'name'}
                                           value={editPackage.name}
                                           onChange={onChangeEditPackage}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="priceInput" className="form-label">Price</label>
                                        <div className="input-group input-group-merge">
                                            <span className="input-group-text">$</span>
                                            <input type="number"
                                                   id="priceInput"
                                                   className="form-control"
                                                   placeholder="Price"
                                                   name={'price'}
                                                   value={editPackage.price}
                                                   onChange={onChangeEditPackage}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="expirationUnitInput" className="form-label">Expired days</label>
                                        <div className="input-group input-group-merge">
                                            <input type="text"
                                                   id="expirationUnitInput"
                                                   className="form-control"
                                                   placeholder="Expired"
                                                   name={'expirationUnit'}
                                                   value={editPackage.expirationUnit}
                                                   onChange={onChangeEditPackage}
                                            />
                                            <span className="input-group-text">days</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="slugInput" className="form-label">Slug</label>
                                        <input type="text"
                                               id="slugInput"
                                               className="form-control"
                                               placeholder="Slug"
                                               name={'slug'}
                                               value={editPackage.slug}
                                               onChange={onChangeEditPackage}
                                        />
                                    </div>
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="descriptionInput" className="form-label">Descriptions</label>
                                    <textarea id="descriptionInput"
                                              className="form-control"
                                              placeholder="Decsriptions"
                                              name={'description'}
                                              value={editPackage.description}
                                              onChange={onChangeEditPackage}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit"
                                        className="btn btn-outline-success"
                                >
                                    <span className="tf-icons bx bx-plus"></span>&nbsp; Update
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
                            <h4 className="modal-title text-primary">Delete package: <span
                                className={'text-danger'}>{deletePackage.name}</span></h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <strong>{deletePackage.name} will be removed from packages list. Are you sure?</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="submit"
                                    className="btn btn-outline-danger"
                                    onClick={handleDeletePackage}
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
                    <h5 id="offcanvasEndLabel" className="offcanvas-title text-primary">Package Filter</h5>
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
                        <label htmlFor="usernameFilter" className="form-label">By Package's name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nameFilter"
                            placeholder="Package's name"
                            name={'name'}
                            value={name}
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
    )
}

export default Packages;
