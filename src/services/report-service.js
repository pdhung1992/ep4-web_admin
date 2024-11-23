import {
    DASHBOARD_STATISTICS_REPORT_API,
    REVENUE_STATISTICS_REPORT_API,
    TRANSACTIONS_REPORT_TABLE_API
} from "../constants/constants";
import apiServices from "./api-service";


const getTransactions = async (pageNo, pageSize, sortField, sortDir, month, from, axiosConfig) => {
    try {
        const url = `${TRANSACTIONS_REPORT_TABLE_API}?pageNo=${pageNo}&pageSize=${pageSize}&sortField=${sortField}&sortDir=${sortDir}&month=${month}&from=${from}`;
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

const getRevenueStatistics = async (month, axiosConfig) => {
    try {
        const url = `${REVENUE_STATISTICS_REPORT_API}?month=${month}`;
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

const getDashboardStatistics = async (month, axiosConfig) => {
    try {
        const url = `${DASHBOARD_STATISTICS_REPORT_API}?month=${month}`;
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

const reportServices = {
    getTransactions,
    getRevenueStatistics,
    getDashboardStatistics
}

export default reportServices;
