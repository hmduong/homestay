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

const BookingCard = ({ key, booking }) => {
    const dispatch = useDispatch();
    const defaultForm = {
        comment: null
    }
    const [hover, setHover] = useState(false)
    const [rate, setRate] = useState(5)
    const [isOpenReview, setIsOpenReview] = useState(false)
    const [reviewed, setReviewed] = useState(false)
    const [reviewId, setReviewId] = useState(null)
    const [validateErr, setValidateErr] = useState({})
    const [ani, toggleAni] = useState(false)
    const [form, setForm] = useState({ ...defaultForm })
    const [loading, setLoading] = useState(false);
    const imgLink = (id, idx = 0) => `http://localhost:3333/homestays/${id}/images?index=${idx}`;

    const [cookies, setCookie, removeCookie] = useCookies([
        "role",
    ]);
    const navigate = useNavigate()
    const check = () => {
        navigate(`/homestay/${booking.homestay._id}`)
    }
    const openReview = (id) => {
        setIsOpenReview(true)
        setReviewId(id)
    }
    const sendReview = async () => {
        const err = validator(form, { empty: (v) => !v ? 'wut???' : null }, {})
        if (!err) {
            const data = {
                comment: form.comment,
                rate: rate,
            };
            setLoading(true)
            const res = await review(reviewId, data);
            if (res.status < 299) {
                setIsOpenReview(false)
                setValidateErr({})
                dispatch(
                    actions.createAlert({
                        message: "Review successed!",
                        type: "success"
                    })
                );
                setReviewed(true)
            } else {
                dispatch(
                    actions.createAlert({
                        message: "Error occur!",
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

    return (
        <div key={key} className="booking-card"
            onMouseLeave={() => setHover(false)}
            onMouseOver={() => setHover(true)}>
            <div className='booking-info'>
                <h2>{booking.homestay.name}</h2>
                <div className='sub-info'>
                    <div>
                        <p>Check in: {format(new Date(booking.checkin), "dd/MM/yyyy")}</p>
                        <p>Check out: {format(new Date(booking.checkout), "dd/MM/yyyy")}</p>
                    </div>
                    <div>
                        <p>Phone: {booking.phone}</p>
                        <p>People: {booking.people}</p>
                        <p>Money: {booking.money}</p>
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
                <Button onClick={check} color='primary' style={{ marginRight: 0, marginBottom: '8px' }}>Check Homestay</Button>
                {!reviewed && booking.status === 'stayed' && cookies.role === 'visitor' && <Button onClick={() => openReview(booking._id)}>Review</Button>}
                <Modal
                    className="modal-dialog-centered"
                    isOpen={isOpenReview}
                    toggle={() => setIsOpenReview(false)}
                >
                    {loading ? <Loading /> : <Row>
                        <Col md="12" className='booking-rate'>
                            <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} onClick={() => setRate(1)} className={`fa fa-star`} aria-hidden="true"></i>
                            <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} onClick={() => setRate(2)} className={`fa fa-star${rate > 1 ? '' : '-o'}`} aria-hidden="true"></i>
                            <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} onClick={() => setRate(3)} className={`fa fa-star${rate > 2 ? '' : '-o'}`} aria-hidden="true"></i>
                            <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} onClick={() => setRate(4)} className={`fa fa-star${rate > 3 ? '' : '-o'}`} aria-hidden="true"></i>
                            <i style={{ color: 'yellow', marginRight: '8px', fontSize: '36px' }} onClick={() => setRate(5)} className={`fa fa-star${rate > 4 ? '' : '-o'}`} aria-hidden="true"></i>
                        </Col>
                        <Col md="12" className='modal-body'>
                            <FormGroup>
                                <p className={`input-label ${validateErr.comment ? (ani ? 'err1' : 'err2') : ''}`} >Comment</p>
                                <Input type="textarea" onChange={e => form.comment = e.target.value} />
                            </FormGroup>
                        </Col>
                        <Col md="12" className='booking-submit'>
                            <Button color='primary' onClick={sendReview}>Send review</Button>
                        </Col>
                    </Row>}
                </Modal>
            </div>
        </div>
    )
}

export default BookingCard