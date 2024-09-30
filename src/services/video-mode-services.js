import {API_VIDEO_MODES_LIST} from "../constants/constants";
import apiServices from "./api-service";


const getVideoModes = async () => {
    try {
        const url = API_VIDEO_MODES_LIST;
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

const videoModeServices = {
    getVideoModes,
}

export default videoModeServices;
