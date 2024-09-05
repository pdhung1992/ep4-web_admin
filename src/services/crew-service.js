import {API_CREWS_POSITIONS} from "../constants/constants";
import apiServices from "./api-service";

const getCrewsPositions = async () => {
    try {
        const url = API_CREWS_POSITIONS;
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

const crewService = {
    getCrewsPositions
}

export default crewService;
