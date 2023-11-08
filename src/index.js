import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss";
import 'react-slideshow-image/dist/styles.css'

import Index from "pages/Index.js";
import Landing from "pages/examples/Landing.js";
import Login from "pages/examples/Login.js";
import Profile from "pages/examples/Profile.js";
import HomePage from "pages/examples/HomePage.js";
import Register from "pages/examples/Register.js";
import OwnerLayout from "layouts/OwnerLayout";
import DefaultLayout from "layouts/DefaultLayout";
import { Provider, } from "react-redux";
import Alert from "components/Alert";
import store from "store";
import Homestay from "pages/Owner/Homestay";
import Discount from "pages/Owner/Discount";
import DetailHomestay from "pages/Owner/DetailHomestay";

const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  return (
    <>
      <Provider store={store}>
        <Alert />
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<DefaultLayout><HomePage /></DefaultLayout>} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/register" exact element={<Register />} />
            <Route path="/landing-page" exact element={<Landing />} />
            <Route path="/main" exact element={<Index />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/user" exact element={<OwnerLayout />}>
              {/* <Route index exact element={<Owner />} /> */}
              <Route path="homestay" exact element={<HomePage />} />
              <Route path="booking" exact element={<HomePage />} />
              <Route path="discount" exact element={<HomePage />} />
              <Route path="service" exact element={<HomePage />} />
              <Route path="chat" exact element={<HomePage />} />
              <Route path="statistic" exact element={<HomePage />} />
            </Route>
            <Route path="/owner" element={<OwnerLayout />}>
              <Route index element={<Navigate to={'homestay'} />} />
              <Route index path="homestay" exact element={<Homestay />} />
              <Route index path="homestay/:id" exact element={<DetailHomestay />} />
              <Route path="discount" exact element={<Discount />} />
              <Route path="chat" exact element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

root.render(<App />);
