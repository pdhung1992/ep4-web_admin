import {API_CATEGORIES_LIST, API_CATEGORIES_LIST_SELECT} from "../constants/constants";
import apiServices from "./api-service";


const getCategories = async () => {
    try {
        const url = API_CATEGORIES_LIST;
        const res = await apiServices.get(url);
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

const getAllCategoriesSelect = async () => {
    try {
        const url = API_CATEGORIES_LIST_SELECT;
        const res = await apiServices.get(url);
        return res.data;
    }catch (error) {
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return 'No response from server';
        } else {
            return 'An error occurred';
        }
    }
}

const categoryServices = {
    getCategories,
    getAllCategoriesSelect
}

export default categoryServices;
