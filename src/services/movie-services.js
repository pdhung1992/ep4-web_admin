import {
    API_CREATE_MOVIE, API_MOVIE_DETAILS,
    API_MOVIES_LIST,
    API_UPDATE_MOVIE,
    API_UPDATE_MOVIE_SHOW,
    API_UPDATE_MOVIE_SHOW_AT_HOME
} from "../constants/constants";
import apiServices from "./api-service";


const getAdminMoviesList = async (pageNo, pageSize, sortField, sortDir, title, countryId, axiosConfig) => {
    try {
        const url = `${API_MOVIES_LIST}/admin?pageNo=${pageNo}&pageSize=${pageSize}&sortField=${sortField}&sortDir=${sortDir}&title=${title}&countryId=${countryId}`;
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

const getMovieDetails = async (id, axiosConfig) => {
    try {
        const url = `${API_MOVIE_DETAILS}/${id}`;
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

const createMovie = async (formData, axiosConfig) => {
    try {
        const url = API_CREATE_MOVIE;
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

const updateMovie = async (formData, axiosConfig) => {
    try {
        const url = API_UPDATE_MOVIE;
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

const updateMovieShow = async (formData, axiosConfig) => {
    try {
        const url = API_UPDATE_MOVIE_SHOW;
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

const updateMovieShowAtHome = async (formData, axiosConfig) => {
    try {
        const url = API_UPDATE_MOVIE_SHOW_AT_HOME;
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

const movieServices = {
    createMovie,
    getAdminMoviesList,
    getMovieDetails,
    updateMovie,
    updateMovieShow,
    updateMovieShowAtHome
}

export default movieServices;
