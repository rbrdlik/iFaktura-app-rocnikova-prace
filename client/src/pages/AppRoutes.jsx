import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./signUp";
import Dashboard from "./Dashboard";

import CreateDetails from "./MyDetails/CreateDetails";
import UpdateDetails from "./MyDetails/UpdateDetails";

import CreateItem from "./MyItems/CreateItem";
import UpdateItem from "./MyItems/UpdateItem";
import ViewItem from "./MyItems/ViewItem";
import ViewAllItems from "./MyItems/ViewAllItems";

export default function AppRoutes() {

  // Testovaci prepinac
  let details = 0;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/details" element={details == 1 ? <CreateDetails /> : <UpdateDetails />} />

        <Route path="/createItem" element={<CreateItem />} />
        <Route path="/updateItem" element={<UpdateItem />} />
        <Route path="/items" element={<ViewAllItems />} />
        <Route path="/item" element={<ViewItem />} />
      </Routes>
    </BrowserRouter>
  );
}
