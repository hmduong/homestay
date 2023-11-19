import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Headroom from "headroom.js";
import {
    Button,
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Row,
    Col,
    UncontrolledTooltip,
    Modal,
    UncontrolledDropdown,
    DropdownToggle,
} from "reactstrap";
import { useCookies } from "react-cookie";
import Avatar from "components/Avatar";

function MainNavbar() {
    const navigate = useNavigate();
    const [collapseClasses, setCollapseClasses] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies([
        "name",
        "currentuser",
        "role",
        "userid"
    ]);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const currentPage = () => {
        const path = document.location.pathname
        return path === '/visitor/booking' ? 'booking' : 'homestay'
    }

    useEffect(() => {
        let headroom = new Headroom(document.getElementById("navbar-main"));
        headroom.init();

    }, []);

    const onExiting = () => {
        setCollapseClasses("collapsing-out");
    };

    const onExited = () => {
        setCollapseClasses("");
    };

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
                            className={collapseClasses}
                            onExiting={onExiting}
                            onExited={onExited}
                        >
                            <div className="navbar-collapse-header">
                                <Row>
                                    <Col className="collapse-brand" xs="6">
                                        <Link to="/">
                                            <img
                                                alt="..."
                                                src={require("assets/img/brand/argon-react.png")}
                                            />
                                        </Link>
                                    </Col>
                                    <Col className="collapse-close" xs="6">
                                        <button className="navbar-toggler" id="navbar_global">
                                            <span />
                                            <span />
                                        </button>
                                    </Col>
                                </Row>
                            </div>
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
                                            <span className="nav-link-inner--text">Booking</span>
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
                                {cookies.role === 'visitor' && <NavItem className="notification-nav">
                                    <i className="fa fa-bell notification-bell" aria-hidden="true"></i>
                                    <i className="fa fa-circle notification-dot" aria-hidden="true"></i>
                                </NavItem>}
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
                                                        Log out
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
                                                        Are you sure?
                                                    </p>
                                                </div>
                                                <div className="modal-footer">
                                                    <Button
                                                        color="link"
                                                        data-dismiss="modal"
                                                        type="button"
                                                        onClick={() => openLoginModal(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button color="primary" type="button" className="ml-auto" onClick={logout}>
                                                        OK
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
                                            <span className="nav-link-inner--text mr-2">Sign in</span>
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
