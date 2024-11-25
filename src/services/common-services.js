import {CHECK_AND_CREATE_SLUG_API} from "../constants/constants";
import apiServices from "./api-service";


const checkAndCreateSlug = async (slugCase, title, additionalIfExist) => {
    try {
        const url = `${CHECK_AND_CREATE_SLUG_API}?slugCase=${slugCase}&title=${title}&additionalIfExist=${additionalIfExist}`;
        console.log(url);
        const res = await apiServices.get(url);
        return res;
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

const commonServices = {
    checkAndCreateSlug
}

export default commonServices;
