import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignIn from "./SignIn";
import SignUp from "./signUp";
import Dashboard from "./Dashboard";

export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/sign-in" element={<SignIn />}/>
                <Route path="/sign-up" element={<SignUp />}/>
                <Route path="/dashboard" element={<Dashboard />}/>
            </Routes>
        </BrowserRouter>
    );
}