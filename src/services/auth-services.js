import apiServices from "./api-service";
import {
    ADMIN_CHANGE_AVATAR,
    ADMIN_CHANGE_PASSWORD,
    ADMIN_FORGOT_PASSWORD, ADMIN_GET_NEW_AVATAR,
    ADMIN_LOGIN, ADMIN_LOGOUT,
    ADMIN_RESET_PASSWORD
} from "../constants/constants";


const adminLogin = async (formData) => {
    try {
        const url = ADMIN_LOGIN;
        const res = await apiServices.post(url, formData);
        return res.data
    }
    catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const adminLogout = async () => {
    try {
        const url = ADMIN_LOGOUT;
        await sessionStorage.removeItem('admin');
        await apiServices.get(url);
        return true;
    }
    catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const changeAvatar = async (formData, axiosConfig) => {
    try {
        const url = ADMIN_CHANGE_AVATAR;
        const res = await apiServices.post(url, formData, axiosConfig);
        return res.data
    }
    catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const getNewAvatar = async (axiosConfig) => {
    try {
        const url = ADMIN_GET_NEW_AVATAR;
        const res = await apiServices.get(url, axiosConfig);
        return res.data
    }catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const changePassword = async (formData, axiosConfig) => {
    try {
        const url = ADMIN_CHANGE_PASSWORD;
        const res = await apiServices.post(url, formData, axiosConfig);
        return res.data
    }
    catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const forgotPassword = async (formData) => {
    try {
        const url = ADMIN_FORGOT_PASSWORD;
        const res = await apiServices.post(url, formData);
        return res.data
    }
    catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const resetPassword = async (formData) => {
    try {
        const url = ADMIN_RESET_PASSWORD;
        const res = await apiServices.post(url, formData);
        return res.data
    }
    catch (error){
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const authServices = {
    adminLogin,
    adminLogout,
    changeAvatar,
    getNewAvatar,
    changePassword,
    forgotPassword,
    resetPassword
}

export default authServices;
