import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {IMAGE_URL} from "../constants/constants";
import {useEffect, useState} from "react";
import ReactOdometer from "react-odometerjs";
import "odometer/themes/odometer-theme-default.css";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";


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
        const timeoutIdView = setTimeout(() => setView(23456), 500);
        const timeoutIdViewPercentage = setTimeout(() => setViewPercentage(14.82), 500);
        const timeoutIdRevenue = setTimeout(() => setRevenue(1234), 500);
        const timeoutIdRevenuePercentage = setTimeout(() => setRevenuePercentage(15.82), 500);
        const timeoutIdTransaction = setTimeout(() => setTransaction(678), 500);
        const timeoutIdTransactionPercentage = setTimeout(() => setTransactionPercentage(21.12), 500);
        const timeoutIdReview = setTimeout(() => setReview(2222), 500);
        const timeoutIdReviewPercentage = setTimeout(() => setReviewPercentage(-8.21), 500);

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
    }, []);

    //Chart

    //fake data
    const fakeData = [
        {revenueDate: '2024-11-01', revenue: 200},
        {revenueDate: '2024-11-02', revenue: 100},
        {revenueDate: '2024-11-03', revenue: 400},
        {revenueDate: '2024-11-04', revenue: 200},
        {revenueDate: '2024-11-05', revenue: 500},
        {revenueDate: '2024-11-06', revenue: 100},
        {revenueDate: '2024-11-07', revenue: 700},
        {revenueDate: '2024-11-08', revenue: 300},
        {revenueDate: '2024-11-09', revenue: 600},
        {revenueDate: '2024-11-10', revenue: 1000},
        {revenueDate: '2024-11-11', revenue: 360},
        {revenueDate: '2024-11-12', revenue: 888},
        {revenueDate: '2024-11-13', revenue: 222},
        {revenueDate: '2024-11-14', revenue: 1500},
        {revenueDate: '2024-11-15', revenue: 700},
        {revenueDate: '2024-11-16', revenue: 1000},
        {revenueDate: '2024-11-17', revenue: 1310},
        {revenueDate: '2024-11-18', revenue: 600},
        {revenueDate: '2024-11-19', revenue: 200},
        {revenueDate: '2024-11-20', revenue: 900},
        {revenueDate: '2024-11-21', revenue: 1200}
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
        return {
            date,
            Revenue,
        };
    });

    return (
        <div className={'content-wrapper'}>
            <div className={'container-xxl flex-grow-1 container-p-y'}>
                <div className="card mb-4">
                    <div className="card-body p-4">
                        <h3 className={'text-primary mb-0'}>Dashboard</h3>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row d-flex justify-content-center align-items-center">
                                            <div className="col-md-4">
                                                <img src="/assets/img/icons/unicons/views.png" className={'img-fluid'} alt=""/>
                                            </div>
                                            <div className="col-md-8">
                                                <div className={'mx-3'}>
                                                    <h4 className="d-block mb-1">Views</h4>
                                                    <h2 className="card-title text-nowrap mb-2">
                                                        <ReactOdometer value={view} format="d.ddd" />
                                                    </h2>
                                                    <h5 className={`${viewPercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                        <i className={`bx ${viewPercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i> <ReactOdometer value={viewPercentage} format="(.ddd),dd" />%
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
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
                                                    <h2 className="card-title text-nowrap mb-2">$<ReactOdometer value={revenue} format="d.ddd"/> </h2>
                                                    <h5 className={`${revenuePercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                        <i className={`bx ${revenuePercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i> <ReactOdometer value={revenuePercentage} format={'(d.ddd),dd'}/>%
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
                            <div className="col-lg-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row d-flex justify-content-center align-items-center">
                                            <div className="col-md-4">
                                                <img src="/assets/img/icons/unicons/transaction.png" className={'img-fluid'}
                                                     alt=""/>
                                            </div>
                                            <div className="col-md-8">
                                                <div className={'mx-3'}>
                                                    <h4 className="d-block mb-1">Transactions</h4>
                                                    <h2 className="card-title text-nowrap mb-2"><ReactOdometer value={transaction} format="d.ddd"/></h2>
                                                    <h5 className={`${transactionPercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                        <i className={`bx ${transactionPercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i> <ReactOdometer value={transactionPercentage} format={'(d.ddd),dd'}/>%
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
                                                    <h4 className="d-block mb-1">Review</h4>
                                                    <h2 className="card-title text-nowrap mb-2"><ReactOdometer value={review} format="d.ddd"/></h2>
                                                    <h5 className={`${reviewPercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                        <i className={`bx ${reviewPercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i> <ReactOdometer value={reviewPercentage} format={'(d.ddd),dd'}/>%
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
                            <h5 className="card-header m-0 me-2 pb-3">Revenue by Month</h5>
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
                                        <CartesianGrid strokeDasharray="1 1" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="Revenue" stroke="#70dd38" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
                {/*<div className="row">*/}

                {/*    <div className="col-md-6 col-lg-4 col-xl-4 order-0 mb-4">*/}
                {/*        <div className="card h-100">*/}
                {/*            <div className="card-header d-flex align-items-center justify-content-between pb-0">*/}
                {/*                <div className="card-title mb-0">*/}
                {/*                    <h5 className="m-0 me-2">Order Statistics</h5>*/}
                {/*                    <small className="text-muted">42.82k Total Sales</small>*/}
                {/*                </div>*/}
                {/*                <div className="dropdown">*/}
                {/*                    <button*/}
                {/*                        className="btn p-0"*/}
                {/*                        type="button"*/}
                {/*                        id="orederStatistics"*/}
                {/*                        data-bs-toggle="dropdown"*/}
                {/*                        aria-haspopup="true"*/}
                {/*                        aria-expanded="false"*/}
                {/*                    >*/}
                {/*                        <i className="bx bx-dots-vertical-rounded"></i>*/}
                {/*                    </button>*/}
                {/*                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="orederStatistics">*/}
                {/*                        <a className="dropdown-item" href="javascript:void(0);">Select All</a>*/}
                {/*                        <a className="dropdown-item" href="javascript:void(0);">Refresh</a>*/}
                {/*                        <a className="dropdown-item" href="javascript:void(0);">Share</a>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="card-body">*/}
                {/*                <div className="d-flex justify-content-between align-items-center mb-3">*/}
                {/*                    <div className="d-flex flex-column align-items-center gap-1">*/}
                {/*                        <h2 className="mb-2">8,258</h2>*/}
                {/*                        <span>Total Orders</span>*/}
                {/*                    </div>*/}
                {/*                    <div id="orderStatisticsChart"></div>*/}
                {/*                </div>*/}
                {/*                <ul className="p-0 m-0">*/}
                {/*                    <li className="d-flex mb-4 pb-1">*/}
                {/*                        <div className="avatar flex-shrink-0 me-3">*/}
                {/*            <span className="avatar-initial rounded bg-label-primary"*/}
                {/*            ><i className="bx bx-mobile-alt"></i*/}
                {/*            ></span>*/}
                {/*                        </div>*/}
                {/*                        <div*/}
                {/*                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">*/}
                {/*                            <div className="me-2">*/}
                {/*                                <h6 className="mb-0">Electronic</h6>*/}
                {/*                                <small className="text-muted">Mobile, Earbuds, TV</small>*/}
                {/*                            </div>*/}
                {/*                            <div className="user-progress">*/}
                {/*                                <small className="fw-semibold">82.5k</small>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </li>*/}
                {/*                    <li className="d-flex mb-4 pb-1">*/}
                {/*                        <div className="avatar flex-shrink-0 me-3">*/}
                {/*                            <span className="avatar-initial rounded bg-label-success"><i*/}
                {/*                                className="bx bx-closet"></i></span>*/}
                {/*                        </div>*/}
                {/*                        <div*/}
                {/*                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">*/}
                {/*                            <div className="me-2">*/}
                {/*                                <h6 className="mb-0">Fashion</h6>*/}
                {/*                                <small className="text-muted">T-shirt, Jeans, Shoes</small>*/}
                {/*                            </div>*/}
                {/*                            <div className="user-progress">*/}
                {/*                                <small className="fw-semibold">23.8k</small>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </li>*/}
                {/*                    <li className="d-flex mb-4 pb-1">*/}
                {/*                        <div className="avatar flex-shrink-0 me-3">*/}
                {/*                            <span className="avatar-initial rounded bg-label-info"><i*/}
                {/*                                className="bx bx-home-alt"></i></span>*/}
                {/*                        </div>*/}
                {/*                        <div*/}
                {/*                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">*/}
                {/*                            <div className="me-2">*/}
                {/*                                <h6 className="mb-0">Decor</h6>*/}
                {/*                                <small className="text-muted">Fine Art, Dining</small>*/}
                {/*                            </div>*/}
                {/*                            <div className="user-progress">*/}
                {/*                                <small className="fw-semibold">849k</small>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </li>*/}
                {/*                    <li className="d-flex">*/}
                {/*                        <div className="avatar flex-shrink-0 me-3">*/}
                {/*            <span className="avatar-initial rounded bg-label-secondary"*/}
                {/*            ><i className="bx bx-football"></i*/}
                {/*            ></span>*/}
                {/*                        </div>*/}
                {/*                        <div*/}
                {/*                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">*/}
                {/*                            <div className="me-2">*/}
                {/*                                <h6 className="mb-0">Sports</h6>*/}
                {/*                                <small className="text-muted">Football, Cricket Kit</small>*/}
                {/*                            </div>*/}
                {/*                            <div className="user-progress">*/}
                {/*                                <small className="fw-semibold">99</small>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </li>*/}
                {/*                </ul>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div className="col-md-6 col-lg-4 order-1 mb-4">*/}
                {/*        <div className="card h-100">*/}
                {/*            <div className="card-header">*/}
                {/*                <ul className="nav nav-pills" role="tablist">*/}
                {/*                    <li className="nav-item">*/}
                {/*                        <button*/}
                {/*                            type="button"*/}
                {/*                            className="nav-link active"*/}
                {/*                            role="tab"*/}
                {/*                            data-bs-toggle="tab"*/}
                {/*                            data-bs-target="#navs-tabs-line-card-income"*/}
                {/*                            aria-controls="navs-tabs-line-card-income"*/}
                {/*                            aria-selected="true"*/}
                {/*                        >*/}
                {/*                            Income*/}
                {/*                        </button>*/}
                {/*                    </li>*/}
                {/*                    <li className="nav-item">*/}
                {/*                        <button type="button" className="nav-link" role="tab">Expenses</button>*/}
                {/*                    </li>*/}
                {/*                    <li className="nav-item">*/}
                {/*                        <button type="button" className="nav-link" role="tab">Profit</button>*/}
                {/*                    </li>*/}
                {/*                </ul>*/}
                {/*            </div>*/}
                {/*            <div className="card-body px-0">*/}
                {/*                <div className="tab-content p-0">*/}
                {/*                    <div className="tab-pane fade show active" id="navs-tabs-line-card-income"*/}
                {/*                         role="tabpanel">*/}
                {/*                        <div className="d-flex p-4 pt-3">*/}
                {/*                            <div className="avatar flex-shrink-0 me-3">*/}
                {/*                                <img src="../assets/img/icons/unicons/wallet.png" alt="User"/>*/}
                {/*                            </div>*/}
                {/*                            <div>*/}
                {/*                                <small className="text-muted d-block">Total Balance</small>*/}
                {/*                                <div className="d-flex align-items-center">*/}
                {/*                                    <h6 className="mb-0 me-1">$459.10</h6>*/}
                {/*                                    <small className="text-success fw-semibold">*/}
                {/*                                        <i className="bx bx-chevron-up"></i>*/}
                {/*                                        42.9%*/}
                {/*                                    </small>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                        <div id="incomeChart"></div>*/}
                {/*                        <div className="d-flex justify-content-center pt-4 gap-2">*/}
                {/*                            <div className="flex-shrink-0">*/}
                {/*                                <div id="expensesOfWeek"></div>*/}
                {/*                            </div>*/}
                {/*                            <div>*/}
                {/*                                <p className="mb-n1 mt-1">Expenses This Week</p>*/}
                {/*                                <small className="text-muted">$39 less than last week</small>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div className="col-md-6 col-lg-4 order-2 mb-4">*/}
                {/*        <div className="card h-100">*/}
                {/*            <div className="card-header d-flex align-items-center justify-content-between">*/}
                {/*                <h5 className="card-title m-0 me-2">Transactions</h5>*/}
                {/*                <div className="dropdown">*/}
                {/*                    <button*/}
                {/*                        className="btn p-0"*/}
                {/*                        type="button"*/}
                {/*                        id="transactionID"*/}
                {/*                        data-bs-toggle="dropdown"*/}
                {/*                        aria-haspopup="true"*/}
                {/*                        aria-expanded="false"*/}
                {/*                    >*/}
                {/*                        <i className="bx bx-dots-vertical-rounded"></i>*/}
                {/*                    </button>*/}
                {/*                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">*/}
                {/*                        <a className="dropdown-item" href="javascript:void(0);">Last 28 Days</a>*/}
                {/*                        <a className="dropdown-item" href="javascript:void(0);">Last Month</a>*/}
                {/*                        <a className="dropdown-item" href="javascript:void(0);">Last Year</a>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="card-body">*/}
                {/*                <ul className="p-0 m-0">*/}
                {/*                    <li className="d-flex mb-4 pb-1">*/}
                {/*                        <div className="avatar flex-shrink-0 me-3">*/}
                {/*                            <img src="../assets/img/icons/unicons/paypal.png" alt="User"*/}
                {/*                                 className="rounded"/>*/}
                {/*                        </div>*/}
                {/*                        <div*/}
                {/*                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">*/}
                {/*                            <div className="me-2">*/}
                {/*                                <small className="text-muted d-block mb-1">Paypal</small>*/}
                {/*                                <h6 className="mb-0">Send money</h6>*/}
                {/*                            </div>*/}
                {/*                            <div className="user-progress d-flex align-items-center gap-1">*/}
                {/*                                <h6 className="mb-0">+82.6</h6>*/}
                {/*                                <span className="text-muted">USD</span>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </li>*/}
                {/*                    <li className="d-flex mb-4 pb-1">*/}
                {/*                        <div className="avatar flex-shrink-0 me-3">*/}
                {/*                            <img src="../assets/img/icons/unicons/wallet.png" alt="User"*/}
                {/*                                 className="rounded"/>*/}
                {/*                        </div>*/}
                {/*                        <div*/}
                {/*                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">*/}
                {/*                            <div className="me-2">*/}
                {/*                                <small className="text-muted d-block mb-1">Wallet</small>*/}
                {/*                                <h6 className="mb-0">Mac'D</h6>*/}
                {/*                            </div>*/}
                {/*                            <div className="user-progress d-flex align-items-center gap-1">*/}
                {/*                                <h6 className="mb-0">+270.69</h6>*/}
                {/*                                <span className="text-muted">USD</span>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </li>*/}
                {/*                    <li className="d-flex mb-4 pb-1">*/}
                {/*                        <div className="avatar flex-shrink-0 me-3">*/}
                {/*                            <img src="../assets/img/icons/unicons/chart.png" alt="User"*/}
                {/*                                 className="rounded"/>*/}
                {/*                        </div>*/}
                {/*                        <div*/}
                {/*                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">*/}
                {/*                            <div className="me-2">*/}
                {/*                                <small className="text-muted d-block mb-1">Transfer</small>*/}
                {/*                                <h6 className="mb-0">Refund</h6>*/}
                {/*                            </div>*/}
                {/*                            <div className="user-progress d-flex align-items-center gap-1">*/}
                {/*                                <h6 className="mb-0">+637.91</h6>*/}
                {/*                                <span className="text-muted">USD</span>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </li>*/}
                {/*                    <li className="d-flex mb-4 pb-1">*/}
                {/*                        <div className="avatar flex-shrink-0 me-3">*/}
                {/*                            <img src="../assets/img/icons/unicons/cc-success.png" alt="User"*/}
                {/*                                 className="rounded"/>*/}
                {/*                        </div>*/}
                {/*                        <div*/}
                {/*                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">*/}
                {/*                            <div className="me-2">*/}
                {/*                                <small className="text-muted d-block mb-1">Credit Card</small>*/}
                {/*                                <h6 className="mb-0">Ordered Food</h6>*/}
                {/*                            </div>*/}
                {/*                            <div className="user-progress d-flex align-items-center gap-1">*/}
                {/*                                <h6 className="mb-0">-838.71</h6>*/}
                {/*                                <span className="text-muted">USD</span>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </li>*/}
                {/*                    <li className="d-flex mb-4 pb-1">*/}
                {/*                        <div className="avatar flex-shrink-0 me-3">*/}
                {/*                            <img src="../assets/img/icons/unicons/wallet.png" alt="User"*/}
                {/*                                 className="rounded"/>*/}
                {/*                        </div>*/}
                {/*                        <div*/}
                {/*                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">*/}
                {/*                            <div className="me-2">*/}
                {/*                                <small className="text-muted d-block mb-1">Wallet</small>*/}
                {/*                                <h6 className="mb-0">Starbucks</h6>*/}
                {/*                            </div>*/}
                {/*                            <div className="user-progress d-flex align-items-center gap-1">*/}
                {/*                                <h6 className="mb-0">+203.33</h6>*/}
                {/*                                <span className="text-muted">USD</span>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </li>*/}
                {/*                    <li className="d-flex">*/}
                {/*                        <div className="avatar flex-shrink-0 me-3">*/}
                {/*                            <img src="../assets/img/icons/unicons/cc-warning.png" alt="User"*/}
                {/*                                 className="rounded"/>*/}
                {/*                        </div>*/}
                {/*                        <div*/}
                {/*                            className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">*/}
                {/*                            <div className="me-2">*/}
                {/*                                <small className="text-muted d-block mb-1">Mastercard</small>*/}
                {/*                                <h6 className="mb-0">Ordered Food</h6>*/}
                {/*                            </div>*/}
                {/*                            <div className="user-progress d-flex align-items-center gap-1">*/}
                {/*                                <h6 className="mb-0">-92.45</h6>*/}
                {/*                                <span className="text-muted">USD</span>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </li>*/}
                {/*                </ul>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}

export default DashBoard;
