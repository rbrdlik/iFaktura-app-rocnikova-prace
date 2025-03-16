import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/Routes/ProtectedRoute/";
import DetailsRoute from "../components/Routes/DetailsRoute";
import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";
 
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";

import LoadingPage from "../components/LoadingPage";

import CreateDetails from "./MyDetails/CreateDetails";
import UpdateDetails from "./MyDetails/UpdateDetails";

import CreateItem from "./MyItems/CreateItem";
import UpdateItem from "./MyItems/UpdateItem";
import ViewItem from "./MyItems/ViewItem";
import ViewAllItems from "./MyItems/ViewAllItems";

import CreateContact from "./MyContacts/CreateContact";
import UpdateContact from "./MyContacts/UpdateContact";
import ViewContact from "./MyContacts/ViewContact";
import ViewAllContacts from "./MyContacts/ViewAllContacts";

import Settings from "./Settings";

import NotFound from "../components/NotFound";

export default function AppRoutes() {
  const { user, isLoading } = useAuth();

  if(isLoading){
    return <LoadingPage />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />

        <Route element={<ProtectedRoute />}>
          {/* Kontrolujeme zda má uživatel zadané své údaje, pokud ano přesměrujeme uživatele na `UpdateDetails` aby si své údaje mohl upravit, pokud ne musí si je vytvořit na `CreateDetails`*/}
          <Route path="/details" element={!user?.detailsName ? <CreateDetails /> : <UpdateDetails />} />

          <Route element={<DetailsRoute user={user}/>}>
            <Route path="/" element={<Navigate to={"/dashboard"}/>}/>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/createItem" element={<CreateItem />} />
            <Route path="/updateItem" element={<UpdateItem />} />
            <Route path="/items" element={<ViewAllItems />} />
            <Route path="/item" element={<ViewItem />} />

            <Route path="/createContact" element={<CreateContact />} />
            <Route path="/updateContact" element={<UpdateContact />} />
            <Route path="/contacts" element={<ViewAllContacts />} />
            <Route path="/contact" element={<ViewContact />} />

            <Route path="/settings" element={<Settings />} />
          </Route> 
        </Route>

        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}
