import {API_BLOCK_USER, API_UNBLOCK_USER, API_USERS_LIST} from "../constants/constants";
import apiServices from "./api-service";


const getAllUsers = async (pageNo, pageSize, sortField, sortDir, fullName, phone, email, axiosConfig) => {
    try {
        const url = `${API_USERS_LIST}?pageNo=${pageNo}&pageSize=${pageSize}&sortField=${sortField}&sortDir=${sortDir}&fullName=${fullName}&phone=${phone}&email=${email}`;
        const res = await apiServices.get(url, axiosConfig);
        return res.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const blockUser = async (formData, axiosConfig) => {
    try {
        const url = API_BLOCK_USER;
        const res = await apiServices.put(url, formData, axiosConfig);
        return res.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const unblockUser = async (formData, axiosConfig) => {
    try {
        const url = API_UNBLOCK_USER;
        const res = await apiServices.put(url, formData, axiosConfig);
        return res.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const userServices = {
    getAllUsers,
    blockUser,
    unblockUser
}

export default userServices;
