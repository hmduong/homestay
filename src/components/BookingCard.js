import { format } from 'date-fns';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Slide } from 'react-slideshow-image'
import { Input, Button, CardImg, Col, FormGroup, Modal, Row } from 'reactstrap'
import { review } from 'services/review';
import validator from 'utils/validator';
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { editBook } from 'services/booking';
import { multipleFilesUpload } from "utils/request";
import { useTranslation } from 'react-i18next';

const BookingCard = ({ booking, triggerRerender }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const form = {
        comment: null
    }
    const [hover, setHover] = useState(false)
    const [rate, setRate] = useState(5)
    const [isOpenReview, setIsOpenReview] = useState(false)
    const [isOpenDeposit, setIsOpenDeposit] = useState(false)
    const [reviewed, setReviewed] = useState(false)
    const [validateErr, setValidateErr] = useState({})
    const [ani, toggleAni] = useState(false)
    const [loading, setLoading] = useState(false);
    const [bill, setBill] = useState(null);
    const imgLink = (id, idx = 0) => `http://localhost:3333/homestays/${id}/images?index=${idx}`;

    const [cookies, setCookie, removeCookie] = useCookies([
        "role",
    ]);
    const navigate = useNavigate()
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
                setReviewed(true)
            } else {
                dispatch(
                    actions.createAlert({
                        message:  t('alert.error'),
                        type: "error"
                    })
                );
            }
            setLoading(false)
            setIsOpenReview(false)
            setValidateErr({})
        } else {
            setValidateErr(err);
            toggleAni(!ani)
        }
    }
    const sendDeposit = async () => {
        const err = validator({ bill: bill }, { empty: (v) => !v ? 'wut???' : null }, {})
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
        !reviewed && <div className="booking-card"
            onMouseLeave={() => setHover(false)}
            onMouseOver={() => setHover(true)}>
            <div className='booking-info'>
                <h2>{booking.homestay.name}</h2>
                <div className='sub-info'>
                    <div>
                        <p>{t('checkin')}: {format(new Date(booking.checkin), "dd/MM/yyyy")}</p>
                        <p>{t('checkout')}: {format(new Date(booking.checkout), "dd/MM/yyyy")}</p>
                    </div>
                    <div>
                        <p>{t('phone')}: {booking.phone}</p>
                        <p>{t('people')}: {booking.people}</p>
                        <p>{t('money')}: {booking.money}</p>
                    </div>
                </div>
                <h5 className={`booking-status ${booking.status}`}>{booking.status}</h5>
            </div>
            <div className='booking-img'>
                <Slide>{booking.homestay.images.length > 0 ?
                    booking.homestay.images.map((img, idx) => <CardImg
                        key={idx}
                        className="each-slide"
                        alt="..."
                        src={imgLink(booking.homestay._id, idx)}
                    />)
                    : <CardImg
                        className="each-slide"
                        alt="..."
                        src={require('assets/img/theme/team-1-800x800.jpg')}
                    />}
                </Slide>
            </div>
            <div className={`booking-actions${hover ? ' active' : ''}`}>
                <Button onClick={check} color='primary' style={{ marginRight: 0, marginBottom: '8px' }}>{t('homestay.checkHomestay')}</Button>
                {
                    booking.status === 'stayed' &&
                    <><Button onClick={() => setIsOpenReview(true)}>{t('homestay.reviews')}</Button>
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
                                    <Button color='primary' onClick={sendReview}>{t('homestay.sendReview')}</Button>
                                </Col>
                            </Row>}
                        </Modal></>
                }
                {booking.status === 'accepted' && <><Button
                    onClick={() => setIsOpenDeposit(true)}
                >{t('deposit')}</Button>
                    <Modal
                        className="modal-dialog-centered"
                        isOpen={isOpenDeposit}
                        toggle={() => setIsOpenDeposit(false)}
                    >

                        {loading ? <Loading /> : <Row>
                            <Col md={12} className="m-2 mt-3">
                                <h5>
                                    {t('deposit')}
                                </h5>
                            </Col>
                            <Col md={12}>
                                <img style={{ width: '100%', height: '400px' }} src={process.env.REACT_APP_API_URL + "/users/" + booking.homestay.owner + "/banking"} alt="" />
                            </Col>
                            <Col md="12" className='m-2'>
                                <FormGroup>
                                    <p className={`mb-0 input-label ${validateErr.bill ? (ani ? 'err1' : 'err2') : ''}`} >{t('bill')}</p>
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
                    </Modal></>
                }

            </div>
        </div>
    )
}

export default BookingCard