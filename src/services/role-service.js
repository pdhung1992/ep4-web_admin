import apiServices from "./api-service";
import {
    API_CREATE_ROLE,
    API_DELETE_ROLE,
    API_ROLES_LIST,
    API_UPDATE_ROLE,
    API_UPDATE_ROLE_FUNCTIONS
} from "../constants/constants";


const getRoles = async (pageNo, pageSize, sortField, sortDir, filterChange) => {
    try {
        const url = `${API_ROLES_LIST}?pageNo=${pageNo}&pageSize=${pageSize}&sortField=${sortField}&sortDir=${sortDir}&filterChange=${filterChange}`;
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

const getRolesChoice = async (pageNo, pageSize, sortField, sortDir, filterChange) => {
    try {
        const url = `${API_ROLES_LIST}/all?pageNo=${pageNo}&pageSize=${pageSize}&sortField=${sortField}&sortDir=${sortDir}&filterChange=${filterChange}`;
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

const createRole = async (formData) => {
    try {
        const url = API_CREATE_ROLE;
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

const updateRole = async (formData) => {
    try {
        const url = API_UPDATE_ROLE;
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

const deleteRole = async (id) => {
    try {
        const url = `${API_DELETE_ROLE}/${id}`;
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

const updateRoleFunctions = async (roleId, functionIds) => {
    try {
        const url = API_UPDATE_ROLE_FUNCTIONS + roleId;
        const res = await apiServices.put(url, functionIds);
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

const roleServices = {
    getRoles,
    getRolesChoice,
    createRole,
    updateRole,
    updateRoleFunctions,
    deleteRole
}

export default roleServices;
