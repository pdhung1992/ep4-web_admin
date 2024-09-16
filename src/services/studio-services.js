import {API_CREATE_STUDIO, API_DELETE_STUDIO, API_STUDIOS_LIST, API_UPDATE_STUDIO} from "../constants/constants";
import apiServices from "./api-service";


const getStudios = async (pageNo, pageSize, sortField, sortDir, name, countryId) => {
    try {
        const url = `${API_STUDIOS_LIST}?pageNo=${pageNo}&pageSize=${pageSize}&sortField=${sortField}&sortDir=${sortDir}&name=${name}&countryId=${countryId}`;
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

const createStudio = async (formData, axiosConfig) => {
    try {
        const url = API_CREATE_STUDIO;
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

const updateStudio = async (formData, axiosConfig) => {
    try {
        const url = API_UPDATE_STUDIO;
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

const deleteStudio = async (id) => {
    try {
        const url = `${API_DELETE_STUDIO}/${id}`;
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

const studiosServices = {
    getStudios,
    createStudio,
    updateStudio,
    deleteStudio
}

export default studiosServices;
