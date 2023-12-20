import { format } from "date-fns";
import { useEffect } from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Input, Button, Col, FormGroup, Modal, Row } from "reactstrap";
import { deleteServiceBooking } from "services/booking";
import { getBooking } from "services/booking";
import { editBook } from "services/booking";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "./Loading";

const BookingListCard = ({ booking, triggerRerender }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetch = async () => {
            const response = await getBooking(booking._id);
            if (response.data) {
                setServiceList(response.data.services);
                setServicesUsed(response.data.servicesBooking);
                setServices(response.data.servicesBooking);
            } else {
                dispatch(
                    actions.createAlert({
                        message: "Can't load booking's services",
                        type: "error"
                    })
                );
            }
        };
        fetch();
    }, []);
    const [hover, setHover] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    const [servicesUsed, setServicesUsed] = useState([]);
    const [services, setServices] = useState(servicesUsed);
    const [isOpenService, setIsOpenService] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [actionsEdit, setActionsEdit] = useState({
        title: "",
        func: () => { },
    });
    const [loading, setLoading] = useState(false);

    const [loadingModal, setLoadingModal] = useState(false);
    const [isOpenDeposit, setIsOpenDeposit] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(["role"]);
    const navigate = useNavigate();
    const check = () => {
        navigate(`/homestay/${booking.homestay._id}`);
    };
    const editBooking = async (payload) => {
        let data = {
            note: booking.note,
            checkin: booking.checkin,
            checkout: booking.checkout,
            deposit: booking.deposit,
            email: booking.email,
            homestay: booking.homestay,
            money: booking.money,
            people: booking.people,
            phone: booking.phone,
            status: payload.status || booking.status,
            services: payload.services || [],
        };
        const res = await editBook(booking._id, data);
        if (res.data.booking) {
            return true;
        }
    };
    const updateBooking = (status) => {
        const message = {
            accepted: "Ok nhé?",
            confirmed: "Xác nhận đặt cọc?",
            stayed: "Ở nhé?",
            declined: "Xóa nhé?",
            expired: "Xác nhận hết hạn?",
        }
        setIsOpenModal(true);
        setActionsEdit({
            title: message[status],
            func: async () => {
                let res = await editBooking({ status: status });
                if (res) {
                    setIsOpenModal(false);
                    dispatch(
                        actions.createAlert({
                            message: "Updated booking",
                            type: "success"
                        })
                    );
                    triggerRerender()
                } else {
                    dispatch(
                        actions.createAlert({
                            message: "Error occur",
                            type: "error"
                        })
                    );
                }
            },
        });
    }
    const addService = (id) => {
        const found = services.find(
            (service) => service.service._id === serviceList[id]._id
        );
        if (!found)
            setServices([
                ...services,
                {
                    service: serviceList[id],
                    booking: booking._id,
                    quantity: 0,
                    money: 0,
                    _id: 'new'
                },
            ]);
    };
    const removeService = async (id) => {
        const found = servicesUsed.find((service) => service._id === id);
        if (found) {
            const response = await deleteServiceBooking(id);
            if (response === 'delete successfully') {
                setServicesUsed(servicesUsed.filter((service) => service._id !== id));
            }
        }
        setServices(services.filter((service) => service._id !== id));
    };
    const updateServices = async () => {
        let res = await editBooking({ services: services });
        if (res) {
            dispatch(
                actions.createAlert({
                    message: "Updated service!",
                    type: "success"
                })
            );
            setIsOpenService(false);
        } else {
            dispatch(
                actions.createAlert({
                    message: "Error occur",
                    type: "error"
                })
            );
        }
    };
    const qtyChange = (id, qty) => {
        const found = services.find((service) => service._id === id);
        found.money = found.service.price * qty
        found.quantity = qty
        setServices([...services])
    }

    return (
        <div
            className="booking-card list"
            onMouseLeave={() => setHover(false)}
            onMouseOver={() => setHover(true)}
        >
            <div className="booking-info">
                <div className="sub-info">
                    <div style={{ paddingLeft: "8px" }}>
                        <h5>Tenant: {booking.user.name}</h5>
                        <h5>Check in: {format(new Date(booking.checkin), "dd/MM/yyyy")}</h5>
                        <h5>
                            Check out: {format(new Date(booking.checkout), "dd/MM/yyyy")}
                        </h5>
                        <h5>Phone: {booking.phone}</h5>
                        <h5>Money: {booking.money}</h5>
                        <h5>Deposited: {booking.deposit}</h5>
                    </div>
                </div>
                <h5 className={`booking-status list ${booking.status}`}>
                    {booking.status}
                </h5>
            </div>
            <div className={`booking-actions${hover ? " listactive" : ""}`}>
                {booking.status === "requested" &&
                    (
                        <>
                            <Button
                                style={{ marginRight: 0, marginBottom: "8px" }}
                                color="success"
                                onClick={() => updateBooking('accepted')}
                            >
                                Accept
                            </Button>
                            <Button
                                style={{ marginRight: 0 }}
                                color="warning"
                                onClick={() => updateBooking("declined")}
                            >
                                Decline
                            </Button>
                        </>
                    )}
                {booking.status === "accepted" && (
                    <>
                        <Button
                            style={{ marginRight: 0, marginBottom: "8px" }}
                            color="danger"
                            onClick={() => updateBooking("expired")}
                        >
                            Expired
                        </Button>
                    </>
                )}
                {booking.status === "deposited" && (
                    <>
                        <Button
                            style={{ marginRight: 0, marginBottom: "8px" }}
                            color="success"
                            onClick={() => setIsOpenDeposit(true)}
                        >
                            Check deposit
                        </Button>
                        <Modal
                            className="modal-dialog-centered"
                            isOpen={isOpenDeposit}
                            toggle={() => setIsOpenDeposit(false)}
                        >

                            {loadingModal ? <Loading /> : <Row>
                                <Col md={12} className="m-2 mt-3">
                                    <h5>
                                        Deposit
                                    </h5>
                                </Col>
                                <Col md="12" className='m-2'>
                                    <img width={400} height={400} src={`http://localhost:3333/bookings/${booking._id}/bill`} alt="" />
                                </Col>
                                <Col md="12" className='booking-submit'>
                                    <Button color='primary' onClick={() => updateBooking("confirmed")}>Confirm</Button>
                                    <Button color='danger' onClick={() => updateBooking("declined")}>Decline</Button>
                                </Col>
                            </Row>}
                        </Modal>
                    </>
                )}
                {booking.status === "confirmed" && (
                    <>
                        <Button
                            style={{ marginRight: 0, marginBottom: "8px" }}
                            color="success"
                            onClick={() => updateBooking("stayed")}
                        >
                            Stay
                        </Button>
                        {/* <Button
                            style={{ marginRight: 0, marginBottom: "8px" }}
                            color="default"
                            onClick={() => setIsOpenService(true)}
                        >
                            Services
                        </Button> */}
                        <Button
                            style={{ marginRight: 0 }}
                            color="danger"
                            onClick={() => updateBooking("expired")}
                        >
                            Expired
                        </Button>
                    </>
                )}
                {booking.status === "stayed" && (
                    <Button
                        style={{ marginRight: 0 }}
                        color="default"
                        onClick={() => setIsOpenService(true)}
                    >
                        Services
                    </Button>
                )}
                <Modal
                    className="modal-dialog-centered"
                    isOpen={isOpenModal}
                    toggle={() => setIsOpenModal(false)}
                >
                    {loading ? <Loading /> : <>
                        <div className="modal-header">
                            <h6 className="modal-title" id="modal-title-default">
                                {actionsEdit.title}
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
                            <p>Are you sure?</p>
                        </div>
                        <div className="modal-footer">
                            <Button
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setIsOpenModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                type="button"
                                className="ml-auto"
                                onClick={actionsEdit.func}
                            >
                                OK
                            </Button>
                        </div>
                    </>}
                </Modal>
                <Modal
                    className="modal-dialog-centered"
                    isOpen={isOpenService}
                    toggle={() => setIsOpenService(false)}
                >
                    {loading ? <Loading /> : <>
                        <div className="modal-header">
                            <h5 className="modal-title" id="modal-title-default">
                                Services
                            </h5>
                        </div>
                        <div className="modal-body" style={{ padding: "8px 20px" }}>
                            <Row>
                                <Col md="12">
                                    <FormGroup
                                        style={{ marginBottom: "8px", position: "relative" }}
                                    >
                                        <div className="bookings-picker">
                                            <Button className="picker-btn">
                                                <i className="fa fa-plus-circle" aria-hidden="true"></i>{" "}
                                                Add service
                                            </Button>
                                            <Input
                                                className="booking-select"
                                                type="select"
                                                value={{}}
                                                onChange={(e) => addService(e.target.selectedIndex - 1)}
                                                style={{ opacity: 0, cursor: "pointer" }}
                                            >
                                                <option style={{ display: "none" }} value={{}}></option>
                                                {serviceList.map(
                                                    (service, index) =>
                                                        service.isActive && (
                                                            <option key={index} value={service}>
                                                                {service.name}
                                                                {service.price}
                                                            </option>
                                                        )
                                                )}
                                            </Input>
                                            <Row style={{ marginTop: 16 }}>
                                                {services.map((service, key) => (
                                                    <Col key={key} className="service-col">
                                                        <Button onClick={() => removeService(service._id)} color="danger" style={{ marginRight: 8 }}><i className="fa fa-times" aria-hidden="true"></i></Button>
                                                        <h5 style={{ marginBottom: 0, flex: 1 }}>
                                                            {service.service.name}
                                                            <span style={{ marginLeft: 16 }}>${service.money}</span>
                                                        </h5>
                                                        <Input onChange={(e) => qtyChange(service._id, e.target.value)} style={{ width: 100 }} type="number" defaultValue={service.quantity} />
                                                    </Col>
                                                ))}
                                                {services.length === 0 && <Col> nodata</Col>}
                                            </Row>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                        <div className="modal-footer">
                            <Button
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setIsOpenService(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                type="button"
                                className="ml-auto"
                                onClick={updateServices}
                            >
                                Update
                            </Button>
                        </div>
                    </>}
                </Modal>
            </div>
        </div>
    );
};

export default BookingListCard;
