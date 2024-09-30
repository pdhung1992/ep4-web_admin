import {API_GENRES_LIST} from "../constants/constants";
import apiServices from "./api-service";


const getGenres = async () => {
    try {
        const url = API_GENRES_LIST;
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

const genreServices = {
    getGenres,
}

export default genreServices;
