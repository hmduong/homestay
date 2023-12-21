import { useState, useEffect } from "react";
import { getListDiscount } from "services/discount";
import { useCookies } from "react-cookie";
import { Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Modal, Row, Button } from "reactstrap";
import DiscountTicket from "components/DiscountTicket";
import ReactDatetime from "react-datetime";
import { getListHomestay } from "services/homestayManagementService";
import { formatDate } from "utils/date";
import { createDiscount } from "services/discount";
import validator from 'utils/validator';
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useTranslation } from "react-i18next";

const Discount = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [form, setForm] = useState({
        percentage: null,
        quantity: null,
        checkin: null,
        checkout: null,
    });
    const [homestaysApply, setHomestaysApply] = useState([]);
    const [homestays, setHomestays] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies([
        "userid",
    ]);
    const [show, setShow] = useState(false)
    const [ani, toggleAni] = useState(false)
    const [validateErr, setValidateErr] = useState({})
    const [rerender, triggerRerender] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const { data } = await getListDiscount(cookies.userid);
            let discounts = []
            if (data.activeDiscounts && data.inactiveDiscounts) {
                discounts = data.activeDiscounts.concat(data.inactiveDiscounts)
            }
            setData(discounts);
            setLoading(false)
        };
        fetchData();
    }, []);

    const addDiscount = async () => {
        const err = validator(form, { empty: (v) => !v ? 'wut???' : null }, {})
        if (!err) {
            form.homestays = homestaysApply.map(homestay => homestay._id)
            setLoading2(true)
            const res = await createDiscount(form);
            if (res.status < 299) {
                triggerRerender(!rerender)
                setForm({
                    percentage: null,
                    quantity: null,
                    checkin: null,
                    checkout: null,
                })
                setHomestaysApply([])
                setShow(false)
                dispatch(
                    actions.createAlert({
                        message: t('alert.addedDiscount'),
                        type: "success"
                    })
                );
            } else {
                dispatch(
                    actions.createAlert({
                        message: t('alert.error'),
                        type: "error"
                    })
                );
            }
            setLoading2(false)
            setValidateErr({})
        } else {
            setValidateErr(err);
            toggleAni(!ani)
        }
    }
    const openModal = async () => {
        setShow(true)
        const response = await getListHomestay(cookies.userid);
        setHomestays(response.data.homestays);
    }
    const addHomestaysApply = (id) => {
        const found = homestaysApply.find(homestay => homestay._id === homestays[id]._id)
        if (!found) setHomestaysApply([...homestaysApply, homestays[id]])
    }
    return (
        loading ? <Loading /> :
            <>
                <div className="homestay-head">
                    <h1>{t('discount.header')}</h1>
                    <Button onClick={openModal} color="primary" className="add-btn">{t('create')}</Button>
                </div>
                <Row>
                    {
                        data ? data.map((discount, index) => <Col key={index} className="mb-5" md="4">
                            <DiscountTicket discount={discount} />
                        </Col>) : <></>
                    }
                    <Col className="mb-5" md="4">
                        <DiscountTicket onClick={openModal} />
                    </Col>
                </Row>
                <Modal
                    className="modal-dialog-centered"
                    isOpen={show}
                    toggle={() => setShow(false)}
                >
                    {loading2 ? <Loading /> : <>
                        <div className="modal-header">
                            <h6 className="modal-title" id="modal-title-default">
                            {t('discount.createNew')}
                            </h6>
                            <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setShow(false)}
                            >
                                <span>×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <p className={`input-label ${validateErr.quantity ? (ani ? 'err1' : 'err2') : ''}`}>{t('quantity')}: </p>
                                        <Input type="number" onChange={e => form.quantity = e.target.value} />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <p className={`input-label ${validateErr.percentage ? (ani ? 'err1' : 'err2') : ''}`}>{t('percentage')}: </p>
                                        <Input type="number" onChange={e => form.percentage = e.target.value} />
                                    </FormGroup>
                                </Col>
                                <Col md="12">
                                    <FormGroup style={{ marginBottom: '16px', position: 'relative' }}>
                                        <p className={`input-label`}>Homestays: </p>
                                        <div className="homestays-picker">
                                            <div className="homestays-apply">
                                                {homestaysApply.map((homestay, key) => <span key={key}>{homestay.name}, </span>)}
                                            </div>
                                            <div className="picker-btn">{t('choose')}</div>
                                            <Input
                                                className="homestay-select"
                                                type="select"
                                                value={{}}
                                                onChange={e => addHomestaysApply(e.target.selectedIndex - 1)}
                                                style={{ opacity: 0 }}
                                            >
                                                <option style={{ display: 'none' }} value={{}}></option>
                                                {homestays.map((homestay, index) => <option key={index} value={homestay}>
                                                    {homestay.name}
                                                </option>)}
                                            </Input>
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <p className={`input-label ${validateErr.checkin ? (ani ? 'err1' : 'err2') : ''}`}>{t('start')}: </p>
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="ni ni-calendar-grid-58" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <ReactDatetime
                                                onChange={e => form.checkin = formatDate(e._d)}
                                                inputProps={{
                                                    placeholder: "dd/MM/yyyy"
                                                }}
                                                timeFormat={false}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <p className={`input-label ${validateErr.checkout ? (ani ? 'err1' : 'err2') : ''}`}>{t('end')}: </p>
                                        <InputGroup className="input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="ni ni-calendar-grid-58" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <ReactDatetime
                                                onChange={e => form.checkout = formatDate(e._d)}
                                                inputProps={{
                                                    placeholder: "dd/MM/yyyy"
                                                }}
                                                timeFormat={false}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                        <div className="modal-footer">
                            <Button
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setShow(false)}
                            >
                                {t('cancel')}
                            </Button>
                            <Button color="primary" type="button" className="ml-auto" onClick={addDiscount}>
                                {t('create')}
                            </Button>
                        </div>
                    </>}
                </Modal>
            </>
    );
}

export default Discount;





