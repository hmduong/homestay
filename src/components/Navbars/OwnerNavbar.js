import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Headroom from "headroom.js";
import { useCookies } from "react-cookie";
import {
    Button,
    UncontrolledCollapse,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledDropdown,
    Media,
    NavbarBrand,
    Navbar,
    NavItem,
    NavLink,
    Nav,
    Container,
    Modal,
} from "reactstrap";

const OwnerNavbar = ({ refe }) => {
    const [cookies, setCookie, removeCookie] = useCookies([
        "currentuser",
        "userid",
        "role",
        "name"
    ]);
    const navigate = useNavigate();
    const [collapseClasses, setCollapseClasses] = useState("");
    const [isOpenModal, setIsOpenModal] = useState(false);

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
        removeCookie("_id");
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
                    {/* <Container> */}
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
                        {/* <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                            <UncontrolledDropdown nav>
                                <DropdownToggle nav onClick={() => navigateTo('homestay')}>
                                    {currentPage === 'homestay' ? <div className="active-bg"></div> : <></>}
                                    <i className="ni ni-ui-04 d-lg-none mr-1" />
                                    <span className="nav-link-inner--text">Homestay</span>
                                </DropdownToggle>
                            </UncontrolledDropdown>
                        </Nav>
                        <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                            <UncontrolledDropdown nav>
                                <DropdownToggle nav onClick={() => navigateTo('booking')}>
                                    {currentPage === 'booking' ? <div className="active-bg"></div> : <></>}
                                    <i className="ni ni-ui-04 d-lg-none mr-1" />
                                    <span className="nav-link-inner--text">Booking</span>
                                </DropdownToggle>
                            </UncontrolledDropdown>
                        </Nav>
                        <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                            <UncontrolledDropdown nav>
                                <DropdownToggle nav onClick={() => navigateTo('discount')}>
                                    {currentPage === 'discount' ? <div className="active-bg"></div> : <></>}
                                    <i className="ni ni-ui-04 d-lg-none mr-1" />
                                    <span className="nav-link-inner--text">Discount</span>
                                </DropdownToggle>
                            </UncontrolledDropdown>
                        </Nav>
                        <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                            <UncontrolledDropdown nav>
                                <DropdownToggle nav onClick={() => navigateTo('service')}>
                                    {currentPage === 'service' ? <div className="active-bg"></div> : <></>}
                                    <i className="ni ni-ui-04 d-lg-none mr-1" />
                                    <span className="nav-link-inner--text">Service</span>
                                </DropdownToggle>
                            </UncontrolledDropdown>
                        </Nav>
                        <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                            <UncontrolledDropdown nav>
                                <DropdownToggle nav onClick={() => navigateTo('chat')}>
                                    {currentPage === 'chat' ? <div className="active-bg"></div> : <></>}
                                    <i className="ni ni-ui-04 d-lg-none mr-1" />
                                    <span className="nav-link-inner--text">Chat</span>
                                </DropdownToggle>
                            </UncontrolledDropdown>
                        </Nav>
                        <Nav className="navbar-nav-hover align-items-lg-center" navbar>
                            <UncontrolledDropdown nav>
                                <DropdownToggle nav onClick={() => navigateTo('statistic')}>
                                    {currentPage === 'statistic' ? <div className="active-bg"></div> : <></>}
                                    <i className="ni ni-ui-04 d-lg-none mr-1" />
                                    <span className="nav-link-inner--text">Statistic</span>
                                </DropdownToggle>
                            </UncontrolledDropdown>
                        </Nav> */}
                        <Nav className="align-items-lg-center ml-lg-auto" navbar>
                            <NavItem className="d-none d-lg-block ml-lg-4 mr-4">
                                <Button
                                    className="btn-neutral btn-icon circle-btn"
                                    color="default"
                                    onClick={() => openLoginModal(true)}
                                >
                                    <span className="nav-link-inner--text">
                                        {cookies.name[0]}
                                    </span>
                                </Button>
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
                            </NavItem>
                        </Nav>
                    </UncontrolledCollapse>
                    {/* </Container> */}
                </Navbar>
            </header>
        </>
    );
};

export default OwnerNavbar;
