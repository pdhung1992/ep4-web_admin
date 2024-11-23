import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {IMAGE_URL} from "../constants/constants";
import {useEffect, useState} from "react";
import ReactOdometer from "react-odometerjs";
import "odometer/themes/odometer-theme-default.css";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import reportServices from "../services/report-service";


const DashBoard = () => {
    const admin = useSelector(state => state.auth.adminData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const imgUrl = IMAGE_URL;

    const token = admin.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const [months, setMonths] = useState([]);
    const monthOptions = () => {
        const currentDate = new Date();
        const result = [];

        for (let i = 0; i < 12; i++) {
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            result.push(`${year}-${month}`);
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        setMonths(result);
    };

    useEffect(() => {
        monthOptions();
    }, []);

    const [selectedMonth, setSelectedMonth] = useState('');
    const onChangeMonth = (e) => {
        setSelectedMonth(e.target.value);
    }

    const [statistics, setStatistics] = useState([]);
    const fetchStatistics = async () => {
        const res = await reportServices.getDashboardStatistics(selectedMonth, axiosConfig);
        setStatistics(res);
    }

    useEffect(() => {
        fetchStatistics();
    }, [selectedMonth]);

    console.log(statistics)


    //Odometer
    const [view, setView] = useState(0);
    const [viewPercentage, setViewPercentage] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [revenuePercentage, setRevenuePercentage] = useState(0);
    const [transaction, setTransaction] = useState(0);
    const [transactionPercentage, setTransactionPercentage] = useState(0);
    const [review, setReview] = useState(0);
    const [reviewPercentage, setReviewPercentage] = useState(0);

    useEffect(() => {
        const timeoutIdView = setTimeout(() => setView(statistics.currentMonthViews), 500);
        const timeoutIdViewPercentage = setTimeout(() => setViewPercentage(statistics.viewsDifference), 500);
        const timeoutIdRevenue = setTimeout(() => setRevenue(statistics.revenueThisMonth), 500);
        const timeoutIdRevenuePercentage = setTimeout(() => setRevenuePercentage(statistics.revenueDifference), 500);
        const timeoutIdTransaction = setTimeout(() => setTransaction(statistics.totalTransactionsThisMonth), 500);
        const timeoutIdTransactionPercentage = setTimeout(() => setTransactionPercentage(statistics.totalTransactionsDifference), 500);
        const timeoutIdReview = setTimeout(() => setReview(statistics.currentMonthReviews), 500);
        const timeoutIdReviewPercentage = setTimeout(() => setReviewPercentage(statistics.reviewsDifference), 500);

        return () => {
            clearTimeout(timeoutIdView);
            clearTimeout(timeoutIdViewPercentage);
            clearTimeout(timeoutIdRevenue);
            clearTimeout(timeoutIdRevenuePercentage);
            clearTimeout(timeoutIdTransaction);
            clearTimeout(timeoutIdTransactionPercentage);
            clearTimeout(timeoutIdReview);
            clearTimeout(timeoutIdReviewPercentage);
        };
    }, [selectedMonth, statistics]);

    //Chart

    //fake data
    const fakeData = [
        {revenueDate: '2024-11-01', revenue: 200, transaction: 10},
        {revenueDate: '2024-11-02', revenue: 100, transaction: 8},
        {revenueDate: '2024-11-03', revenue: 400, transaction: 46},
        {revenueDate: '2024-11-04', revenue: 200, transaction: 12},
        {revenueDate: '2024-11-05', revenue: 500, transaction: 60},
        {revenueDate: '2024-11-06', revenue: 100, transaction: 11},
        {revenueDate: '2024-11-07', revenue: 700, transaction: 66},
        {revenueDate: '2024-11-08', revenue: 300, transaction: 23},
        {revenueDate: '2024-11-09', revenue: 600, transaction: 71},
        {revenueDate: '2024-11-10', revenue: 1000, transaction: 112},
        {revenueDate: '2024-11-11', revenue: 360, transaction: 41},
        {revenueDate: '2024-11-12', revenue: 888, transaction: 92},
        {revenueDate: '2024-11-13', revenue: 222, transaction: 19},
        {revenueDate: '2024-11-14', revenue: 1500, transaction: 161},
        {revenueDate: '2024-11-15', revenue: 700, transaction: 77},
        {revenueDate: '2024-11-16', revenue: 1000, transaction: 102},
        {revenueDate: '2024-11-17', revenue: 1310, transaction: 1234},
        {revenueDate: '2024-11-18', revenue: 600, transaction: 59},
        {revenueDate: '2024-11-19', revenue: 200, transaction: 18},
        {revenueDate: '2024-11-20', revenue: 900, transaction: 88},
        {revenueDate: '2024-11-21', revenue: 1200, transaction: 111}
    ];

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const getDateString = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        return `${day}`;
    };

    const getDatesForMonth = (year, month) => {
        const days = getDaysInMonth(year, month);
        const dates = [];
        for (let i = 1; i <= days; i++) {
            dates.push(getDateString(new Date(year, month - 1, i)));
        }
        return dates;
    };
    const allDates = getDatesForMonth(year, month);

    const [revenueData, setRevenueData] = useState(fakeData);

    const counts = allDates.map((date) => {
        const Revenue = Array.isArray(revenueData)
            ? revenueData.reduce((acc, item) => {
                const itemDate = getDateString(item.revenueDate);
                return itemDate === date ? acc + item.revenue : acc;
            }, 0)
            : 0;

        const Transactions = Array.isArray(revenueData)
            ? revenueData.reduce((acc, item) => {
                const itemDate = getDateString(item.revenueDate);
                return itemDate === date ? acc + item.transaction : acc;
            }, 0)
            : 0;
        return {
            date,
            Revenue,
            Transactions
        };
    });

    return (
        <div className={'content-wrapper'}>
            <div className={'container-xxl flex-grow-1 container-p-y'}>
                <div className="card mb-4">
                    <div className="card-body p-4">
                        <div className="row d-flex justify-content-end align-items-center">
                            <div className="col-md-3">
                                <h3 className={'text-primary mb-0'}>Dashboard</h3>
                            </div>
                            <div className="col-md-9 d-flex justify-content-end align-items-center">
                                <strong className={'px-3'}>Month: </strong>
                                <div style={{width: '20%'}}>
                                    <select
                                        className="form-select"
                                        id={'monthIdInput'}
                                        name={'month'}
                                        onChange={onChangeMonth}
                                    >
                                        {Array.isArray(months) && months.length > 0 ? months.map((month, index) => (
                                            <option key={index} value={month}>{month}</option>
                                        )) : ([])}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row d-flex justify-content-center align-items-center">
                                            <div className="col-md-4">
                                                <img src="/assets/img/icons/unicons/transaction.png"
                                                     className={'img-fluid'}
                                                     alt=""/>
                                            </div>
                                            <div className="col-md-8">
                                                <div className={'mx-3'}>
                                                    <h4 className="d-block mb-1">Transactions</h4>
                                                    <h2 className="card-title text-nowrap mb-2"><ReactOdometer
                                                        value={transaction} format="d.ddd"/></h2>
                                                    <h5 className={`${transactionPercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                        <i className={`bx ${transactionPercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i>
                                                        <ReactOdometer value={transactionPercentage}
                                                                       format={'(d.ddd),dd'}/>%
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row d-flex justify-content-center align-items-center">
                                            <div className="col-md-4">
                                                <img src="/assets/img/icons/unicons/revenue.png" className={'img-fluid'}
                                                     alt=""/>
                                            </div>
                                            <div className="col-md-8">
                                                <div className={'mx-3'}>
                                                    <h4 className="d-block mb-1">Revenue</h4>
                                                    <h2 className="card-title text-nowrap mb-2">$<ReactOdometer
                                                        value={revenue} format="d.ddd"/></h2>
                                                    <h5 className={`${revenuePercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                        <i className={`bx ${revenuePercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i>
                                                        <ReactOdometer value={revenuePercentage} format={'(d.ddd),dd'}/>%
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row d-flex justify-content-center align-items-center">
                                            <div className="col-md-4">
                                                <img src="/assets/img/icons/unicons/views.png" className={'img-fluid'}
                                                     alt=""/>
                                            </div>
                                            <div className="col-md-8">
                                                <div className={'mx-3'}>
                                                    <h4 className="d-block mb-1">Views</h4>
                                                    <h2 className="card-title text-nowrap mb-2">
                                                        <ReactOdometer value={view} format="d.ddd"/>
                                                    </h2>
                                                    <h5 className={`${viewPercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                        <i className={`bx ${viewPercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i>
                                                        <ReactOdometer value={viewPercentage} format="(.ddd),dd"/>%
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row d-flex justify-content-center align-items-center">
                                            <div className="col-md-4">
                                                <img src="/assets/img/icons/unicons/reviews.png"
                                                     className={'img-fluid'}
                                                     alt=""/>
                                            </div>
                                            <div className="col-md-8">
                                                <div className={'mx-3'}>
                                                    <h4 className="d-block mb-1">Reviews</h4>
                                                    <h2 className="card-title text-nowrap mb-2"><ReactOdometer
                                                        value={review} format="d.ddd"/></h2>
                                                    <h5 className={`${reviewPercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                        <i className={`bx ${reviewPercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i>
                                                        <ReactOdometer value={reviewPercentage} format={'(d.ddd),dd'}/>%
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 mb-3">
                    <div className="card">
                        <div className="row-bordered g-0">
                            <h5 className="card-header m-0 me-2 pb-3">Transactions and revenue in Month</h5>
                            <div id="totalRevenueChart" className="px-2">
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart
                                        data={counts}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="1 1"/>
                                        <XAxis dataKey="date"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Line type="monotone" dataKey="Transactions" stroke="#2b97d6"
                                              activeDot={{r: 8}}/>
                                        <Line type="monotone" dataKey="Revenue" stroke="#70dd38" activeDot={{r: 8}}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashBoard;
