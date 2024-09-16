import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import authServices from "../services/auth-services";
import {changeAvatar} from "../actions/auth-actions";
import {ACCOUNT_SETTINGS, IMAGE_URL} from "../constants/constants";


const AccountSettings = () => {

    const admin = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const imgUrl = IMAGE_URL;

    const token = admin.adminData.token;
    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

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

    const closeChangePwdModal = useRef(null);

    const fetchNewAvatar = async () => {
        const data = await authServices.getNewAvatar(axiosConfig);
        console.log(data);
        if (data && data.responseCode === 200) {
            dispatch(changeAvatar(data.responseMessage));
        }
    }

    const handleChangeAvatar = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', admin.adminData.id);
        formData.append('avatar', selectedFile);
        const data = await authServices.changeAvatar(formData, axiosConfig);
        if (data && data.responseCode === 200) {
            setSelectedFile(null);
            setToastMessage(data.responseMessage);
            setToastType('success');
            setShowToast(true);
            fetchNewAvatar(axiosConfig);
            navigate(ACCOUNT_SETTINGS);
        }else {
            setToastMessage(data.responseMessage);
            setToastType('danger');
            setShowToast(true);
        }
    }

    const [passwordInput, setPasswordInput] = useState('');
    const [newPasswordInput, setNewPasswordInput] = useState('');
    const [newPasswordCfmInput, setNewPasswordCfmInput] = useState('');

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        switch (name) {
            case 'passwordInput':
                setPasswordInput(value);
                break;
            case 'newPasswordInput':
                setNewPasswordInput(value);
                break;
            case 'newPasswordCfmInput':
                setNewPasswordCfmInput(value);
                break;
            default:
                break;
        }
    }

    const isPasswordMatch = newPasswordInput === newPasswordCfmInput;

    const handleChangePassword = async (e) => {
        if (isPasswordMatch) {
            e.preventDefault();
            const formData = {
                password: passwordInput,
                newPassword: newPasswordInput
            }
            const data = await authServices.changePassword(formData, axiosConfig);
            if (data && data.responseCode === 200) {
                setToastMessage(data.responseMessage);
                setToastType('success');
                setShowToast(true);
                setPasswordInput('');
                setNewPasswordInput('');
                setNewPasswordCfmInput('');
                closeChangePwdModal.current.click();
            } else {
                setToastMessage(data.responseMessage);
                setToastType('danger');
                setShowToast(true);
            }
        }
    }

    return (
        <div className={'container-xxl flex-grow-1 container-p-y'}>
            <div className="card">
                <div className="card-body p-4">
                    <h3 className={'text-primary mb-0'}>Account settings</h3>
                </div>
            </div>
            <br/>
            <div className="row">
                <div className="col-lg-8 mb-4 order-0">
                    <div className="card" style={{height: '25vh'}}>
                        <div className="d-flex align-items-end row">
                            <div className="col-sm-7">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">Welcome
                                        back, {admin.adminData.fullName} 🎉</h5>
                                    <p className="mb-4">
                                        You can view your information here. Of course, you can also edit them.
                                    </p>
                                </div>
                            </div>
                            <div className="col-sm-5 text-center text-sm-left">
                                <div className="card-body pb-0 px-0 px-md-4">
                                    <img
                                        src="/assets/img/illustrations/man-with-laptop-light.png"
                                        height="160"
                                        alt="View Badge User"
                                        data-app-dark-img="illustrations/man-with-laptop-dark.png"
                                        data-app-light-img="illustrations/man-with-laptop-light.png"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="card">
                        <div className="row row-bordered g-0">
                            <div style={{height: '32.5vh'}}>
                                <h5 className="card-header m-0 me-2 pb-2 text-primary">Account information: </h5>
                                <div className="card-body pb-0 pt-0">
                                    <h6 className="mb-0">Username</h6>
                                    <p className="mb-0 ms-3"><span
                                        className="tf-icons bx bxs-right-arrow-alt"></span>&nbsp; {admin.adminData.username}
                                    </p>
                                </div>
                                <div className="card-body pt-2 pb-0">
                                    <h6 className="mb-0">Email address</h6>
                                    <p className="mb-0 ms-3"><span
                                        className="tf-icons bx bxs-right-arrow-alt"></span>&nbsp; {admin.adminData.email}
                                    </p>

                                </div>
                                <div className="card-body pt-2 pb-0">
                                    <h6 className="mb-0">Role</h6>
                                    <p className="mb-0 ms-3"><span
                                        className="tf-icons bx bxs-right-arrow-alt"></span>&nbsp; {admin.adminData.role}
                                    </p>
                                </div>
                                <div className="card-footer bottom-0 ">
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-warning"
                                                data-bs-toggle="modal"
                                                data-bs-target="#changePwdModal"
                                        >
                                            <span className="tf-icons bx bxs-key"></span>&nbsp; Change password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-4 order-1">
                    <div className="card" style={{height: '60vh'}}>
                        <div className="card-body">
                            <img src={previewUrl || (IMAGE_URL + admin.adminData.avatar)} height={'auto'} alt=""
                                 className={'img-fluid'}/>
                        </div>
                        <div className={'card-footer row'}>
                            <div className="row d-flex align-items-center justify-content-center">
                                <div className="col-6">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="form-control-file"
                                    />
                                </div>
                                <div className="col-6 text-end">
                                    <button className="btn btn-info ms-2" onClick={handleChangeAvatar}>
                                        <span className="tf-icons bx bxs-camera"></span>&nbsp; Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*Change password modal*/}
            <div className="modal fade" id="changePwdModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title text-primary">Change password</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="col mb-3">
                                <label htmlFor="passwordInput" className="form-label">Current password</label>
                                <input type="password"
                                       id="passwordInput"
                                       className="form-control"
                                       placeholder="Current password"
                                       name={'passwordInput'}
                                       value={passwordInput}
                                       onChange={handleInputChange}
                                />
                            </div>
                            <div className="col mb-3">
                                <label htmlFor="newPasswordInput" className="form-label">New password</label>
                                <input type="password"
                                       id="newPasswordInput"
                                       className="form-control"
                                       placeholder="New password"
                                       name={'newPasswordInput'}
                                       value={newPasswordInput}
                                       onChange={handleInputChange}
                                />
                            </div>
                            <div className="col mb-3">
                                <label htmlFor="newPasswordCfmInput" className="form-label">Confirm new password</label>
                                <input type="password"
                                       id="newPasswordCfmInput"
                                       className="form-control"
                                       placeholder="Re-enter new password"
                                       name={'newPasswordCfmInput'}
                                       value={newPasswordCfmInput}
                                       onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit"
                                    className="btn btn-outline-warning"
                                    onClick={handleChangePassword}
                            >
                                <span className="tf-icons bx bxs-send"></span>&nbsp; Submit
                            </button>
                            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal"
                                    ref={closeChangePwdModal}>
                                <span className="tf-icons bx bx-x"></span>&nbsp; Cancel
                            </button>
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

export default AccountSettings;
