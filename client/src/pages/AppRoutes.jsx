import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignIn from "./signIn";
import SignUp from "./signUp";

export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/sign-in" element={<SignIn />}/>
                <Route path="/sign-up" element={<SignUp />}/>
            </Routes>
        </BrowserRouter>
    );
}