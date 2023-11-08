import CardsFooter from "components/Footers/CardsFooter";
import MainNavbar from "components/Navbars/MainNavbar";
import { Outlet } from "react-router-dom";

function DefaultLayout({ children }) {

    return (
        <>
            <MainNavbar />
            {children}
            <CardsFooter />
        </>
    );
}

export default DefaultLayout;
