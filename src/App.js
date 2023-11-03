import React from "react";
import Login from "./components/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UserInformation from "./components/UserInformation";
import {isEmpty, isNull } from "lodash";
import AppContext from "./AppContext";

const App = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = React.useState('');

  return (
    <AppContext.Provider value={{ user, setUser }}>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={isEmpty(user) && isNull(token) ? <Login /> : <Navigate exact to= '/'/>} />
      <Route exact path="/" element={!isEmpty(user) && !isNull(token) ? <UserInformation /> : <Navigate exact to ='/login' />} />
    </Routes>
  </BrowserRouter>
  </AppContext.Provider>
  );
}

export default App;
