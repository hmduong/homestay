import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    Nav,
    Modal,
    DropdownToggle,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Button
} from "reactstrap";
import Avatar from "components/Avatar";
import { useTranslation } from "react-i18next";

const OwnerNavbar = ({ refe }) => {
    const { t, i18n } = useTranslation();
    const languageStore = JSON.parse(localStorage.getItem('language'));
    const [enLang, setEnLang] = useState(languageStore == 'vi' ? false : true ?? true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const changeLanguage = () => {
        setEnLang(!enLang);
        localStorage.setItem('language', JSON.stringify(enLang ? 'vi' : 'en'))
        i18n.changeLanguage(enLang ? 'vi' : 'en');
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
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const logout = () => {
        removeCookie("currentuser", { path: '/' });
        removeCookie("userid", { path: '/' });
        removeCookie("role", { path: '/' });
        removeCookie("name", { path: '/' });
        navigate("/");
    };

    return (
        <>
            <header className="header-global">
                <Navbar
                    className="navbar-main navbar-transparent navbar-light headroom"
                    expand="lg"
                    id="navbar-main"
                >
                    <NavbarBrand onClick={() => {
                        if (document.location.pathname === "/user") {
                            window.location.pathname = "/"
                        } else {
                            refe.setDrawer(!refe.drawer);
                        }
                    }} className="mr-lg-5 brand" tag={Link}>
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
                            <NavItem className="d-none d-lg-block mr-4">
                                <img onClick={changeLanguage} width={40} src={enLang ? "https://flagicons.lipis.dev/flags/4x3/gb.svg" : "https://flagicons.lipis.dev/flags/4x3/vn.svg"} alt="" />
                            </NavItem>
                            <NavItem className="d-none d-lg-block">
                                <Dropdown isOpen={dropdownOpen}
                                    toggle={toggle}
                                    direction={"down"}
                                    className="avatar-droprown">
                                    <DropdownToggle className="dropdown-btn">
                                        <Avatar name={cookies.name} />
                                    </DropdownToggle>
                                    <DropdownMenu className="mt-5 ddmenu">
                                        <DropdownItem onClick={toUserPage}>{t('aboutYou')}</DropdownItem>
                                        <DropdownItem onClick={() => { setIsOpenModal(true); }}>{t('logout.title')}</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                                <Modal
                                    className="modal-dialog-centered"
                                    isOpen={isOpenModal}
                                    toggle={() => setIsOpenModal(false)}
                                >
                                    <div className="modal-header">
                                        <h6 className="modal-title" id="modal-title-default">
                                            {t('logout.title')}
                                        </h6>
                                        <button
                                            aria-label="Close"
                                            className="close"
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() => setIsOpenModal(false)}
                                        >
                                            <span>×</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>
                                            {t('logout.content')}
                                        </p>
                                    </div>
                                    <div className="modal-footer">
                                        <Button
                                            color="link"
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() => setIsOpenModal(false)}
                                        >
                                            {t('cancel')}
                                        </Button>
                                        <Button color="primary" type="button" className="ml-auto" onClick={logout}>
                                            {t('ok')}
                                        </Button>
                                    </div>
                                </Modal>
                            </NavItem>
                        </Nav>
                    </UncontrolledCollapse>
                </Navbar>
            </header>
        </>
    );
};

export default OwnerNavbar;
