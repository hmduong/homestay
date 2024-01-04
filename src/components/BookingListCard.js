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
import { useTranslation } from "react-i18next";

const BookingListCard = ({ booking, triggerRerender }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
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
            accepted: t('homestay.messageAlert.accepted'),
            confirmed: t('homestay.messageAlert.confirmed'),
            stayed: t('homestay.messageAlert.stayed'),
            declined: t('homestay.messageAlert.declined'),
            expired: t('homestay.messageAlert.expired'),
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
                            message: t('alert.updated'),
                            type: "success"
                        })
                    );
                    triggerRerender()
                } else {
                    dispatch(
                        actions.createAlert({
                            message: t('alert.updated'),
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
                    message: t('alert.updatedService'),
                    type: "success"
                })
            );
            setIsOpenService(false);
        } else {
            dispatch(
                actions.createAlert({
                    message: t('alert.error'),
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
            <div className="booking-list-info">
                <div className="bli-show">
                    <div style={{ width: '15%' }}>
                        <h6>Visitor</h6>
                        <p>{booking.user.name}</p>
                    </div>
                    <div style={{ width: '25%' }}>
                        <h6>{t('time')}</h6>
                        <p>{format(new Date(booking.checkin), "dd/MM/yyyy")} - {format(new Date(booking.checkout), "dd/MM/yyyy")}</p>
                    </div>
                    <div style={{ width: '15%' }}>
                        <h6>Money</h6>
                        <p>{booking.money}</p>
                    </div>
                    <div style={{ width: '15%' }}>
                        <h6>Deposited</h6>
                        <p>{booking.deposit}</p>
                    </div>
                    <div style={{ width: '15%' }}>
                        <h6>Phone</h6>
                        <p>{booking.phone}</p>
                    </div>
                    <div style={{ width: '15%' }}>
                        <h6>Status</h6>
                        <p className={`booking-list-status ${booking.status}`}>
                            {booking.status}
                        </p>
                    </div>
                </div>
            </div>
            <i className="fa toggle-actions fa-angle-double-left " aria-hidden="true"></i>
            <div className={`booking-list-actions${hover ? " active" : ""}`}>
                {booking.status === "requested" &&
                    (
                        <>
                            <Button
                                color="success"
                                onClick={() => updateBooking('accepted')}
                            >
                                {t('accept')}
                            </Button>
                            <Button
                                color="warning"
                                onClick={() => updateBooking("declined")}
                            >
                                {t('decline')}
                            </Button>
                        </>
                    )}
                {booking.status === "accepted" && (
                    <>
                        <Button
                            color="danger"
                            onClick={() => updateBooking("expired")}
                        >
                            {t('expired')}
                        </Button>
                    </>
                )}
                {booking.status === "deposited" && (
                    <>
                        <Button
                            color="success"
                            onClick={() => setIsOpenDeposit(true)}
                        >
                            {t('checkDeposit')}
                        </Button>
                        <Modal
                            className="modal-dialog-centered"
                            isOpen={isOpenDeposit}
                            toggle={() => setIsOpenDeposit(false)}
                        >
                            {loadingModal ? <Loading /> : <Row>
                                <Col md={12} className="m-2 mt-3">
                                    <h5>
                                        {t('depositMoney')}
                                    </h5>
                                </Col>
                                <Col md="12" className='m-2'>
                                    <img width={400} height={400} src={`http://localhost:3333/bookings/${booking._id}/bill`} alt="" />
                                </Col>
                                <Col md="12" className='booking-submit'>
                                    <Button color='primary' onClick={() => updateBooking("confirmed")}>{t('confirm')}</Button>
                                    <Button color='danger' onClick={() => updateBooking("declined")}>{t('decline')}</Button>
                                </Col>
                            </Row>}
                        </Modal>
                    </>
                )}
                {booking.status === "confirmed" && (
                    <>
                        <Button
                            color="success"
                            onClick={() => updateBooking("stayed")}
                        >
                            {t('stay')}
                        </Button>
                        <Button
                            color="default"
                            onClick={() => setIsOpenService(true)}
                        >
                            {t('services')}
                        </Button>
                        <Button
                            color="danger"
                            onClick={() => updateBooking("expired")}
                        >
                            {t('expired')}
                        </Button>
                    </>
                )}
                {booking.status === "stayed" && (
                    <>
                        <Button
                            color="success"
                            onClick={() => updateBooking("checkout")}
                        >
                            {t('stay')}
                        </Button>
                        <Button
                            color="default"
                            onClick={() => setIsOpenService(true)}
                        >
                            {t('services')}
                        </Button>
                    </>
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
                            <p>{t('confirmSure')}</p>
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
                            <Button
                                color="primary"
                                type="button"
                                className="ml-auto"
                                onClick={actionsEdit.func}
                            >
                                {t('ok')}
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
                                {t('services')}
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
                                                {t('addService')}
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
                                                {services.length === 0 && <Col>{t('noData')}</Col>}
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
                                {t('cancel')}
                            </Button>
                            <Button
                                color="primary"
                                type="button"
                                className="ml-auto"
                                onClick={updateServices}
                            >
                                {t('update')}
                            </Button>
                        </div>
                    </>}
                </Modal>
            </div>
        </div>
    );
};

export default BookingListCard;
