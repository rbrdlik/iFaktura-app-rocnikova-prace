import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./signUp";
import Dashboard from "./Dashboard";

import CreateDetails from "./MyDetails/CreateDetails";
import UpdateDetails from "./MyDetails/UpdateDetails";

export default function AppRoutes() {

  // Testovaci prepinac
  let details = 0;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/details" element={details == 1 ? <CreateDetails /> : <UpdateDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
