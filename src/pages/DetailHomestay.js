import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import {
    Form,
    CardImg,
    Button,
    Card,
    Modal,
    FormGroup,
    Input,
    InputGroupText,
    InputGroupAddon,
    InputGroup,
    Row,
    Col,
} from "reactstrap";
import { useCookies } from "react-cookie";
import defaultGeo from "utils/geolist";
import Map from "components/Map";
import { postAsyncWithToken } from "utils/request";
import ReactDatetime from "react-datetime";
import { book } from "services/booking";
import validator from "utils/validator";
import { formatDate } from "utils/date";
import { getDiscountsByHomestay } from "services/discount";
import HomestayForm from "components/HomestayForm";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice";
import Loading from "components/Loading";
import { createService } from "services/serviceManagement";
import { useTranslation } from "react-i18next";

const DetailHomestay = ({ homestay, owner, triggerRerender }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(["role", "userid"]);
    const [isOpenChat, setIsOpenChat] = useState(false);
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [isOpenService, setIsOpenService] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [discount, setDiscount] = useState({});
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [loading2, setLoading2] = useState(false);
    const [show, setShow] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [info, setInfo] = useState({
        discountMoney: 0,
        deposit: 0,
        money: 0,
    });
    const { id } = useParams();
    const [mapCoor, setMapCoor] = useState({
        lng: defaultGeo.geoMap.get("Ha Noi")[0],
        lat: defaultGeo.geoMap.get("Ha Noi")[1],
        zoom: [13],
    });
    const imgLink = (id, idx = 0) =>
        `http://localhost:3333/homestays/${id}/images?index=${idx}`;

    const defaultCoor = {
        lng: defaultGeo.geoMap.get("Ha Noi")[0],
        lat: defaultGeo.geoMap.get("Ha Noi")[1],
    };
    const defaultForm = {
        phone: null,
        email: null,
        people: null,
        deposit: null,
        note: null,
        checkin: null,
        checkout: null,
        money: null,
        discountMoney: null,
        discount: null,
    };
    const [ani, toggleAni] = useState(false);
    const [validateErr, setValidateErr] = useState({});
    const [form, setForm] = useState({ ...defaultForm });
    const [validateErrService, setValidateErrService] = useState({});
    const [formService, setFormService] = useState({
        name: null,
        description: null,
        price: null,
        homestay: id,
    });
    const booking = async () => {
        if (cookies.userid) {
            await fetchDiscount();
            setIsOpenForm(true);
        } else {
            navigate("/login");
        }
    };
    const chat = () => {
        if (cookies.userid) {
            setIsOpenChat(true);
        } else {
            navigate("/login");
        }
    };
    const caculate = (discount) => {
        setDiscount(discount);
        if (discount._id) {
            if (form.checkin && form.checkout) {
                let diff = Math.round((form.checkout - form.checkin) / 86400000);
                if (diff) {
                    let dc = Math.round(
                        (homestay.price / 100) * discount.percentage
                    );
                    setInfo({
                        discountMoney: dc * diff,
                        money: (homestay.price - dc) * diff,
                        deposit: (homestay.price - dc) * 0.8 * diff,
                    });
                }
            }
        } else {
            if (form.checkin && form.checkout) {
                let diff = Math.round((form.checkout - form.checkin) / 86400000);
                if (diff) {
                    setInfo({
                        discountMoney: 0,
                        money: homestay.price * diff,
                        deposit: homestay.price * 0.8 * diff,
                    });
                }
            }
        }
    };
    const fetchDiscount = async () => {
        setDiscount({});
        caculate({});
        const res = await getDiscountsByHomestay(id, {
            params: {
                checkin: form.checkin,
                checkout: form.checkout,
            },
        });
        if (res.data) {
            console.log(res.data.discounts);
            setDiscounts(res.data.discounts || []);
        }
    };
    const bookHomestay = async () => {
        const payload = {
            email: form.email,
            phone: form.phone,
            people: form.people,
            checkin: form.checkin,
            checkout: form.checkout,
        };
        const err = validator(
            payload,
            { empty: (v) => (!v ? "wut???" : null) },
            {}
        );
        if (!err) {
            if (discount) payload.discount = discount._id;
            payload.note = form.note;
            payload.money = info.money;
            payload.discountMoney = info.discountMoney;
            payload.deposit = info.deposit;
            setLoading2(true);
            const res = await book(id, payload);
            if (res.data.booking) {
                setIsOpenForm(false);
                setForm({ ...defaultForm });
                triggerRerender();
                dispatch(
                    actions.createAlert({
                        message: "Booked!",
                        type: "success",
                    })
                );
                setLoading2(false);
            } else {
                console.log(res);
                dispatch(
                    actions.createAlert({
                        message: res.data.message,
                        type: "error",
                    })
                );
            }
            setLoading2(false);
            setValidateErr({});
        } else {
            setValidateErr(err);
            toggleAni(!ani);
        }
    };

    const submitChat = async () => {
        const url = process.env.REACT_APP_API_URL + "/chats/send-messages";
        const msg = {
            from: cookies.userid,
            to: owner._id,
            updatedAt: new Date(),
            message: message,
        };
        setLoading2(true);
        const response = await postAsyncWithToken(url, msg);
        if (response.status < 299) {
            setIsOpenChat(false);
            setMessage("");
            dispatch(
                actions.createAlert({
                    message: "Sent message!",
                    type: "success",
                })
            );
        } else {
            dispatch(
                actions.createAlert({
                    message: "Error occur",
                    type: "error",
                })
            );
        }
        setLoading2(false);
    };
    const createServices = async () => {
        const err = validator(
            formService,
            { empty: (v) => (!v ? "wut???" : null) },
            { description: ["empty"], homestay: ["empty"] }
        );
        if (!err) {
            const res = await createService(formService);
            if (res < 299) {
                setFormService({
                    name: null,
                    description: null,
                    price: null,
                    homestay: id,
                });
            }
        } else {
            console.log(err);
            setValidateErrService(err);
            toggleAni(!ani);
        }
    };
    return (
        <Card className="booking-container shadow">
            <div className="detail-homestay">
                <Slide className="slide">
                    {homestay.images.length > 0 ? (
                        homestay.images.map((img, idx) => (
                            <CardImg
                                key={idx}
                                className="each-slide"
                                alt="..."
                                src={imgLink(homestay._id, idx)}
                            />
                        ))
                    ) : (
                        <CardImg
                            className="each-slide"
                            alt="..."
                            src={require("assets/img/theme/team-1-800x800.jpg")}
                        />
                    )}
                </Slide>
                <div className="homestay-info">
                    <div className='detail-price'>${homestay.price}</div>
                    <div className='detail-rate'>{new Array(Math.round(5)).fill().map((q, key) => <i key={key} style={{ color: 'yellow' }} className={Math.round(homestay.rate) > key ? 'fa fa-star' : 'fa fa-star-o'} aria-hidden="true"></i>)}</div>
                    <div>{t('address')}: {homestay.address}</div>
                    <div>{t('slot')}: {homestay.people}</div>
                    <div>{t('pool')}: {homestay.pool ? "Yes" : "No"}</div>
                    <div>{t('homestay.bookings')}: {homestay.bookingNumber}</div>
                    <div>{t('city')}: {homestay.city}</div>
                    <div>{t('owner')}: {owner.name}</div>
                    <div>
                        <span>Map:</span>
                        <Button className="ml-2" color="primary" onClick={() => setShowMap(true)}>Show map</Button>
                        <Modal
                            className="modal-dialog-centered"
                            isOpen={showMap}
                            toggle={() => setShowMap(false)}
                        >
                            <div className="modal-header">
                                <h6 className="modal-title" id="modal-title-default">
                                    Map
                                </h6>
                                <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setShowMap(false)}
                                >
                                    <span>×</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <Map coor={mapCoor} onChange={setMapCoor} defaultCoor={defaultCoor} />
                            </div>
                        </Modal>
                    </div>
                    {cookies.role === "homestay owner" && (
                        <div className="info-actions">
                            <Button onClick={() => setShow(true)} color="primary">
                                {t('homestay.slug.edit')}
                            </Button>
                            {show && (
                                <HomestayForm
                                    turnOff={() => setShow(false)}
                                    triggerRerender={triggerRerender}
                                    editPayload={homestay}
                                />
                            )}
                            <Button onClick={() => setIsOpenService(true)}>
                                {t('homestay.slug.createService')}
                            </Button>
                            <Modal
                                className="modal-dialog-centered"
                                isOpen={isOpenService}
                                toggle={() => setIsOpenService(false)}
                            >
                                <div className="modal-header">
                                    <h4
                                        className="modal-title"
                                        style={{ fontWeight: "700" }}
                                        id="modal-title-default"
                                    >
                                        {t('homestay.slug.createService')}
                                    </h4>
                                    <button
                                        aria-label="Close"
                                        className="close"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={() => setIsOpenService(false)}
                                    >
                                        <span>×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup>
                                                <p
                                                    className={`input-label ${validateErrService.name
                                                        ? ani
                                                            ? "err1"
                                                            : "err2"
                                                        : ""
                                                        }`}
                                                >
                                                    {t('name')}
                                                </p>
                                                <Input
                                                    type="text"
                                                    onChange={(e) => (formService.name = e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <p
                                                    className={`input-label ${validateErrService.price
                                                        ? ani
                                                            ? "err1"
                                                            : "err2"
                                                        : ""
                                                        }`}
                                                >
                                                    {t('price')}
                                                </p>
                                                <Input
                                                    type="number"
                                                    onChange={(e) => (formService.price = e.target.value)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={12}>
                                            <FormGroup>
                                                <p
                                                    className={`input-label ${validateErrService.description
                                                        ? ani
                                                            ? "err1"
                                                            : "err2"
                                                        : ""
                                                        }`}
                                                >
                                                    {t('description')}
                                                </p>
                                                <Input
                                                    type="textarea"
                                                    onChange={(e) =>
                                                        (formService.description = e.target.value)
                                                    }
                                                />
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
                                        onClick={createServices}
                                    >
                                        {t('ok')}
                                    </Button>
                                </div>
                            </Modal>
                        </div>
                    )}
                    {cookies.role !== "homestay owner" && (
                        <div className="info-actions">
                            <Button onClick={booking} color="primary">
                                {t('homestay.slug.bookHomestay')}
                            </Button>
                            <Button onClick={chat}>{t('homestay.slug.chat')}</Button>
                            <Modal
                                className="modal-dialog-centered"
                                isOpen={isOpenChat}
                                toggle={() => setIsOpenChat(false)}
                            >
                                {loading2 ? (
                                    <Loading />
                                ) : (
                                    <Form className="detail-chat">
                                        <FormGroup className="mb-3">
                                            <InputGroup
                                                className="input-group-alternative"
                                                color="primary"
                                            >
                                                <Input
                                                    value={message}
                                                    className="input-text"
                                                    placeholder="Aa"
                                                    type="text"
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </InputGroup>
                                            <InputGroupAddon
                                                className="input-icon"
                                                onClick={submitChat}
                                                addonType="append"
                                            >
                                                <InputGroupText>
                                                    <i className="fa fa-paper-plane" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </FormGroup>
                                    </Form>
                                )}
                            </Modal>
                            <Modal
                                className="modal-dialog-centered"
                                isOpen={isOpenForm}
                                toggle={() => {
                                    setIsOpenForm(false);
                                }}
                            >
                                {loading2 ? (
                                    <Loading />
                                ) : (
                                    <>
                                        <div className="modal-header" style={{ display: "block" }}>
                                            <h4
                                                className="modal-title"
                                                style={{ fontWeight: "700" }}
                                                id="modal-title-default"
                                            >
                                                {t('booking.self')}
                                            </h4>
                                            <p style={{ marginBottom: "0" }}>
                                                {t('homestay.slug.depositMess')}
                                            </p>
                                        </div>
                                        <div className="modal-body">
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <p
                                                            className={`input-label ${validateErr.email ? (ani ? "err1" : "err2") : ""
                                                                }`}
                                                        >
                                                            Email
                                                        </p>
                                                        <Input
                                                            type="text"
                                                            onChange={(e) => (form.email = e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <p
                                                            className={`input-label ${validateErr.phone ? (ani ? "err1" : "err2") : ""
                                                                }`}
                                                        >
                                                            {t('phone')}
                                                        </p>
                                                        <Input
                                                            type="number"
                                                            onChange={(e) => (form.phone = e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <p
                                                            className={`input-label ${validateErr.people
                                                                ? ani
                                                                    ? "err1"
                                                                    : "err2"
                                                                : ""
                                                                }`}
                                                        >
                                                            {t('slot')}
                                                        </p>
                                                        <Input
                                                            type="number"
                                                            onChange={(e) => (form.people = e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <p
                                                            className={`input-label ${validateErr.checkin
                                                                ? ani
                                                                    ? "err1"
                                                                    : "err2"
                                                                : ""
                                                                }`}
                                                        >
                                                            {t('checkin')}
                                                        </p>
                                                        <InputGroup className="input-group-alternative">
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="ni ni-calendar-grid-58" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <ReactDatetime
                                                                onChange={(e) => {
                                                                    form.checkin = formatDate(e._d);
                                                                    fetchDiscount();
                                                                }}
                                                                inputProps={{
                                                                    placeholder: "mm/dd/yyyy",
                                                                }}
                                                                timeFormat={false}
                                                            />
                                                        </InputGroup>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6">
                                                    <FormGroup>
                                                        <p
                                                            className={`input-label ${validateErr.checkout
                                                                ? ani
                                                                    ? "err1"
                                                                    : "err2"
                                                                : ""
                                                                }`}
                                                        >
                                                            {t('checkout')}
                                                        </p>
                                                        <InputGroup className="input-group-alternative">
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="ni ni-calendar-grid-58" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <ReactDatetime
                                                                onChange={(e) => {
                                                                    form.checkout = formatDate(e._d);
                                                                    fetchDiscount();
                                                                }}
                                                                inputProps={{
                                                                    placeholder: "mm/dd/yyyy",
                                                                }}
                                                                timeFormat={false}
                                                            />
                                                        </InputGroup>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <p className={`input-label`}>{t('homestay.slug.note')}</p>
                                                        <Input
                                                            type="textarea"
                                                            onChange={(e) => (form.note = e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="12">
                                                    <FormGroup
                                                        style={{ marginBottom: 0, position: "relative" }}
                                                    >
                                                        <p className={`input-label`}>{t('discount.self')}</p>
                                                        <Input
                                                            className="discount-select"
                                                            type="text"
                                                            value={discount._id || ""}
                                                            onChange={() => { }}
                                                        ></Input>
                                                        <Input
                                                            type="select"
                                                            value={{}}
                                                            onChange={(e) =>
                                                                caculate(discounts[e.target.selectedIndex - 1])
                                                            }
                                                            style={{ opacity: 0 }}
                                                        >
                                                            <option
                                                                style={{ display: "none" }}
                                                                value={{}}
                                                            ></option>
                                                            {discounts.map((discount, index) => (
                                                                <option key={index} value={discount}>
                                                                    {discount._id}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                        {discount._id && (
                                                            <div
                                                                className="discount-select-clear"
                                                                onClick={() => caculate({})}
                                                            >
                                                                <i
                                                                    className="fa fa-times"
                                                                    aria-hidden="true"
                                                                ></i>
                                                            </div>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                {
                                                    <Col md="12">
                                                        <p style={{ marginBottom: 0, marginTop: "8px" }}>
                                                            {t('money')}: {homestay.price}
                                                        </p>
                                                    </Col>
                                                }
                                                {
                                                    <Col md="12">
                                                        <p style={{ marginBottom: 0 }}>
                                                            {t('homestay.slug.deposit')}: {info.deposit}
                                                        </p>
                                                    </Col>
                                                }
                                                {
                                                    <Col md="12">
                                                        <p style={{ marginBottom: 0 }}>
                                                            {t('homestay.slug.discount')}: {info.discountMoney}
                                                        </p>
                                                    </Col>
                                                }
                                                {
                                                    <Col md="12">
                                                        <h4 style={{ marginBottom: 0 }}>
                                                            {t('total')}: {info.money}
                                                        </h4>
                                                    </Col>
                                                }
                                            </Row>
                                        </div>
                                        <div className="modal-footer">
                                            <Button
                                                color="link"
                                                data-dismiss="modal"
                                                type="button"
                                                onClick={() => {
                                                    setIsOpenForm(false);
                                                    setValidateErr({});
                                                    setForm({ ...defaultForm });
                                                }}
                                            >
                                                {t('cancel')}
                                            </Button>
                                            <Button
                                                color="primary"
                                                type="button"
                                                className="ml-auto"
                                                onClick={bookHomestay}
                                            >
                                                {t('ok')}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Modal>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
export default DetailHomestay;
