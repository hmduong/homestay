import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss";
import 'react-slideshow-image/dist/styles.css'

import Login from "pages/examples/Login.js";
import Register from "pages/examples/Register.js";
import OwnerLayout from "layouts/OwnerLayout";
import DefaultLayout from "layouts/DefaultLayout";
import { Provider } from "react-redux";
import Alert from "components/Alert";
import store from "store";
import Homestay from "pages/Owner/Homestay";
import Discount from "pages/Owner/Discount";
import DetailHomestay from "pages/DetailHomestay";
import Chat from "pages/Chat";
import UserLayout from "layouts/UserLayout";
import Main from "pages/Main";
import Booking from "pages/User/Booking";
import BookingList from "pages/Owner/BookingList";

const root = ReactDOM.createRoot(document.getElementById("root"));
document.addEventListener('scroll', () => {
  const btn = document.getElementById('stt-btn')
  if (window.scrollY > 100) {
    btn.classList.add('active')
  } else {
    btn.classList.remove('active')
  }
})

function App() {
  return (
    <>
      <Provider store={store}>
        <div id='stt-marker'></div>
        <a id='stt-btn' onClick={() => window.scrollTo(0, 0)}><i className="fa fa-chevron-circle-up" aria-hidden="true"></i></a>
        <Alert />
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<DefaultLayout><Main /></DefaultLayout>} />
            {/* <Route path="*" exact element={<Navigate to='/' />} /> */}
            <Route path="/login" exact element={<Login />} />
            <Route path="/register" exact element={<Register />} />
            <Route path="/chat" exact element={<Chat />} />
            <Route path="/homestay/:id" exact element={<DefaultLayout><DetailHomestay /></DefaultLayout>} />
            <Route path="/visitor" element={<UserLayout />}>
              <Route index element={<Navigate to={'booking'} />} />
              <Route path="booking" element={<DefaultLayout><Booking /></DefaultLayout>} />
            </Route>
            <Route path="/owner" element={<OwnerLayout />}>
              <Route index element={<Navigate to={'homestay'} />} />
              <Route path="homestay" exact element={<Homestay />} />
              <Route path="homestay/:id" exact element={<DetailHomestay />} />
              <Route path="discount" exact element={<Discount />} />
              <Route path="booking" exact element={<BookingList />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

root.render(<App />);
