import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {IMAGE_URL} from "../constants/constants";
import {useEffect, useState} from "react";
import functionServices from "../services/function-services";


const Functions = () => {
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

    const [functions, setFunctions] = useState([]);

    const fetchFunctions = async () => {
        const data = await functionServices.getFunctions();
        setFunctions(data);
    }

    useEffect(() => {
        fetchFunctions();
    }, [])


    return(
        <div className={'content-wrapper'}>
            <div className={'container-xxl flex-grow-1 container-p-y'}>
                <div className="card">
                    <div className="card-body p-4">
                        <h3 className={'text-primary mb-0'}>Functions</h3>
                        <br/>
                        <div className="row">
                            {Array.isArray(functions) && functions.length > 0 ? functions.map((pFunc, index) => (
                                <div className="col-md-4">
                                    <h5 className={'text-info'}><i className={`menu-icon tf-icons bx ${pFunc.icon}`}></i>{pFunc.name}</h5>
                                    <ul>
                                        {Array.isArray(pFunc.childFunctions) && pFunc.childFunctions.length > 0 ? (
                                            pFunc.childFunctions.map((child, index) => (
                                                <li className="menu-item" key={index}>
                                                    <p className={'text-dark'}>
                                                        <i className={`menu-icon tf-icons bx ${child.icon}`}></i>{child.name}
                                                    </p>
                                                </li>
                                            ))
                                        ) : null}
                                    </ul>
                                    <br/>
                                </div>
                            )) : []}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Functions;
