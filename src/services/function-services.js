import {API_FUNCTIONS_LIST, API_GET_FUNCTION_BY_ROLE, API_GET_PARENT_FUNCTIONS} from "../constants/constants";
import apiServices from "./api-service";


const getFunctions = async () => {
    try {
        const url = API_FUNCTIONS_LIST;
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

const getParentFunctions = async () => {
    try {
        const url = API_GET_PARENT_FUNCTIONS;
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

const getFunctionByRole = async (roleId) => {
    try {
        const url = API_GET_FUNCTION_BY_ROLE + roleId;
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

const functionServices = {
    getFunctions,
    getParentFunctions,
    getFunctionByRole
}

export default functionServices;
