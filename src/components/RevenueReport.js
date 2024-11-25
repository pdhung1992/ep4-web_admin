import ReactOdometer from "react-odometerjs";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {IMAGE_URL} from "../constants/constants";
import {useEffect, useRef, useState} from "react";
import reportServices from "../services/report-service";
import {format} from "date-fns";


const RevenueReport = () => {
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
    const [movie, setMovie] = useState(0);
    const [moviePercentage, setMoviePercentage] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [revenuePercentage, setRevenuePercentage] = useState(0);
    const [transaction, setTransaction] = useState(0);
    const [transactionPercentage, setTransactionPercentage] = useState(0);
    const [pkg, setPkg] = useState(0);
    const [packagePercentage, setPackagePercentage] = useState(0);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const closeToast = useRef(null);
    const [toastType, setToastType] = useState('');
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                if (closeToast.current) {
                    closeToast.current.click();
                }
                setShowToast(false);
                setToastType('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);


    //Table
    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sortField, setSortField] = useState('id')
    const [sortDir, setSortDir] = useState('asc')
    const [pageArr, setPageArr] = useState([])
    const pageSizeOptions = [10, 25, 50];
    const [month, setMonth] = useState('');
    const [from, setFrom] = useState('');

    const onChangePageSize = (e) => {
        setPageSize(e.target.value);
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

    const onChangeMonth = (e) => {
        setMonth(e.target.value);
    }

    const onChangeFrom = (e) => {
        setFrom(e.target.value);
    }

    const [data, setData] = useState([]);
    const  fetchData = async () => {
        const res = await reportServices.getTransactions(pageNo, pageSize, sortField, sortDir, month, from, axiosConfig);
        setData(res);
        setPageArr(Array.from({length: data.totalPages}, (v, i) => i + 1));
        setPageNo(res.currentPage);
    }

    const [statistics, setStatistics] = useState([]);
    const fetchStatistics = async () => {
        const res = await reportServices.getRevenueStatistics(month, axiosConfig);
        setStatistics(res);
    }

    useEffect(() => {
        fetchData();
        fetchStatistics();
    },[pageNo, pageSize, sortField, sortDir, month, from]);

    useEffect(() => {

        const timeoutIdRevenue = setTimeout(() => setRevenue(statistics.revenueThisMonth), 500);
        const timeoutIdRevenuePercentage = setTimeout(() => setRevenuePercentage(statistics.revenueDifference), 500);
        const timeoutIdTransaction = setTimeout(() => setTransaction(statistics.totalTransactionsThisMonth), 500);
        const timeoutIdTransactionPercentage = setTimeout(() => setTransactionPercentage(statistics.totalTransactionsDifference), 500);
        const timeoutIdMovie = setTimeout(() => setMovie(statistics.revenueFromMovieThisMonth), 500);
        const timeoutIdMoviePercentage = setTimeout(() => setMoviePercentage(statistics.revenueFromMovieDifference), 500);
        const timeoutIdPackage = setTimeout(() => setPkg(statistics.revenueFromPackageThisMonth), 500);
        const timeoutIdPackagePercentage = setTimeout(() => setPackagePercentage(statistics.revenueFromPackageDifference), 500);

        return () => {
            clearTimeout(timeoutIdMovie);
            clearTimeout(timeoutIdMoviePercentage);
            clearTimeout(timeoutIdRevenue);
            clearTimeout(timeoutIdRevenuePercentage);
            clearTimeout(timeoutIdTransaction);
            clearTimeout(timeoutIdTransactionPercentage);
            clearTimeout(timeoutIdPackage);
            clearTimeout(timeoutIdPackagePercentage);
        };
    }, [month,statistics]);

    const handleExport = async () => {
        const res = await reportServices.exportTransactions(month, axiosConfig);
        if (res){
            setToastType('success');
            setToastMessage(res);
            setShowToast(true);
        }
    }

  return (
      <div className={'content-wrapper'}>
          <div className={'container-xxl flex-grow-1 container-p-y'}>
              <div className="card mb-4">
                  <div className="card-body p-4">
                      <div className="row d-flex justify-content-end align-items-center">
                          <div className="col-md-3">
                              <h3 className={'text-primary mb-0'}>Revenue report</h3>
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
                                              <img src="/assets/img/icons/unicons/revenue.png"
                                                   className={'img-fluid'}
                                                   alt=""/>
                                          </div>
                                          <div className="col-md-8">
                                              <div className={'mx-3'}>
                                                  <h4 className="d-block mb-1">Revenue</h4>
                                                  <h2 className="card-title text-nowrap mb-2">$<ReactOdometer
                                                      value={revenue} format="d.ddd"/></h2>
                                                  <h5 className={`${revenuePercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                      <i className={`bx ${revenuePercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i>
                                                      <ReactOdometer value={revenuePercentage}
                                                                     format={'(d.ddd),dd'}/>%
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
                                              <img src="/assets/img/icons/unicons/movie.png"
                                                   className={'img-fluid'}
                                                   alt=""/>
                                          </div>
                                          <div className="col-md-8">
                                              <div className={'mx-3'}>
                                                  <h4 className="d-block mb-1">From Movies</h4>
                                                  <h2 className="card-title text-nowrap mb-2">
                                                      $<ReactOdometer value={movie} format="d.ddd"/>
                                                  </h2>
                                                  <h5 className={`${moviePercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                      <i className={`bx ${moviePercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i>
                                                      <ReactOdometer value={moviePercentage} format="(.ddd),dd"/>%
                                                  </h5>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="col-lg-6">
                              <div className="card">
                                  <div className="card-body" style={{paddingRight: 0}}>
                                      <div className="row d-flex justify-content-center align-items-center">
                                          <div className="col-md-4">
                                              <img src="/assets/img/icons/unicons/package.png"
                                                   className={'img-fluid'}
                                                   alt=""/>
                                          </div>
                                          <div className="col-md-8">
                                              <div className={'mx-2'}>
                                                  <h4 className="d-block mb-1">From Package</h4>
                                                  <h2 className="card-title text-nowrap mb-2">
                                                      $<ReactOdometer value={pkg} format="d.ddd"/>
                                                  </h2>
                                                  <h5 className={`${packagePercentage < 0 ? 'text-danger' : 'text-success'} fw-semibold`}>
                                                      <i className={`bx ${packagePercentage < 0 ? 'bx-down-arrow-alt' : 'bx-up-arrow-alt'}`}></i>
                                                      <ReactOdometer value={packagePercentage}
                                                                     format={'(d.ddd),dd'}/>%
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
                      <div className="row d-flex">
                          <div className="col-md-5">
                              <h5 className="card-header m-0 me-2 pb-3">Transactions and revenue in Month</h5>
                          </div>
                          <div className="col-md-7 -flex justify-content-center align-content-center">
                              <div className="row d-flex justify-content-center align-content-center">
                                  <div className="col-md-4">
                                      <select
                                          className="form-select"
                                          name={'pageSize'}
                                            onChange={onChangePageSize}
                                      >
                                          {Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0 ? pageSizeOptions.map((size, index) => (
                                              <option key={index} value={size}>{size} items per page</option>
                                          )) : ([])}
                                      </select>
                                  </div>
                                  <div className="col-md-4">
                                      <select
                                          className="form-select"
                                          name={'from'}
                                          onChange={onChangeFrom}
                                      >
                                          <option value="">From all</option>
                                          <option value="movie">Movies</option>
                                          <option value="package">Packages</option>
                                      </select>
                                  </div>
                                  <div className="col-auto">
                                      <button className="btn btn-success" onClick={handleExport}><span
                                          className="tf-icons bx bx-spreadsheet"></span>&nbsp; Export to excel
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <br/>
                      <div className="card-body p-4">
                          <table className="table">
                              <thead>
                              <tr>
                                  <th scope="col">Code</th>
                                  <th scope="col">From User ID</th>
                                  <th scope="col">Gateway</th>
                                  <th scope="col">Amount</th>
                                  <th scope="col">Content</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">Date</th>
                              </tr>
                              </thead>
                              <tbody className="table-border-bottom-0">
                              {Array.isArray(data.data) && data.data.length > 0 ? data.data.map((data, index) => (
                                  <tr key={index}>
                                      <td>{data.code}</td>
                                      <td>{data.userId}</td>
                                      <td>{data.gateway}</td>
                                      <td>${data.amount}</td>
                                      <td>Paid for: {data.isPackage ? data.packageName : data.movieTitle}</td>
                                      <td>{data.status === 1 ? "Success" : "Failure"}</td>
                                      <td>{format(new Date(data.createdAt), 'yyyy-MMM-dd')}</td>
                                  </tr>
                              )) : (
                                  <tr className={'text-center'}>
                                      <td colSpan="6"><strong>No records</strong></td>
                                  </tr>
                              )}
                              </tbody>
                          </table>
                          <hr/>
                          <div className={'row'}>
                              <div className="col">
                                  <strong>Showing {data.fromItem} to {data.toItem} of {data.totalItems} entries</strong>
                              </div>
                              <div className="col">
                                  <nav aria-label="Page navigation">
                                      <ul className="pagination pagination-sm justify-content-end">
                                          {data.currentPage > 1 ? (
                                              <li className="page-item">
                                                  <button className="page-link" onClick={() => {
                                                      setPageNo(pageNo - 1)
                                                  }}>Previous
                                                  </button>
                                              </li>
                                          ) : ([])}
                                          {Array.isArray(pageArr) && pageArr.length > 0 ? pageArr.map((page, index) => (
                                              <div>
                                                  {page === pageNo ? (
                                                      <li className="page-item" key={index}>
                                                          <button className="page-link text-danger"
                                                                  onClick={() => setPageNo(page)}>{page}</button>
                                                      </li>
                                                  ) : (
                                                      <li className="page-item" key={index}>
                                                          <button className="page-link"
                                                                  onClick={() => setPageNo(page)}>{page}</button>
                                                      </li>
                                                  )}
                                              </div>
                                          )) : ([])}
                                          {data.currentPage < data.totalPages ? (
                                              <li className="page-item">
                                                  <button className="page-link" onClick={() => {
                                                      setPageNo(pageNo + 1)
                                                  }}>Next
                                                  </button>
                                              </li>
                                          ) : ([])}
                                      </ul>
                                  </nav>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/*Alert toast*/}
          <div
              className={`bs-toast toast toast-placement-ex m-3 fade bg-${toastType} top-0 end-0 ${showToast ? 'show' : ''}`}
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              data-bs-delay="3000"
          >
              <div className="toast-header">
                  <i className="bx bx-bell me-2"></i>
                  <div className="me-auto fw-semibold">Alert</div>
                  <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"
                          ref={closeToast}></button>
              </div>
              <div className="toast-body">
                  {toastMessage}
              </div>
          </div>
      </div>
  );
}

export default RevenueReport;
