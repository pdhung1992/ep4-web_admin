import apiServices from "./api-service";
import {ADMIN_CHANGE_AVATAR, ADMIN_CHANGE_PASSWORD, ADMIN_LOGIN} from "../constants/constants";


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
        await sessionStorage.removeItem('admin');
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

const changeAvatar = async (formData) => {
    try {
        const url = ADMIN_CHANGE_AVATAR;
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

const changePassword = async (formData) => {
    try {
        const url = ADMIN_CHANGE_PASSWORD;
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
    changePassword
}

export default authServices;
