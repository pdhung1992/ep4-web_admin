import {Helmet} from "react-helmet";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import DashBoard from "../components/DashBoard";
import Accounts from "../components/Accounts";
import {useDispatch, useSelector} from "react-redux";
import Roles from "../components/Roles";
import AccountSettings from "../components/AccountSettings";
import Functions from "../components/Functions";
import {useEffect, useState} from "react";
import {
    ACCOUNT_SETTINGS,
    ACCOUNTS_LIST, API_UPDATE_MOVIE,
    CREATE_MOVIE,
    FUNCTIONS_LIST, MOVIE_DETAILS,
    MOVIES_LIST, PACKAGES_LIST, REVENUE_REPORT,
    ROLES_LIST, STUDIO_LIST, UPDATE_MOVIE, USERS_LIST
} from "../constants/constants";
import Movies from "../components/movie/Movies";
import CreateMovie from "../components/movie/CreateMovie";
import StudiosManagement from "../components/movie/StudiosManagement";
import Packages from "../components/Packages";
import MovieDetails from "../components/movie/MovieDetails";
import Users from "../components/Users";
import RevenueReport from "../components/RevenueReport";
import EditMovie from "../components/movie/EditMovie";


const AdminLayout = () => {

    const admin = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const imgUrl = 'http://localhost:8888/api/images/';

    const token = admin.adminData.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const [functions, setFunctions] = useState([]);
    useEffect(() => {
        setFunctions(admin.adminData.functions);
    }, [admin]);

    const handleLogout = () => {
        dispatch({type: 'LOGOUT'});
        navigate('/login');
    }

    console.log(functions)

    return (
        <div>
            <div className="layout-wrapper layout-content-navbar">
                <div className="layout-container">
                    {/* Menu */}

                    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
                        <div className="app-brand demo">
                            <Link to={'/'} className="app-brand-link">
                              <span className="app-brand-logo demo">
                                <svg
                                    width="25"
                                    viewBox="0 0 25 42"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                >
                                  <defs>
                                    <path
                                        d="M13.7918663,0.358365126 L3.39788168,7.44174259 C0.566865006,9.69408886 -0.379795268,12.4788597 0.557900856,15.7960551 C0.68998853,16.2305145 1.09562888,17.7872135 3.12357076,19.2293357 C3.8146334,19.7207684 5.32369333,20.3834223 7.65075054,21.2172976 L7.59773219,21.2525164 L2.63468769,24.5493413 C0.445452254,26.3002124 0.0884951797,28.5083815 1.56381646,31.1738486 C2.83770406,32.8170431 5.20850219,33.2640127 7.09180128,32.5391577 C8.347334,32.0559211 11.4559176,30.0011079 16.4175519,26.3747182 C18.0338572,24.4997857 18.6973423,22.4544883 18.4080071,20.2388261 C17.963753,17.5346866 16.1776345,15.5799961 13.0496516,14.3747546 L10.9194936,13.4715819 L18.6192054,7.984237 L13.7918663,0.358365126 Z"
                                        id="path-1"
                                    ></path>
                                    <path
                                        d="M5.47320593,6.00457225 C4.05321814,8.216144 4.36334763,10.0722806 6.40359441,11.5729822 C8.61520715,12.571656 10.0999176,13.2171421 10.8577257,13.5094407 L15.5088241,14.433041 L18.6192054,7.984237 C15.5364148,3.11535317 13.9273018,0.573395879 13.7918663,0.358365126 C13.5790555,0.511491653 10.8061687,2.3935607 5.47320593,6.00457225 Z"
                                        id="path-3"
                                    ></path>
                                    <path
                                        d="M7.50063644,21.2294429 L12.3234468,23.3159332 C14.1688022,24.7579751 14.397098,26.4880487 13.008334,28.506154 C11.6195701,30.5242593 10.3099883,31.790241 9.07958868,32.3040991 C5.78142938,33.4346997 4.13234973,34 4.13234973,34 C4.13234973,34 2.75489982,33.0538207 2.37032616e-14,31.1614621 C-0.55822714,27.8186216 -0.55822714,26.0572515 -4.05231404e-15,25.8773518 C0.83734071,25.6075023 2.77988457,22.8248993 3.3049379,22.52991 C3.65497346,22.3332504 5.05353963,21.8997614 7.50063644,21.2294429 Z"
                                        id="path-4"
                                    ></path>
                                    <path
                                        d="M20.6,7.13333333 L25.6,13.8 C26.2627417,14.6836556 26.0836556,15.9372583 25.2,16.6 C24.8538077,16.8596443 24.4327404,17 24,17 L14,17 C12.8954305,17 12,16.1045695 12,15 C12,14.5672596 12.1403557,14.1461923 12.4,13.8 L17.4,7.13333333 C18.0627417,6.24967773 19.3163444,6.07059163 20.2,6.73333333 C20.3516113,6.84704183 20.4862915,6.981722 20.6,7.13333333 Z"
                                        id="path-5"
                                    ></path>
                                  </defs>
                                  <g id="g-app-brand" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g id="Brand-Logo" transform="translate(-27.000000, -15.000000)">
                                      <g id="Icon" transform="translate(27.000000, 15.000000)">
                                        <g id="Mask" transform="translate(0.000000, 8.000000)">
                                          <mask id="mask-2" fill="white">
                                            <use xlinkHref="#path-1"></use>
                                          </mask>
                                          <use fill="#696cff" xlinkHref="#path-1"></use>
                                          <g id="Path-3" mask="url(#mask-2)">
                                            <use fill="#696cff" xlinkHref="#path-3"></use>
                                            <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-3"></use>
                                          </g>
                                          <g id="Path-4" mask="url(#mask-2)">
                                            <use fill="#696cff" xlinkHref="#path-4"></use>
                                            <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-4"></use>
                                          </g>
                                        </g>
                                        <g
                                            id="Triangle"
                                            transform="translate(19.000000, 11.000000) rotate(-300.000000) translate(-19.000000, -11.000000) "
                                        >
                                          <use fill="#696cff" xlinkHref="#path-5"></use>
                                          <use fillOpacity="0.2" fill="#FFFFFF" xlinkHref="#path-5"></use>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </svg>
                              </span>
                              <span className="app-brand-text demo menu-text fw-bolder ms-2">Admin</span>
                            </Link>

                            <Link to={'/'}
                               className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                                <i className="bx bx-chevron-left bx-sm align-middle"></i>
                            </Link>
                        </div>

                        <div className="menu-inner-shadow"></div>

                        <ul className="menu-inner py-1">
                            {/* Dashboard */}
                            <li className="menu-item">
                                <Link to={'/'} className="menu-link">
                                    <i className="menu-icon tf-icons bx bx-home-circle text-primary"></i>
                                    <div data-i18n="Analytics" className={'text-primary'}>Dashboard</div>
                                </Link>
                            </li>

                            {/* Layouts */}
                            <li className="menu-header small text-uppercase"><span
                                className="menu-header-text text-black">Menu Functions</span></li>
                            {Array.isArray(functions) && functions.length > 0 ? functions.map((func, index) => (
                                <li className="menu-item" key={index}>
                                    <Link to={func.slug} className="menu-link menu-toggle">
                                        <i className={`menu-icon tf-icons bx ${func.icon} text-primary`}></i>
                                        <div data-i18n="Account Settings" className={'text-primary'}>{func.name}</div>
                                    </Link>
                                    <ul className="menu-sub">
                                        {Array.isArray(func.childFunctions) && func.childFunctions.length > 0 ? (
                                            func.childFunctions.map((child, index) => (
                                                <li className="menu-item" key={index}>
                                                    <Link to={`${func.slug}/${child.slug}`} className="menu-link">
                                                        <div data-i18n="Account" className={'text-info'}>{child.name}</div>
                                                    </Link>
                                                </li>
                                            ))
                                        ) : null}
                                    </ul>
                                </li>
                            )) : []}

                            <li className="menu-header small text-uppercase"><span
                                className="menu-header-text text-black">Account</span></li>
                            <li className="menu-item">
                                <Link to={ACCOUNT_SETTINGS}
                                      className="menu-link"
                                >
                                    <i className="menu-icon tf-icons bx bx-cog text-primary"></i>
                                    <div data-i18n="Support" className={'text-primary'}>Account settings</div>
                                </Link>
                            </li>
                        </ul>
                    </aside>
                    {/* / Menu */}

                    {/* Layout container */}
                    <div className="layout-page">
                        {/* Navbar */}

                        <nav
                            className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
                            id="layout-navbar"
                        >
                            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                                <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                                    <i className="bx bx-menu bx-sm"></i>
                                </a>
                            </div>

                            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                                {/* Search */}
                                <div className="navbar-nav align-items-center">
                                    <div className="nav-item d-flex align-items-center">
                                        <i className="bx bx-search fs-4 lh-0"></i>
                                        <input
                                            type="text"
                                            className="form-control border-0 shadow-none"
                                            placeholder="Search..."
                                            aria-label="Search..."
                                        />
                                    </div>
                                </div>
                                {/* /Search */}

                                <ul className="navbar-nav flex-row align-items-center ms-auto">
                                    {/* User */}
                                    <li className="nav-item navbar-dropdown dropdown-user dropdown">
                                        <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);"
                                           data-bs-toggle="dropdown">
                                            <div className="avatar avatar-online">
                                                <img src={imgUrl + admin.adminData.avatar} className="w-px-40 h-auto rounded-circle"/>
                                            </div>
                                        </a>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <div className="d-flex">
                                                        <div className="flex-grow-1">
                                                            <strong className="d-block text-primary">{admin.adminData.fullName}</strong>
                                                            <small className="text-info">{admin.adminData.role}</small>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <div className="dropdown-divider"></div>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#">
                                                    <i className="bx bx-user me-2"></i>
                                                    <span className="align-middle">My Profile</span>
                                                </a>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to={ACCOUNT_SETTINGS}>
                                                    <i className="bx bx-cog me-2"></i>
                                                    <span className="align-middle">Settings</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <button className="dropdown-item" onClick={handleLogout}>
                                                    <i className="bx bx-power-off me-2"></i>
                                                    <span className="align-middle">Log Out</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </li>
                                    {/*/ User */}
                                </ul>
                            </div>
                        </nav>

                        {/* / Navbar */}

                        {/* Content wrapper */}
                        <div className="content-wrapper">
                            {/* Content */}
                                <Routes>
                                    <Route path={'/'} element={<DashBoard/>}/>
                                    <Route path={ACCOUNTS_LIST} element={<Accounts/>}/>
                                    <Route path={ROLES_LIST} element={<Roles/>}/>
                                    <Route path={ACCOUNT_SETTINGS} element={<AccountSettings/>}/>
                                    <Route path={FUNCTIONS_LIST} element={<Functions/>}/>
                                    <Route path={MOVIES_LIST} element={<Movies/>}/>
                                    <Route path={CREATE_MOVIE} element={<CreateMovie/>}/>
                                    <Route path={`${UPDATE_MOVIE}/:movieId`} element={<EditMovie/>}/>
                                    <Route path={`${MOVIE_DETAILS}/:slug`} element={<MovieDetails />} />
                                    <Route path={STUDIO_LIST} element={<StudiosManagement/>}/>
                                    <Route path={PACKAGES_LIST} element={<Packages/>}/>
                                    <Route path={USERS_LIST} element={<Users/>}/>
                                    <Route path={REVENUE_REPORT} element={<RevenueReport/>}/>
                                </Routes>
                            {/* / Content */}
                        </div>
                        {/* Content wrapper */}
                    </div>
                    {/* / Layout page */}
                </div>

                {/* Overlay */}
                <div className="layout-overlay layout-menu-toggle"></div>
            </div>
            <Helmet>
                <script type="text/javascript" src="/assets/vendor/js/helpers.js" defer></script>
                <script type="text/javascript" src="/assets/js/config.js" defer></script>
                <script type="text/javascript" src="/assets/vendor/libs/jquery/jquery.js" defer></script>
                <script type="text/javascript" src="/assets/vendor/libs/popper/popper.js" defer></script>
                <script type="text/javascript" src="/assets/vendor/js/bootstrap.js" defer></script>
                <script type="text/javascript" src="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js" defer></script>
                <script type="text/javascript" src="/assets/vendor/js/menu.js" defer></script>
                <script type="text/javascript" src="/assets/vendor/libs/apex-charts/apexcharts.js" defer></script>
                <script type="text/javascript" src="/assets/js/main.js" defer></script>
                <script async defer src="https://buttons.github.io/buttons.js"></script>
            </Helmet>

        </div>
    );
}

export default AdminLayout;
