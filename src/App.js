
import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import {useSelector} from "react-redux";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const PrivateRoute = ({element, roles}) => {
    const admin = useSelector(state => state.auth);
    if (!admin.adminData) {
        return <Navigate to="/login"/>;
    }
    return element;
}

function App() {
  return (
    <div>
      <Routes>
        <Route path={'/*'} element={<PrivateRoute element={<AdminLayout/>}/>}/>
        {/*<Route path={'/*'} element={<AdminLayout/>}/>*/}
        <Route path={'/login'} element={<Login/>}/>
        <Route path={'/forgot-password'} element={<ForgotPassword/>}/>
        <Route path={'/reset-password'} element={<ResetPassword/>}/>
      </Routes>
    </div>
  );
}

export default App;
