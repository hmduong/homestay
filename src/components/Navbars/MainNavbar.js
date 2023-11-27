import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Headroom from "headroom.js";
import {
    Button,
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    Nav,
    Container,
    Modal,
    UncontrolledDropdown,
    DropdownToggle,
    Dropdown,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import { useCookies } from "react-cookie";
import Avatar from "components/Avatar";
import { getNoti } from "services/notification";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

function MainNavbar() {
    const { t, i18n } = useTranslation();
    const [enLang, setEnLang] = useState(true);
    const changeLanguage = () => {
        setEnLang(!enLang)
        i18n.changeLanguage(enLang ? 'vi' : 'en')
    }
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies([
        "name",
        "currentuser",
        "role",
        "userid"
    ]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenNotification, setIsOpenNotification] = useState(false);
    const [isNewNoti, setIsNewNoti] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const currentPage = () => {
        const path = document.location.pathname
        return path === '/visitor/booking' ? 'booking' : 'homestay'
    }

    useEffect(() => {
        let headroom = new Headroom(document.getElementById("navbar-main"));
        headroom.init();
        const handleClickOutside = (event) => {
            const notification = document.getElementById('notification')
            if (isOpenNotification && notification && !notification.contains(event.target)) {
                alert("You clicked outside of me!");
            }
        }

        const getNotification = async () => {
            const res = await getNoti();
            if (res.status === 200) {
                setNotifications(res.data.notifications);
                let found = res.data.notifications?.find(noti => !noti.seen)
                if (found) setIsNewNoti(true)
            }
        }

        document.addEventListener("click", handleClickOutside);
        if (cookies.currentuser) getNotification();

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const openLoginModal = (modal) => {
        setIsOpenModal(modal);
    };

    const logout = () => {
        removeCookie("currentuser", { path: '/' });
        removeCookie("userid", { path: '/' });
        removeCookie("role", { path: '/' });
        removeCookie("name", { path: '/' });
        navigate("/");
    };

    const openNotification = () => {
        setIsOpenNotification(true)
    }

    return (
        <>
            <header className="header-global">
                <Navbar
                    className="navbar-main navbar-transparent navbar-light headroom"
                    expand="lg"
                    id="navbar-main"
                >
                    <Container>
                        <NavbarBrand className="mr-lg-5 brand" to="/" tag={Link}>
                            <img alt="..." src={require("assets/img/brand/logo.png")} />
                        </NavbarBrand>
                        <button className="navbar-toggler" id="navbar_global">
                            <span className="navbar-toggler-icon" />
                        </button>
                        <UncontrolledCollapse
                            toggler="#navbar_global"
                            navbar
                        >
                            {cookies.role && <>
                                <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                                    <UncontrolledDropdown nav>
                                        <DropdownToggle nav onClick={() => navigate('/')}>
                                            {currentPage() === 'homestay' ? <div className="active-bg"></div> : <></>}
                                            <i className="ni ni-ui-04 d-lg-none mr-1" />
                                            <span className="nav-link-inner--text">Homestay</span>
                                        </DropdownToggle>
                                    </UncontrolledDropdown>
                                </Nav>
                                <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                                    <UncontrolledDropdown nav>
                                        <DropdownToggle nav onClick={() => navigate('/visitor')}>
                                            {currentPage() === 'booking' ? <div className="active-bg"></div> : <></>}
                                            <i className="ni ni-ui-04 d-lg-none mr-1" />
                                            <span className="nav-link-inner--text">{t('booking.self')}</span>
                                        </DropdownToggle>
                                    </UncontrolledDropdown>
                                </Nav>
                                <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                                    <UncontrolledDropdown nav>
                                        <DropdownToggle nav onClick={() => navigate('/chat')}>
                                            <i className="ni ni-ui-04 d-lg-none mr-1" />
                                            <span className="nav-link-inner--text">Chat <i className="fa fa-external-link" aria-hidden="true"></i></span>
                                        </DropdownToggle>
                                    </UncontrolledDropdown>
                                </Nav>
                            </>}
                            <Nav className="align-items-lg-center ml-lg-auto" navbar>
                                {cookies.role === 'visitor' &&
                                    <>
                                        <NavItem onClick={openNotification} className="notification-nav">
                                            <Dropdown isOpen={isOpenNotification} toggle={() => setIsOpenNotification(!isOpenNotification)} direction="down">
                                                <DropdownToggle style={{ background: 'none', border: 'none', marginRight: 0 }}>
                                                    <i className="fa fa-bell notification-bell" aria-hidden="true"></i>
                                                    {isNewNoti && <i className="fa fa-circle notification-dot" aria-hidden="true"></i>}
                                                </DropdownToggle>
                                                <DropdownMenu container="body" className="notification-menu">
                                                    {notifications && notifications.map(notification => <DropdownItem className={`notification-item${notification.seen ? '' : 'new'}`} key={notification._id} onClick={() => navigate('/visitor/booking')}>
                                                        <h5>{format(new Date(notification.updatedAt), "dd/MM/yyyy")}</h5>
                                                        <p className="notification-message">{notification.message}</p>
                                                    </DropdownItem>)}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </NavItem>
                                    </>
                                }
                                <NavItem className="d-none d-lg-block ml-lg-4">
                                    <img onClick={changeLanguage} width={30} src={enLang ? "https://flagicons.lipis.dev/flags/4x3/gb.svg" : "https://flagicons.lipis.dev/flags/4x3/vn.svg"} alt="" />
                                </NavItem>
                                <NavItem className="d-none d-lg-block ml-lg-4">
                                    {cookies.name ? (
                                        <>
                                            <Avatar onclick={() => openLoginModal(true)} name={cookies.name} />
                                            <Modal
                                                className="modal-dialog-centered"
                                                isOpen={isOpenModal}
                                                toggle={() => openLoginModal(false)}
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
                                                        onClick={() => openLoginModal(false)}
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
                                                        onClick={() => openLoginModal(false)}
                                                    >
                                                        {t('cancel')}
                                                    </Button>
                                                    <Button color="primary" type="button" className="ml-auto" onClick={logout}>
                                                        {t('ok')}
                                                    </Button>
                                                </div>
                                            </Modal>
                                        </>
                                    ) : (
                                        <Button
                                            className="btn-neutral btn-icon"
                                            color="default"
                                            href="/login"
                                        >
                                            <span className="nav-link-inner--text mr-2">{t('signIn')}</span>
                                            <span className="btn-inner--icon">
                                                <i className="fa fa-sign-in ml-1" />
                                            </span>
                                        </Button>
                                    )}
                                </NavItem>
                            </Nav>
                        </UncontrolledCollapse>
                    </Container>
                </Navbar>
            </header>
        </>
    );
}

export default MainNavbar;
