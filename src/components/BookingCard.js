import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Card, Col, FormGroup, Modal, Row, UncontrolledTooltip } from 'reactstrap'
import { review } from 'services/review';
import validator from 'utils/validator';
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { editBook } from 'services/booking';
import { multipleFilesUpload } from "utils/request";
import { useTranslation } from 'react-i18next';
import { getReviewById } from 'services/review';
import { getBooking } from 'services/booking';

const BookingCard = ({ indexkey, booking, triggerRerender }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const form = {
        comment: null
    }
    const [rate, setRate] = useState(5)
    const [isOpenReview, setIsOpenReview] = useState(false)
    const [isOpenCheckReview, setIsOpenCheckReview] = useState(false)
    const [isOpenDeposit, setIsOpenDeposit] = useState(false)
    const [validateErr, setValidateErr] = useState({})
    const [isExpand, setIsExpand] = useState(false)
    const [ani, toggleAni] = useState(false)
    const [loading, setLoading] = useState(false);
    const [bill, setBill] = useState(null);
    const [checkLoading, setCheckLoading] = useState(false);
    const [reviewed, setReviewed] = useState({});
    const navigate = useNavigate()
    const [detailBooking, setDetailBooking] = useState(null)
    useEffect(() => {
        const fetch = async () => {
            const response = await getBooking(booking._id);
            if (response.data) {
                setDetailBooking(response.data.booking)
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
    const check = () => {
        navigate(`/homestay/${booking.homestay._id}`)
    }
    const sendReview = async () => {
        const err = validator(form, { empty: (v) => !v ? 'wut???' : null }, {})
        if (!err) {
            const data = {
                comment: form.comment,
                rate: rate,
            };
            setLoading(true)
            const res = await review(booking._id, data);
            if (res.status < 299) {
                setIsOpenReview(false)
                setValidateErr({})
                dispatch(
                    actions.createAlert({
                        message: t('alert.reviewSuccessful'),
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
            triggerRerender()
            setLoading(false)
            setIsOpenReview(false)
            setValidateErr({})
        } else {
            setValidateErr(err);
            toggleAni(!ani)
        }
    }
    const openCheckReview = async () => {
        setIsOpenCheckReview(true)
        setCheckLoading(true)
        const res = await getReviewById(booking._id);
        if (res.data.review) {
            setReviewed(res.data.review)
        } else {
            setReviewed({})
        }
        setCheckLoading(false)
    }
    const sendDeposit = async () => {
        const err = validator({ bill: bill }, { empty: (v) => !v ? 'wut???' : null, image: (v) => v > 1024 * 1024 ? "sdad" : null }, {})
        if (!err) {
            setLoading(true)
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
                status: "deposited",
                services: booking.services || [],
            };
            const res = await editBook(booking._id, data);
            if (res.data.booking) {
                await saveBill(booking._id);
                setIsOpenDeposit(false)
                setValidateErr({})
                dispatch(
                    actions.createAlert({
                        message: t('alert.depositSuccessful'),
                        type: "success"
                    })
                );
                triggerRerender()
            } else {
                dispatch(
                    actions.createAlert({
                        message: t('alert.error'),
                        type: "error"
                    })
                );
            }
            setLoading(false)
            setIsOpenDeposit(false)
            setValidateErr({})
        } else {
            setValidateErr(err);
            toggleAni(!ani)
        }
    }
    const saveBill = async (id) => {
        const formData = new FormData();
        formData.append("bill", bill);
        const url = process.env.REACT_APP_API_URL + "/bookings/" + id + "/deposit";
        const res = await multipleFilesUpload(url, formData);
        if (res.status >= 400 || !res) console.log("err");
        return res
    };

    return (
        <>
            <Card key={indexkey} className="booking-card shadow">
                <div className='booking-info' onClick={() => setIsExpand(!isExpand)}>
                    <div className='bi-info biname'>
                        <h6>{t('name')}</h6>
                        {detailBooking &&<h5 onClick={check}>{detailBooking.homestay.name}</h5>}
                    </div>
                    <div className='bi-info bitime'>
                        <h6>{t('time')}</h6>
                        <p>{format(new Date(booking.checkin), "dd/MM/yyyy")} - {format(new Date(booking.checkout), "dd/MM/yyyy")}</p>
                    </div>
                    <div className='bi-info bitotal'>
                        <h6>{t('money')}</h6>
                        <p>{booking.money} VNĐ</p>
                    </div>
                    <div className='bi-info bistatus'>
                        <h6>{t('status')}</h6>
                        <h5 className={`booking-status ${booking.status}`}>{booking.status}</h5>
                    </div>
                    <i className={`fa fa-angle-${isExpand ? 'up' : 'down'} bi-dropdown`} aria-hidden="true"></i>
                </div>
                {isExpand && <div className='booking-expand'>
                    <div style={{ width: '35%' }}>
                        <div className='bi-expand bicity'>
                        <h6>{t('city')}:</h6> <p>{booking.homestay.city}</p>
                        </div>
                        <div className='bi-expand biaddress'>
                            <h6>{t('address')}:</h6> <p>{booking.homestay.address}</p>
                        </div>
                    </div>
                    <div style={{ width: '30%' }}>
                        <div className='bi-expand bipeople'>
                            <h6>{t('people')}:</h6> <p>{booking.people}</p>
                        </div>
                        <div className='bi-expand bideposit'>
                            <h6>{t('depositMoney')}:</h6> <p>{booking.deposit} VNĐ</p>
                        </div>
                    </div>
                    <div className='biexpand-btns' style={{ width: '35%' }}>
                        {
                            booking.status === 'checkout' &&
                            <>
                                <Button className='checkhomestay' id='reviewBtn' onClick={() => setIsOpenReview(true)} color='default'>
                                    {t('homestay.reviews')}
                                </Button>
                                <Modal
                                    className="modal-dialog-centered"
                                    isOpen={isOpenReview}
                                    toggle={() => setIsOpenReview(false)}
                                >
                                    {loading ? <Loading /> : <Row>
                                        <Col md={12} className="m-2 mt-3">
                                            <h5>
                                                {t('homestay.reviews')}
                                            </h5>
                                        </Col>
                                        <Col md="12" className='booking-rate'>
                                            <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} onClick={() => setRate(1)} className={`fa fa-star`} aria-hidden="true"></i>
                                            <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} onClick={() => setRate(2)} className={`fa fa-star${rate > 1 ? '' : '-o'}`} aria-hidden="true"></i>
                                            <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} onClick={() => setRate(3)} className={`fa fa-star${rate > 2 ? '' : '-o'}`} aria-hidden="true"></i>
                                            <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} onClick={() => setRate(4)} className={`fa fa-star${rate > 3 ? '' : '-o'}`} aria-hidden="true"></i>
                                            <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} onClick={() => setRate(5)} className={`fa fa-star${rate > 4 ? '' : '-o'}`} aria-hidden="true"></i>
                                        </Col>
                                        <Col md="12" className='p-4'>
                                            <FormGroup>
                                                <p className={`mb-0 input-label ${validateErr.comment ? (ani ? 'err1' : 'err2') : ''}`} >{t('homestay.comment')}</p>
                                                <Input type="textarea" onChange={e => form.comment = e.target.value} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="12" className='booking-submit'>
                                            <Button onClick={sendReview}>{t('homestay.sendReview')}</Button>
                                        </Col>
                                    </Row>}
                                </Modal></>
                        }
                        {booking.status === 'accepted' && <>
                            <Button className='checkhomestay' id='depositBtn' onClick={() => setIsOpenDeposit(true)} color='warning'>
                                {t('deposit')}
                            </Button>
                            <Modal
                                className="modal-dialog-centered"
                                isOpen={isOpenDeposit}
                                toggle={() => setIsOpenDeposit(false)}
                            >

                                {loading ? <Loading /> : <Row>
                                    <Col md={12} className="m-2 mt-3">
                                        <h4>
                                            {t('depositMoney')}
                                        </h4>
                                    </Col>
                                    <Col md={12}>
                                        <h6 className='ml-2'>{t('booking.depositAlert1')}<span style={{ color: 'red' }}>{booking.deposit} VND</span>{t('booking.depositAlert2')}</h6>
                                        <p className={`mb-0 ml-2 input-label`} >{t('scanQRPayment')}</p>
                                        <img className='p-2' style={{ width: '100%', height: '400px' }} src={process.env.REACT_APP_API_URL + "/users/" + booking.homestay.owner + "/banking"} alt="" />
                                    </Col>
                                    <Col md="12" className='m-2'>
                                        <FormGroup>
                                            <p className={`mb-0 input-label ${validateErr.bill ? (ani ? 'err1' : 'err2') : ''}`} >{t('uploadBillImage')} (1MB)</p>
                                            <Input
                                                type="file"
                                                accept=".jpg,.png"
                                                multiple
                                                onChange={(e) => setBill(e.target.files[0])}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="12" className='booking-submit'>
                                        <Button color='primary' onClick={sendDeposit}>{t('authAction.submit')}</Button>
                                    </Col>
                                </Row>}
                            </Modal>
                        </>
                        }
                        {booking.status === 'reviewed' && <>
                            <Button className='checkhomestay' id='reviewedBtn' onClick={openCheckReview} color='warning'>
                                {t('checkReview')}
                            </Button>
                            <Modal
                                className="modal-dialog-centered"
                                isOpen={isOpenCheckReview}
                                toggle={() => setIsOpenCheckReview(false)}
                            >

                                {checkLoading ? <Loading /> : <>
                                    <div className="modal-header">
                                        <h4
                                            className="modal-title"
                                            style={{ fontWeight: "700" }}
                                            id="modal-title-default"
                                        >
                                            {booking.homestay.name}
                                        </h4>
                                        <button
                                            aria-label="Close"
                                            className="close"
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() => setIsOpenCheckReview(false)}
                                        >
                                            <span>×</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <Row>
                                            <Col md="12" className='booking-rate'>
                                                <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} className={`fa fa-star`} aria-hidden="true"></i>
                                                <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} className={`fa fa-star${reviewed.rate > 1 ? '' : '-o'}`} aria-hidden="true"></i>
                                                <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} className={`fa fa-star${reviewed.rate > 2 ? '' : '-o'}`} aria-hidden="true"></i>
                                                <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} className={`fa fa-star${reviewed.rate > 3 ? '' : '-o'}`} aria-hidden="true"></i>
                                                <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} className={`fa fa-star${reviewed.rate > 4 ? '' : '-o'}`} aria-hidden="true"></i>
                                            </Col>
                                            <Col md="12" className='booking-rate'>
                                                <h6 className='mr-1'>Comment: </h6> <p>{reviewed.comment}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                </>}
                            </Modal>
                        </>
                        }
                    </div>
                </div>}
            </Card>
        </>
    )
}

export default BookingCard