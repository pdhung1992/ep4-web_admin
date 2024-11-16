
import apiServices from "./api-service";
import {
    API_ACCOUNTS_LIST,
    API_CREATE_ACCOUNT,
    API_DELETE_ACCOUNT,
    API_UPDATE_ACCOUNT,
} from "../constants/constants";

const getAccountsList = async (pageNo, pageSize, sortField, sortDir, username, fullName, email, roleId, axiosConfig) => {
    try {
        const url = `${API_ACCOUNTS_LIST}?pageNo=${pageNo}&pageSize=${pageSize}&sortField=${sortField}&sortDir=${sortDir}&username=${username}&fullName=${fullName}&email=${email}&roleId=${roleId}`;
        const res = await apiServices.get(url, axiosConfig);
        return res.data;
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

const createAccount = async (formData) => {
    try {
        const url = API_CREATE_ACCOUNT;
        const res = await apiServices.post(url, formData);
        return res.data;
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

const updateAccount = async (formData) => {
    try {
        const url = API_UPDATE_ACCOUNT;
        const res = await apiServices.put(url, formData);
        return res.data;
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

const deleteAccount = async (id) => {
    try {
        const url = `${API_DELETE_ACCOUNT}/${id}`;
        const res = await apiServices.delete(url);
        return res.data;
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

const accountServices = {
    getAccountsList,
    createAccount,
    updateAccount,
    deleteAccount
}

export default accountServices;
