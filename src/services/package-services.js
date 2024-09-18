import {
    API_CREATE_PACKAGE, API_DELETE_PACKAGE,
    API_PACKAGES_LIST,
    API_PACKAGES_LIST_SELECT,
    API_UPDATE_PACKAGE
} from "../constants/constants";
import apiServices from "./api-service";

const getPackages = async (pageNo, pageSize, sortField, sortDir, name) => {
    try {
        const url = `${API_PACKAGES_LIST}?pageNo=${pageNo}&pageSize=${pageSize}&sortField=${sortField}&sortDir=${sortDir}&name=${name}`;
        const res = await apiServices.get(url);
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

const getPackageSelect = async () => {
    try {
        const url = API_PACKAGES_LIST_SELECT;
        const res = await apiServices.get(url);
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

const createPackage = async (formData, axiosConfig) => {
    try {
        const url = API_CREATE_PACKAGE;
        const res = await apiServices.post(url, formData, axiosConfig);
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

const updatePackage = async (formData, axiosConfig) => {
    try {
        const url = API_UPDATE_PACKAGE;
        const res = await apiServices.put(url, formData, axiosConfig);
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

const deletePackage = async (id, axiosConfig) => {
    try {
        const url = `${API_DELETE_PACKAGE}/${id}`;
        const res = await apiServices.delete(url, axiosConfig);
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

const packageServices = {
    getPackages,
    getPackageSelect,
    createPackage,
    updatePackage,
    deletePackage
}

export default packageServices;
