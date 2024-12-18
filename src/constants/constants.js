
//Auth
export const ADMIN_LOGIN = 'auth/admin/login';
export const ADMIN_LOGOUT = 'auth/admin/logout';
export const ADMIN_CHANGE_AVATAR = 'auth/admin/change-avatar';
export const ADMIN_CHANGE_PASSWORD = 'auth/admin/change-password';
export const ADMIN_GET_NEW_AVATAR = 'auth/admin/get-new-avatar';
export const ADMIN_FORGOT_PASSWORD = 'auth/admin/forgot-password';
export const ADMIN_RESET_PASSWORD = 'auth/admin/reset-password';

//Accounts
export const ACCOUNTS_LIST = '/accounts-management/accounts-list';
export const CREATE_ACCOUNT = '/accounts-management/create-account';
export const ACCOUNT_DETAILS = '/accounts-management/user-details';
export const UPDATE_ACCOUNT = '/accounts-management/update-account';
export const DELETE_ACCOUNT = '/accounts-management/delete-account';
export const ACCOUNT_SETTINGS = '/accounts-management/account-settings';
export const API_ACCOUNTS_LIST = '/accounts';
export const API_CREATE_ACCOUNT = '/accounts/create';
export const API_UPDATE_ACCOUNT = '/accounts/update';
export const API_DELETE_ACCOUNT = '/accounts/delete';

//Users
export const USERS_LIST = '/users-management/user-list';
export const CREATE_USER = '/users-management/create-user';
export const USER_DETAILS = '/users-management/user-details';
export const UPDATE_USER = '/users-management/update-user';
export const DELETE_USER = '/users-management/delete-user';

export const API_USERS_LIST = '/users/admin/all-users';
export const API_BLOCK_USER = '/users/admin/block-user';
export const API_UNBLOCK_USER = '/users/admin/unblock-user';

//Roles
export const ROLES_LIST = '/roles-management/roles-list';
export const CREATE_ROLE = '/roles-management/create-role';
export const ROLE_DETAILS = '/roles-management/role-details';
export const UPDATE_ROLE = '/roles-management/update-role';
export const DELETE_ROLE = '/roles-management/delete-role';
export const API_ROLES_LIST = '/roles';
export const API_CREATE_ROLE = '/roles/create';
export const API_UPDATE_ROLE = '/roles/update';
export const API_DELETE_ROLE = '/roles/delete';
export const API_UPDATE_ROLE_FUNCTIONS = '/roles/role-functions-update/';

//Functions
export const FUNCTIONS_LIST = '/roles-management/functions-list';
export const API_FUNCTIONS_LIST = '/functions';
export const API_GET_PARENT_FUNCTIONS = '/functions/parents';
export const API_GET_FUNCTION_BY_ROLE = '/functions/parents-by-role/';

//IMAGES
export const IMAGE_URL = 'http://localhost:8888/api/images/';

export const DEFAULT_POSTER = '/assets/img/demo/default_poster.png';
export const DEFAULT_AVATAR = '/assets/img/demo/default_avatar.png';
export const DEFAULT_UPLOAD_LOGO = '/assets/img/demo/upload_photo_default.png';
export const DEFAULT_UPLOAD_BANNER = '/assets/img/demo/upload_banner_default.png';
export const DEFAULT_UPLOAD_IMAGE = '/assets/img/demo/default_image.png';

//MOVIES
export const MOVIES_LIST = '/movies-management/movies-list';
export const CREATE_MOVIE = '/movies-management/create-movie';
export const MOVIE_DETAILS = '/movies-management/movie-details';
export const UPDATE_MOVIE = '/movies-management/update-movie';
export const STUDIO_LIST = '/movies-management/studios';

export const API_MOVIE_LIST = '/movies';
export const API_MOVIE_DETAILS = '/movies/admin/details';
export const API_CREATE_MOVIE = '/movies/create';
export const API_UPDATE_MOVIE = '/movies/update';
export const API_UPDATE_MOVIE_SHOW = '/movies/update/show';
export const API_UPDATE_MOVIE_SHOW_AT_HOME = '/movies/update/showAtHome';
export const API_DELETE_MOVIE = '/movies/delete';

export const API_MOVIES_LIST = '/movies';

//Countries

export const API_COUNTRIES_LIST = '/countries';

//Genres

export const API_GENRES_LIST = '/genres';

//Languages

export const API_LANGUAGES_LIST = '/languages';

//Classifications

export const API_CLASSIFICATIONS_LIST = '/classifications';
export const API_CLASSIFICATIONS_LIST_SELECT = '/classifications/select';

//Categories

export const API_CATEGORIES_LIST = '/categories';
export const API_CATEGORIES_LIST_SELECT = '/categories/select';

//Video modes

export const API_VIDEO_MODES_LIST = '/videomodes';

//studios

export const API_STUDIOS_LIST = '/studios';
export const API_STUDIOS_LIST_SELECT = '/studios/select';
export const API_CREATE_STUDIO = '/studios/create';
export const API_UPDATE_STUDIO = '/studios/update';
export const API_DELETE_STUDIO = '/studios/delete';

//Crews
export const API_CREWS_POSITIONS = '/crew-positions';

//Packages
export const PACKAGES_LIST = '/packages-management/packages-list';

export const API_PACKAGES_LIST = '/packages';
export const API_PACKAGES_LIST_SELECT = '/packages/select';
export const API_CREATE_PACKAGE = '/packages/create';
export const API_UPDATE_PACKAGE = '/packages/update';
export const API_DELETE_PACKAGE = '/packages/delete';

//Reports
export const REVENUE_REPORT = '/reports/revenue-report';

export const TRANSACTIONS_REPORT_TABLE_API = '/reports/revenue/transactions';
export const TRANSACTION_EXPORT_API = '/reports/revenue/export';
export const REVENUE_STATISTICS_REPORT_API = '/reports/revenue/statistics';
export const DASHBOARD_STATISTICS_REPORT_API = '/reports/dashboard/statistics';
export const REVENUE_BY_DAYS_REPORT_API = '/reports/dashboard/revenue';

//Bs Colors
export const BS_COLORS = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'dark'
];

//Slugs
export const CHECK_AND_CREATE_SLUG_API = '/common/slug';
