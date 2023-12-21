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
    UncontrolledDropdown,
    DropdownToggle,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Modal
} from "reactstrap";
import { useCookies } from "react-cookie";
import Avatar from "components/Avatar";
import { getNoti } from "services/notification";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

function MainNavbar() {
    const { t, i18n } = useTranslation();
    const languageStore = JSON.parse(localStorage.getItem('language'));
    const [enLang, setEnLang] = useState(languageStore == 'vi' ? false : true ?? true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const changeLanguage = () => {
        setEnLang(!enLang); 
        localStorage.setItem('language', JSON.stringify(enLang ? 'vi' : 'en'))
        i18n.changeLanguage(enLang ? 'vi' : 'en');
    }
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies([
        "name",
        "currentuser",
        "role",
        "userid"
    ]);
    const [isOpenNotification, setIsOpenNotification] = useState(false);
    const [isNewNoti, setIsNewNoti] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const logout = () => {
        removeCookie("currentuser", { path: '/' });
        removeCookie("userid", { path: '/' });
        removeCookie("role", { path: '/' });
        removeCookie("name", { path: '/' });
        navigate("/");
    };

    const currentPage = () => {
        const path = document.location.pathname
        if (path === "/user") return ""
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

    const toUserPage = () => {
        navigate("/user");
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
                                            <span className="nav-link-inner--text">{t('sideBar.chat')} <i className="fa fa-external-link" aria-hidden="true"></i></span>
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
                                            <Dropdown isOpen={dropdownOpen}
                                                toggle={toggle}
                                                direction={"down"}
                                                className="avatar-droprown">
                                                <DropdownToggle className="dropdown-btn">
                                                    <Avatar name={cookies.name} />
                                                </DropdownToggle>
                                                <DropdownMenu className="mt-5">
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
