import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {CREATE_MOVIE, IMAGE_URL, MOVIE_DETAILS} from "../../constants/constants";
import {useEffect, useRef, useState} from "react";
import movieServices from "../../services/movie-services";
import packageService from "../../services/package-services";
import languageServices from "../../services/language-services";
import genreServices from "../../services/genre-services";
import countryServices from "../../services/country-services";
import studioServices from "../../services/studio-services";
import classificationServices from "../../services/classification-services";
import videoModeServices from "../../services/video-mode-services";


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

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        if (name === 'pageSize') setPageSize(value);
        if (name === 'title') setTitle(value);
        if (name === 'countryId') setCountryId(value);
    }

    const [packageList, setPackageList] = useState([]);
    const fetchPackages = async () => {
        const res = await packageService.getPackageSelect();
        setPackageList(res);
    }

    const [languages, setLanguages] = useState([]);
    const fetchLanguages = async () => {
        const res = await languageServices.getLanguages();
        setLanguages(res);
    }

    const [genres, setGenres] = useState([]);
    const fetchGenres = async () => {
        const res = await genreServices.getGenres();
        setGenres(res);
    }

    const [countries, setCountries] = useState([]);
    const fetchCountries = async () => {
        const res = await countryServices.getCountries();
        setCountries(res);
    }

    const [studios, setStudios] = useState([]);
    const fetchStudios = async () => {
        const res = await studioServices.getStudiosSelect();
        setStudios(res);
    }

    const [classifications, setClassifications] = useState([]);
    const fetchClassifications = async () => {
        const res = await classificationServices.getClassificationSelect();
        setClassifications(res);
    }

    const [videoModes, setVideoModes] = useState([]);
    const fetchVideoModes = async () => {
        const res = await videoModeServices.getVideoModes();
        setVideoModes(res);
    }

    useEffect(() => {
        fetchPackages();
        fetchLanguages();
        fetchGenres();
        fetchCountries();
        fetchStudios();
        fetchClassifications();
        fetchVideoModes();
    }, []);

    const handleFilter = async () => {
        const data = await movieServices.getAdminMoviesList(pageNo, pageSize, sortField, sortDir, title, countryId, axiosConfig);
        setMovies(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
    }

    const handleClearFilter = async () => {
        setTitle('');
        setCountryId('');
        const data = await movieServices.getAdminMoviesList(pageNo, pageSize, sortField, sortDir, title, countryId, axiosConfig);
        setMovies(data);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
        setFilterChange(!filterChange);
    };

    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [countryId, setCountryId] = useState('');

    const fetchMovies = async () => {
        const res = await movieServices.getAdminMoviesList(pageNo, pageSize, sortField, sortDir, title, countryId, axiosConfig);
        setMovies(res);
        setPageArr(Array.from({length: res.totalPages}, (v, i) => i + 1));
    }

    useEffect(() => {
        fetchMovies();
    }, [pageNo, pageSize, sortField, sortDir, title, countryId, filterChange]);

    const handleViewDetails = (movie) => {
        navigate(`${MOVIE_DETAILS}/${movie.slug}` , { state: { movieId: movie.id } });
    }

    const onChangeShow = (e, movie) => {
        const show = e.target.checked;
        movie.show = show;
        setMovies({...movies, show: show});
        handleChangeShow(movie);
    }
    const handleChangeShow = async (movie) => {
        const formData = new FormData();
        formData.append('id', movie.id);
        formData.append('isShow', movie.show);
        const data = await movieServices.updateMovieShow(formData, axiosConfig);
        if (data && data.responseCode === 200) {
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            fetchMovies();
        } else {
            setToastType('danger');
            setToastMessage(data.responseMessage);
            setShowToast(true);
        }
    }

    const onChangeShowAtHome = (e, movie) =>{
        console.log(movie);
        const showAtHome = e.target.checked;
        movie.showAtHome = showAtHome;
        setMovies({...movies, showAtHome: showAtHome});
        handleChangeShowAtHome(movie);
    }
    const handleChangeShowAtHome = async (movie) => {
        const formData = new FormData();
        formData.append('id', movie.id);
        formData.append('isShowAtHome', movie.showAtHome);
        const data = await movieServices.updateMovieShowAtHome(formData, axiosConfig);
        if (data && data.responseCode === 200) {
            setToastType('success');
            setToastMessage(data.responseMessage);
            setShowToast(true);
            fetchMovies();
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
                            <h3 className={'text-primary mb-0'}>Movies</h3>
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
                                        <Link type="button"
                                              className="btn btn-sm btn-success"
                                              to={CREATE_MOVIE}
                                        >
                                            <span className="tf-icons bx bx-plus"></span>&nbsp; Create new movie
                                        </Link>
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
                                    <th>Poster</th>
                                    <th>Title</th>
                                    <th>Views</th>
                                    <th>Duration</th>
                                    <th>Release Year</th>
                                    <th>Status</th>
                                    <th>Show at home</th>
                                    <th className={'text-center'}>Actions</th>
                                </tr>
                                </thead>
                                <tbody className="table-border-bottom-0">
                                {Array.isArray(movies.data) && movies.data.length > 0 ? movies.data.map((movie, index) => (
                                    <tr key={index}>
                                        <td className={'d-flex align-items-center'}>
                                            <img src={IMAGE_URL + movie.poster} className={'img-fluid'} style={{width: '50px'}}/>
                                        </td>
                                        <td>
                                            <div className={'d-flex flex-column'}>
                                                <strong>{movie.title}</strong>
                                                <p>[{movie.originalTitle}]</p>
                                            </div>
                                        </td>
                                        <td>
                                            <span>{movie.views ? movie.views : 0}</span>
                                        </td>
                                        <td>
                                            <span>{movie.duration} minutes</span>
                                        </td>
                                        <td>
                                            <span>{movie.releaseYear}</span>
                                        </td>
                                        <td>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={movie.show ? true : false}
                                                    onChange={(e) => onChangeShow(e, movie)}
                                                />
                                                <span className={`badge bg-label-${movie.show ? 'success' : 'secondary'}  ms-1`}>{movie.show ? 'Showing' : 'Not show'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={movie.showAtHome ? true : false}
                                                    onChange={(e) => onChangeShowAtHome(e, movie)}
                                                />
                                                <span
                                                    className={`badge bg-label-${movie.showAtHome ? 'success' : 'secondary'}  ms-1`}>{movie.showAtHome ? 'Showing' : 'Not show'}</span>
                                            </div>
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
                                                            onClick={() => handleViewDetails(movie)}
                                                    >
                                                        <i className="bx bx-detail me-1"></i> View {movie.title} details
                                                    </button>
                                                    <button className="dropdown-item"
                                                            // data-bs-toggle="modal"
                                                            // data-bs-target="#editModal"
                                                            // onClick={() => {
                                                            //     setEditStudio(stu);
                                                            // }}
                                                    >
                                                        <i className="bx bx-edit-alt me-1"></i> Edit Movie: {movie.title}
                                                    </button>
                                                    <button className="dropdown-item"
                                                            // data-bs-toggle="modal"
                                                            // data-bs-target="#deleteModal"
                                                            // onClick={() => {
                                                            //     setDeleteStudio(stu);
                                                            // }}
                                                    >
                                                        <i className="bx bx-trash me-1"></i> Delete {movie.title}
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

            {/*Filters Offcanvas*/}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="filtersOffcanvas"
                aria-labelledby="offcanvasEndLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="offcanvasEndLabel" className="offcanvas-title text-primary">Movie Filter</h5>
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
                        <label htmlFor="titleFilter" className="form-label">By Movie's title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="titleFilter"
                            placeholder="Movie's Title"
                            name={'title'}
                            value={title}
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
    )
}

export default Movies;
