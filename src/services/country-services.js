import apiServices from "./api-service";
import {API_COUNTRIES_LIST} from "../constants/constants";

const getCountries = async () => {
    try {
        const url = API_COUNTRIES_LIST;
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

const countriesServices = {
    getCountries,
}

export default countriesServices;
