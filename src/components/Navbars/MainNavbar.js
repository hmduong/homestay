import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Headroom from "headroom.js";
import {
    Button,
    UncontrolledCollapse,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledDropdown,
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
} from "reactstrap";
import { useCookies } from "react-cookie";

function MainNavbar() {
    const navigate = useNavigate();
    const [collapseClasses, setCollapseClasses] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies([
        "name"
    ]);
    const [isOpenModal, setIsOpenModal] = useState(false);

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
        // Remove user and handle logout logic
        removeCookie("currentuser");
        removeCookie("userid");
        removeCookie("role");
        removeCookie("name");
        navigate("/", { replace: true });
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
                            {/* <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                                <UncontrolledDropdown nav>
                                    <DropdownToggle nav>
                                        <i className="ni ni-ui-04 d-lg-none mr-1" />
                                        <span className="nav-link-inner--text">Components</span>
                                    </DropdownToggle>
                                    <DropdownMenu className="dropdown-menu-xl">
                                        <div className="dropdown-menu-inner">
                                            <Media
                                                className="d-flex align-items-center"
                                                href="https://demos.creative-tim.com/argon-design-system-react/#/documentation/overview?ref=adsr-navbar"
                                                target="_blank"
                                            >
                                                <div className="icon icon-shape bg-gradient-primary rounded-circle text-white">
                                                    <i className="ni ni-spaceship" />
                                                </div>
                                                <Media body className="ml-3">
                                                    <h6 className="heading text-primary mb-md-1">
                                                        Getting started
                                                    </h6>
                                                    <p className="description d-none d-md-inline-block mb-0">
                                                        Learn how to use Argon compiling Scss, change brand
                                                        colors and more.
                                                    </p>
                                                </Media>
                                            </Media>
                                        </div>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <UncontrolledDropdown nav>
                                    <DropdownToggle nav>
                                        <i className="ni ni-collection d-lg-none mr-1" />
                                        <span className="nav-link-inner--text">Examples</span>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem to="/landing-page" tag={Link}>
                                            Landing
                                        </DropdownItem>
                                        <DropdownItem to="/profile-page" tag={Link}>
                                            Profile
                                        </DropdownItem>
                                        <DropdownItem to="/login-page" tag={Link}>
                                            Login
                                        </DropdownItem>
                                        <DropdownItem to="/register-page" tag={Link}>
                                            Register
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav> */}
                            <Nav className="align-items-lg-center ml-lg-auto" navbar>
                                <NavItem>
                                    <NavLink
                                        className="nav-link-icon"
                                        href="https://www.facebook.com"
                                        id="tooltip333589074"
                                        target="_blank"
                                    >
                                        <i className="fa fa-facebook-square" />
                                        <span className="nav-link-inner--text d-lg-none ml-2">
                                            Facebook
                                        </span>
                                    </NavLink>
                                    <UncontrolledTooltip delay={0} target="tooltip333589074">
                                        Facebook
                                    </UncontrolledTooltip>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className="nav-link-icon"
                                        href="https://www.instagram.com"
                                        id="tooltip356693867"
                                        target="_blank"
                                    >
                                        <i className="fa fa-instagram" />
                                        <span className="nav-link-inner--text d-lg-none ml-2">
                                            Instagram
                                        </span>
                                    </NavLink>
                                    <UncontrolledTooltip delay={0} target="tooltip356693867">
                                        Instagram
                                    </UncontrolledTooltip>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className="nav-link-icon"
                                        href="https://twitter.com"
                                        id="tooltip184698705"
                                        target="_blank"
                                    >
                                        <i className="fa fa-twitter-square" />
                                        <span className="nav-link-inner--text d-lg-none ml-2">
                                            Twitter
                                        </span>
                                    </NavLink>
                                    <UncontrolledTooltip delay={0} target="tooltip184698705">
                                        Twitter
                                    </UncontrolledTooltip>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className="nav-link-icon"
                                        href="https://github.com"
                                        id="tooltip112445449"
                                        target="_blank"
                                    >
                                        <i className="fa fa-github" />
                                        <span className="nav-link-inner--text d-lg-none ml-2">
                                            Github
                                        </span>
                                    </NavLink>
                                    <UncontrolledTooltip delay={0} target="tooltip112445449">
                                        Github
                                    </UncontrolledTooltip>
                                </NavItem>
                                <NavItem className="d-none d-lg-block ml-lg-4">
                                    {cookies.name ? (
                                        <>
                                            <Button
                                                className="btn-neutral btn-icon circle-btn"
                                                color="default"
                                                onClick={() => openLoginModal(true)}
                                            >
                                                <span className="nav-link-inner--text">
                                                    {cookies.name[0]}
                                                </span>
                                            </Button><Modal
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
