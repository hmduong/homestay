import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
    Button,
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    Nav,
    Modal,
} from "reactstrap";
import Avatar from "components/Avatar";

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
                        <Nav className="align-items-lg-center ml-lg-auto" navbar>
                            <NavItem className="d-none d-lg-block ml-lg-4 mr-4">
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
