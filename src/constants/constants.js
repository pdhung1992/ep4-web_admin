
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

//MOVIES
export const MOVIES_LIST = '/movies-management/movies-list';
export const CREATE_MOVIE = '/movies-management/create-movie';
export const MOVIE_DETAILS = '/movies-management/movie-details';
export const UPDATE_MOVIE = '/movies-management/update-movie';
export const STUDIO_LIST = '/movies-management/studios';

export const API_MOVIES_LIST = '/movies';

//Countries

export const API_COUNTRIES_LIST = '/countries';

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
