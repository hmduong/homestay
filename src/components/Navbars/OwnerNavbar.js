import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    Nav,
} from "reactstrap";
import Avatar from "components/Avatar";
import { useTranslation } from "react-i18next";

const OwnerNavbar = ({ refe }) => {
    const { t, i18n } = useTranslation();
    const [enLang, setEnLang] = useState(true);
    const changeLanguage = () => {
        setEnLang(!enLang)
        i18n.changeLanguage(enLang ? 'vi' : 'en')
    }
    const [cookies, setCookie, removeCookie] = useCookies([
        "currentuser",
        "userid",
        "role",
        "name"
    ]);
    const navigate = useNavigate();
    const [collapseClasses, setCollapseClasses] = useState("");

    const onExiting = () => {
        setCollapseClasses("collapsing-out");
    };

    const onExited = () => {
        setCollapseClasses("");
    };

    const toUserPage = () => {
        navigate("/user");
    };

    return (
        <>
            <header className="header-global">
                <Navbar
                    className="navbar-main navbar-transparent navbar-light headroom"
                    expand="lg"
                    id="navbar-main"
                >
                    <NavbarBrand onClick={() => refe.setDrawer(!refe.drawer)} className="mr-lg-5 brand" tag={Link}>
                        <img
                            alt="..."
                            src={require("assets/img/brand/logo.png")}
                        />
                    </NavbarBrand>
                    <button className="navbar-toggler" id="navbar_global">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <UncontrolledCollapse
                        toggler="#navbar_global"
                        navbar
                        className={collapseClasses}
                        onExiting={onExiting}
                        onExited={onExited}
                    >
                        <Nav className="align-items-lg-center ml-lg-auto" navbar>
                            <NavItem className="d-none d-lg-block ml-lg-4 mr-4">
                                <img onClick={changeLanguage} width={40} src={enLang ? "https://flagicons.lipis.dev/flags/4x3/gb.svg" : "https://flagicons.lipis.dev/flags/4x3/vn.svg"} alt="" />
                            </NavItem>
                            <NavItem className="d-none d-lg-block ml-lg-4 mr-4">
                                <Avatar onclick={toUserPage} name={cookies.name} />
                            </NavItem>
                        </Nav>
                    </UncontrolledCollapse>
                </Navbar>
            </header>
        </>
    );
};

export default OwnerNavbar;
