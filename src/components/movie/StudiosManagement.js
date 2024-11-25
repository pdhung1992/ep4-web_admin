import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {DEFAULT_UPLOAD_BANNER, DEFAULT_UPLOAD_LOGO, IMAGE_URL} from "../../constants/constants";
import {useEffect, useRef, useState} from "react";
import movies from "./Movies";
import countriesServices from "../../services/country-services";
import studiosServices from "../../services/studio-services";
import accountServices from "../../services/account-services";
import studioServices from "../../services/studio-services";


const StudiosManagement = () => {
    const admin = useSelector(state => state.auth);
    const imgUrl = IMAGE_URL;

    const token = admin.adminData.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const closeCreateModal = useRef(null);
    const closeDetailsModal = useRef(null);
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

    const [studios, setStudios] = useState([]);
    const [countries, setCountries] = useState([]);

    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sortField, setSortField] = useState('id')
    const [sortDir, setSortDir] = useState('asc')
    const [pageArr, setPageArr] = useState([])
    const pageSizeOptions = [10, 25, 50];
    const [filterChange, setFilterChange] = useState(false);

    const [name, setName] = useState('');
    const [countryId, setCountryId] = useState('');

    const fetchStudios = async () => {
        const data = await studiosServices.getStudios(pageNo, pageSize, sortField, sortDir, name, countryId);
        setStudios(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
    }

    const fetchCountries = async () => {
        const data = await countriesServices.getCountries();
        setCountries(data);
    }

    useEffect(() => {
        fetchCountries();
    },[]);

    useEffect(() => {
        fetchStudios();
    },[pageNo, pageSize, sortField, sortDir, filterChange]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name === 'pageSize') setPageSize(value);
        if (name === 'name') setName(value);
        if (name === 'countryId') setCountryId(value);
    }

    const handleFilter = async () => {
        const data = await studioServices.getStudios(pageNo, pageSize, sortField, sortDir, name, countryId);
        setStudios(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
    }

    const handleClearFilter = async () => {
        setName('');
        setCountryId('');
        const data = await studioServices.getStudios(pageNo, pageSize, sortField, sortDir, name, countryId);
        setStudios(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
        setFilterChange(!filterChange);
    };

    const defaultLogo = DEFAULT_UPLOAD_LOGO;
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(defaultLogo);
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedLogo(file);
            setPreviewLogo(URL.createObjectURL(file));
        } else {
            setSelectedLogo('');
            setPreviewLogo(defaultLogo);
        }
    }

    const defaultBanner = DEFAULT_UPLOAD_BANNER;
    const [selectedBanner, setSelectedBanner] = useState('');
    const [previewBanner, setPreviewBanner] = useState(defaultBanner);
    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedBanner(file);
            setPreviewBanner(URL.createObjectURL(file));
        } else {
            setSelectedBanner('');
            setPreviewBanner(defaultBanner);
        }
    }

    //create studio
    const [initStudio, setInitStudio] = useState({
        name: '',
        description: '',
        logo: '',
        banner: '',
        website: '',
        establishedYear: '',
        address: '',
        countryId: '',
        slug: ''
    });

    const [newStudio, setNewStudio] = useState(initStudio);

    const onChangeStudio = (e) => {
        const {name, value} = e.target;
        setNewStudio(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateStudio = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newStudio.name);
        formData.append('description', newStudio.description);
        if (selectedLogo !== null) {
            formData.append('logo', selectedLogo);
        }
        if (selectedBanner !== null) {
            formData.append('banner', selectedBanner);
        }
        formData.append('website', newStudio.website);
        formData.append('establishedYear', newStudio.establishedYear);
        formData.append('address', newStudio.address);
        formData.append('slug', newStudio.slug);
        formData.append('countryId', newStudio.countryId);

        const data = await studioServices.createStudio(formData, axiosConfig);

        if (data && data.responseCode === 201){
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeCreateModal.current.click();
            setNewStudio(initStudio);
            setSelectedLogo('');
            setPreviewLogo(defaultLogo);
            setSelectedBanner('');
            setPreviewBanner(defaultBanner);
            fetchStudios();
        } else {
            setToastType('danger');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeCreateModal.current.click();
        }
    }

    //view studio details
    const [viewStudio, setViewStudio] = useState({});

    //Edit studio
    const [editStudio, setEditStudio] = useState({});

    const onChangeEditStudio = (e) => {
        const {name, value} = e.target;
        setEditStudio(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const [selectedEditLogo, setSelectedEditLogo] = useState(null);
    const [previewEditLogo, setPreviewEditLogo] = useState(null);
    const handleEditLogoChange = (e) => {
        const file = e.target.files[0];
        setSelectedEditLogo(file);
        setPreviewEditLogo(URL.createObjectURL(file));
    }

    const [selectedEditBanner, setSelectedEditBanner] = useState(null);
    const [previewEditBanner, setPreviewEditBanner] = useState(null);
    const handleEditBannerChange = (e) => {
        const file = e.target.files[0];
        setSelectedEditBanner(file);
        setPreviewEditBanner(URL.createObjectURL(file));
    }

    const handleEditStudio = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', editStudio.id);
        formData.append('name', editStudio.name);
        formData.append('description', editStudio.description);
        if (selectedEditLogo !== null) {
            formData.append('logo', selectedEditLogo);
        }
        if (selectedEditBanner !== null) {
            formData.append('banner', selectedEditBanner);
        }
        formData.append('website', editStudio.website);
        formData.append('establishedYear', editStudio.establishedYear);
        formData.append('address', editStudio.address);
        formData.append('slug', editStudio.slug);
        formData.append('countryId', editStudio.countryId);
        const data = await studioServices.updateStudio(formData, axiosConfig);
        if (data && data.responseCode === 200){
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeEditModal.current.click();
            setEditStudio({});
            setSelectedEditLogo(null);
            setPreviewEditLogo(null);
            setSelectedEditBanner(null);
            setPreviewEditBanner(null);
            fetchStudios();
        }else {
            setToastType('danger');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeEditModal.current.click();
        }
    }

    //Delete studio
    const [deleteStudio, setDeleteStudio] = useState({});
    const handleDeleteStudio = async () => {
        const data = await studioServices.deleteStudio(deleteStudio.id, axiosConfig);
        if (data && data.responseCode === 200){
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            closeDeleteModal.current.click();
            fetchStudios();
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
                            <h3 className={'text-primary mb-0'}>Studios</h3>
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
                                            <span className="tf-icons bx bx-plus"></span>&nbsp; Create new studio
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
                                    <th>Logo</th>
                                    <th>Name</th>
                                    <th>Country</th>
                                    <th>Established year</th>
                                    <th>Website</th>
                                    <th className={'text-center'}>Actions</th>
                                </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                {Array.isArray(studios.data) && studios.data.length > 0 ? studios.data.map((stu, index) => (
                                    <tr key={index}>
                                        <td className={'avatar'}>
                                            <img src={imgUrl + stu.logo} alt={stu.name}
                                                 className="w-px-40 h-auto rounded-circle"/>
                                        </td>
                                        <td>
                                            <strong>{stu.name}</strong>
                                        </td>
                                        <td>
                                            <span>{stu.country}</span>
                                        </td>
                                        <td>
                                            <span>{stu.establishedYear}</span>
                                        </td>
                                        <td>
                                            <Link to={stu.website}>{stu.website}</Link>
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
                                                                setViewStudio(stu);
                                                            }}
                                                    >
                                                        <i className="bx bx-detail me-1"></i> View {stu.name} details
                                                    </button>
                                                    <button className="dropdown-item"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editModal"
                                                        onClick={() => {
                                                            setEditStudio(stu);
                                                        }}
                                                    >
                                                        <i className="bx bx-edit-alt me-1"></i> Edit Studio: {stu.name}
                                                    </button>
                                                    <button className="dropdown-item"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#deleteModal"
                                                            onClick={() => {
                                                                setDeleteStudio(stu);
                                                            }}
                                                    >
                                                        <i className="bx bx-trash me-1"></i> Delete {stu.name}
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
                                    <strong>Showing {studios.fromItem} to {studios.toItem} of {studios.totalItems} entries</strong>
                                </div>
                                <div className="col">
                                    <nav aria-label="Page navigation">
                                        <ul className="pagination pagination-sm justify-content-end">
                                            {studios.currentPage > 1 ? (
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
                                            {studios.currentPage < studios.totalPages ? (
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
                <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Create new studio</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleCreateStudio} encType='multipart/form-data'>
                            <div className="modal-body mb-0">
                                <div className="col mb-3">
                                    <label htmlFor="nameInput" className="form-label">Studio name</label>
                                    <input type="text"
                                           id="nameInput"
                                           className="form-control"
                                           placeholder="Studio name"
                                           name={'name'}
                                           value={newStudio.name}
                                           onChange={onChangeStudio}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="descriptionInput" className="form-label">Description</label>
                                    <textarea id="descriptionInput"
                                              className="form-control"
                                              placeholder="Description"
                                              rows={3}
                                              name={'description'}
                                              value={newStudio.description}
                                              onChange={onChangeStudio}
                                    >
                                    </textarea>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 mb-3">
                                        <label htmlFor="addressInput" className="form-label">Address</label>
                                        <input type="text"
                                               id="addressInput"
                                               className="form-control"
                                               placeholder="Address"
                                               name={'address'}
                                               value={newStudio.address}
                                               onChange={onChangeStudio}
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="countryIdInput" className="form-label">Country</label>
                                        <select
                                            className="form-select"
                                            id="countryIdInput"
                                            name={'countryId'}
                                            value={newStudio.countryId}
                                            onChange={onChangeStudio}
                                        >
                                            <option value="">Select country</option>
                                            {Array.isArray(countries) && countries.length > 0 ? countries.map((country, index) => (
                                                <option key={index} value={country.id}>{country.name}</option>
                                            )) : ([])}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="establishedYearInput" className="form-label">Established
                                            year</label>
                                        <input type="number"
                                               id="establishedYearInput"
                                               className="form-control"
                                               placeholder="Established year"
                                               name={'establishedYear'}
                                               value={newStudio.establishedYear}
                                               onChange={onChangeStudio}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="websiteInput" className="form-label">Website</label>
                                        <input type="text"
                                               id="websiteInput"
                                               className="form-control"
                                               placeholder="Website"
                                               name={'website'}
                                               value={newStudio.website}
                                               onChange={onChangeStudio}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="slugInput" className="form-label">Slug</label>
                                        <input type="text"
                                               id="slugInput"
                                               className="form-control"
                                               placeholder="Slug"
                                               name={'slug'}
                                               value={newStudio.slug}
                                               onChange={onChangeStudio}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="logoInput" className="form-label">Logo (Using 1:1 image)</label>
                                        <input type="file"
                                               id="logoInput"
                                               className="form-control mb-4"
                                               name={'logo'}
                                               accept="image/*"
                                               onChange={handleLogoChange}
                                        />
                                        <div className="logo-wrapper">
                                            <img src={previewLogo} alt="Logo preview"
                                                 className="img-fluid logo-img"/>
                                        </div>
                                    </div>
                                    <div className="col-md-9 mb-3">
                                        <label htmlFor="bannerInput" className="form-label">Banner (Using 3:1
                                            image)</label>
                                        <input type="file"
                                               id="bannerInput"
                                               className="form-control mb-3"
                                               name={'banner'}
                                               accept="image/*"
                                               onChange={handleBannerChange}
                                        />
                                        <div className="banner-wrapper">
                                            <img src={previewBanner} alt="Banner preview"
                                                 className="img-fluid banner-img"/>
                                        </div>
                                    </div>
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

            {/*Details Modal*/}
            <div className="modal fade" id="detailsModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Studio details: <strong
                                className={'text-info'}>{viewStudio.name}</strong></h4>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <strong>Address</strong>
                                </div>
                                <div className="col-md-9 mb-3">
                                    <p>{viewStudio.address}, {viewStudio.country}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <strong>Established in</strong>
                                </div>
                                <div className="col-md-9 mb-3">
                                    <p>{viewStudio.establishedYear}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <strong>Website</strong>
                                </div>
                                <div className="col-md-9 mb-3">
                                    <p><Link to={viewStudio.website}>{viewStudio.website}</Link></p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <strong>Description</strong>
                                </div>
                                <div className="col-md-9 mb-3">
                                    <p>{viewStudio.description}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <strong>Logo</strong>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <img src={imgUrl + viewStudio.logo} alt={viewStudio.name} className={'img-fluid'}
                                         style={{border: '1px solid #6a6cff'}}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <strong>Banner</strong>
                                </div>
                                <div className="col-md-9 mb-3">
                                    <img src={imgUrl + viewStudio.banner} alt={viewStudio.name} className={'img-fluid'}
                                         style={{border: '1px solid #6a6cff'}}/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                    className="btn btn-outline-warning"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editModal"
                                    onClick={() => {
                                        setEditStudio(viewStudio);
                                    }}
                            >
                                <span className="tf-icons bx bx-edit-alt"></span>&nbsp; Edit {viewStudio.name}
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
                <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Edit studio: <span className={'text-info'}>{editStudio.name}</span></h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleEditStudio} encType='multipart/form-data'>
                            <div className="modal-body mb-0">
                                <div className="col mb-3">
                                    <label htmlFor="nameInput" className="form-label">Studio name</label>
                                    <input type="text"
                                           id="nameInput"
                                           className="form-control"
                                           placeholder="Studio name"
                                           name={'name'}
                                           value={editStudio.name}
                                           onChange={onChangeEditStudio}
                                    />
                                </div>
                                <div className="col mb-3">
                                    <label htmlFor="descriptionInput" className="form-label">Description</label>
                                    <textarea id="descriptionInput"
                                              className="form-control"
                                              placeholder="Description"
                                              rows={3}
                                              name={'description'}
                                              value={editStudio.description}
                                              onChange={onChangeEditStudio}
                                    >
                                    </textarea>
                                </div>
                                <div className="row">
                                    <div className="col-md-9 mb-3">
                                        <label htmlFor="addressInput" className="form-label">Address</label>
                                        <input type="text"
                                               id="addressInput"
                                               className="form-control"
                                               placeholder="Address"
                                               name={'address'}
                                               value={editStudio.address}
                                               onChange={onChangeEditStudio}
                                        />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="countryIdInput" className="form-label">Country</label>
                                        <select
                                            className="form-select"
                                            id="countryIdInput"
                                            name={'countryId'}
                                            value={editStudio.countryId || ''}
                                            onChange={onChangeEditStudio}
                                        >
                                            <option value="">Select country</option>
                                            {Array.isArray(countries) && countries.length > 0 ? (
                                                countries.map((country, index) => (
                                                    <option key={index} value={country.id}>
                                                        {country.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">No countries available</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="establishedYearInput" className="form-label">Established
                                            year</label>
                                        <input type="number"
                                               id="establishedYearInput"
                                               className="form-control"
                                               placeholder="Established year"
                                               name={'establishedYear'}
                                               value={editStudio.establishedYear}
                                               onChange={onChangeEditStudio}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="websiteInput" className="form-label">Website</label>
                                        <input type="text"
                                               id="websiteInput"
                                               className="form-control"
                                               placeholder="Website"
                                               name={'website'}
                                               value={editStudio.website}
                                               onChange={onChangeEditStudio}
                                        />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="slugInput" className="form-label">Slug</label>
                                        <input type="text"
                                               id="slugInput"
                                               className="form-control"
                                               placeholder="Slug"
                                               name={'slug'}
                                               value={editStudio.slug}
                                               onChange={onChangeEditStudio}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="logoInput" className="form-label">Logo (Using 1:1 image)</label>
                                        <input type="file"
                                               id="logoInput"
                                               className="form-control mb-4"
                                               name={'logo'}
                                               accept="image/*"
                                               onChange={handleEditLogoChange}
                                        />
                                        <div className="logo-wrapper">
                                            <img src= {previewEditLogo || (IMAGE_URL + editStudio.logo)}
                                                 alt="Logo preview"
                                                 className="img-fluid logo-img"/>
                                        </div>
                                    </div>
                                    <div className="col-md-9 mb-3">
                                        <label htmlFor="bannerInput" className="form-label">Banner (Using 3:1
                                            image)</label>
                                        <input type="file"
                                               id="bannerInput"
                                               className="form-control mb-3"
                                               name={'banner'}
                                               accept="image/*"
                                               onChange={handleEditBannerChange}
                                        />
                                        <div className="banner-wrapper">
                                            <img src={previewEditBanner || (IMAGE_URL + editStudio.banner)} alt="Banner preview"
                                                 className="img-fluid banner-img"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-outline-warning">
                                    <span className="tf-icons bx bx-edit-alt"></span>&nbsp; Update
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
                            <h4 className="modal-title text-primary">Delete studio: <span
                                className={'text-danger'}>{deleteStudio.name}</span></h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <strong><span className={'text-danger'}>{deleteStudio.name}</span> will be removed from studios list. Are you sure?</strong>
                        </div>
                        <div className="modal-footer">
                            <button type="submit"
                                    className="btn btn-outline-danger"
                                    onClick={handleDeleteStudio}
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
                    <h5 id="offcanvasEndLabel" className="offcanvas-title text-primary">Studio Filter</h5>
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
                        <label htmlFor="usernameFilter" className="form-label">By Studio's name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nameFilter"
                            placeholder="Studio's name"
                            name={'name'}
                            value={name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fullNameFilter" className="form-label">By Country</label>
                        <select
                            className="form-select"
                            id="countryIdFilter"
                            name={'countryId'}
                            value={countryId}
                            onChange={handleInputChange}
                        >
                            <option value="">Select country</option>
                            {Array.isArray(countries) && countries.length > 0 ? countries.map((country, index) => (
                                <option key={index} value={country.id}>{country.name}</option>
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
    );
}

export default StudiosManagement;
