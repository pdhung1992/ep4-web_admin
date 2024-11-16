import {CHANGE_AVATAR, LOGIN_FAIL, LOGIN_SUCCESS, LOGOUT} from "../actions/actionTypes";

const initialState = {
    isLoggedIn : false,
    adminData : null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case LOGIN_SUCCESS:
            return{
                ...state,
                isLoggedIn: true,
                adminData: action.payload.adminData
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                adminData: null
            }
        case CHANGE_AVATAR:
            return {
                ...state,
                adminData: {
                    ...state.adminData,
                    avatar: action.payload.avatar,
                },
            };
        default:
            return state;
    }
}

export default authReducer;
