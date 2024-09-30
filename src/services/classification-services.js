import {API_CLASSIFICATIONS_LIST, API_CLASSIFICATIONS_LIST_SELECT} from "../constants/constants";
import apiServices from "./api-service";


const getClassification = async (data) => {
    try {
        const url = API_CLASSIFICATIONS_LIST;
        const res = await apiServices.post(url, data);
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

const getClassificationSelect = async () => {
    try {
        const url = API_CLASSIFICATIONS_LIST_SELECT;
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

const classificationServices = {
    getClassification,
    getClassificationSelect
}

export default classificationServices;
