import apiServices from "./api-service";


const getImages = async (fileName) => {
    try {
        const url = `/images/${fileName}`;
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

const imageServices = {
    getImages
}

export default imageServices;
