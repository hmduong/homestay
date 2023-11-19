import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Slide } from "react-slideshow-image";
import { Form, CardImg, Button, Card, Modal, FormGroup, Input, InputGroupText, InputGroupAddon, InputGroup, Row, Col } from "reactstrap";
import { getHomestay } from "services/homestayManagementService";
import Statistics from "./Owner/Statistics";
import { useCookies } from "react-cookie";
import defaultGeo from "utils/geolist";
import Map from "components/Map";
import { postAsyncWithToken } from "utils/request";
import ReactDatetime from "react-datetime";
import { book } from "services/booking";
import validator from 'utils/validator';
import { formatDate } from "utils/date";
import { getDiscountsByHomestay } from "services/discount";

const DetailHomestay = () => {
    const [cookies, setCookie, removeCookie] = useCookies([
        "role",
        'userid'
    ]);
    const [isOpenChat, setIsOpenChat] = useState(false);
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [rerender, triggerRerender] = useState(false)
    const [discounts, setDiscounts] = useState([]);
    const [discount, setDiscount] = useState('')
    const navigate = useNavigate()
    const [message, setMessage] = useState('');
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState('default');
    const { id } = useParams()
    const [mapCoor, setMapCoor] = useState({
        lng: defaultGeo.geoMap.get('Ha Noi')[0],
        lat: defaultGeo.geoMap.get('Ha Noi')[1],
        zoom: [13]
    })
    const imgLink = (id, idx = 0) => `http://localhost:3333/homestays/${id}/images?index=${idx}`;

    const defaultCoor = {
        lng: defaultGeo.geoMap.get('Ha Noi')[0],
        lat: defaultGeo.geoMap.get('Ha Noi')[1],
    }
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
    }
    const [ani, toggleAni] = useState(false)
    const [validateErr, setValidateErr] = useState({})
    const [form, setForm] = useState({ ...defaultForm })
    const booking = async () => {
        if (cookies.userid) {
            await fetchDiscount()
            setIsOpenForm(true)
        } else {
            navigate('/login')
        }
    }
    const chat = () => {
        if (cookies.userid) {
            setIsOpenChat(true)
        } else {
            navigate('/login')
        }
    }
    const fetchDiscount = async () => {
        const payload = [id]
        if (form.checkin && form.checkout) setInfo('day')
        if (form.checkin || form.checkout) {
            payload.push({
                params: {
                    checkin: form.start,
                    checkout: form.end,
                }
            })
        }
        const response = await getDiscountsByHomestay(payload)
        if (response.data) {
            setDiscounts(response.data.discounts || [])
        }
    }
    const addHomestay = async () => {
        // const err = validator(form, { empty: (v) => !v ? 'wut???' : null })
        // if (!err) {
        //     const res = await book(id, form);
        //     if (res.data.booking) {
        //         setIsOpenForm(false)
        //         setForm({ ...defaultForm })
        //         triggerRerender(!rerender)
        //     }
        //     setValidateErr({})
        // } else {
        //     setValidateErr(err);
        //     toggleAni(!ani)
        // }
    }

    const submitChat = async () => {
        const url = process.env.REACT_APP_API_URL + "/chats/send-messages";
        const msg = {
            from: cookies.userid,
            to: data.owner._id,
            updatedAt: new Date(),
            message: message,
        };

        const response = await postAsyncWithToken(url, msg);
        if (response.status < 400) {
        }
        setIsOpenChat(false)
        setMessage('')
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getHomestay(id);
            setData(data.data);
            setLoading(false)
        };
        fetchData();
    }, [rerender]);
    return (loading ? <></> :
        <>
            <Card>
                <div className="detail-homestay">
                    <Slide className="slide">{data.homestay.images.length > 0 ?
                        data.homestay.images.map((img, idx) => <CardImg
                            key={idx}
                            className="each-slide"
                            alt="..."
                            src={imgLink(data.homestay._id, idx)}
                        />)
                        : <CardImg
                            className="each-slide"
                            alt="..."
                            src={require('assets/img/theme/team-1-800x800.jpg')}
                        />}
                    </Slide>
                    <div className="homestay-info">
                        <h2 style={{ width: 'fit-content', cursor: 'pointer', fontWeight: 'bolder' }}>{data.homestay.name}</h2>
                        <div>address: {data.homestay.address}</div>
                        <div>people: {data.homestay.people}</div>
                        <div>pool: {data.homestay.pool ? 'Yes' : 'No'}</div>
                        <div>rate: {data.homestay.rate}</div>
                        <div>bookings: {data.homestay.bookingNumber}</div>
                        <div>Price: {data.homestay.price}</div>
                        <div>City: {data.homestay.city}</div>
                        <div>Owner: {data.owner.name}</div>
                        {cookies.role !== 'homestay owner' && <div className="info-actions">
                            <Button onClick={booking} color="primary">Book this homestay</Button>
                            <Button onClick={chat}>Chat with owner</Button>
                            <Modal
                                className="modal-dialog-centered"
                                isOpen={isOpenChat}
                                toggle={() => setIsOpenChat(false)}
                            >
                                <Form className="detail-chat">
                                    <FormGroup className="mb-3">
                                        <InputGroup className="input-group-alternative" color="primary">
                                            <Input value={message} className="input-text" placeholder="Aa" type="text" onChange={(e) => setMessage(e.target.value)} />
                                        </InputGroup>
                                        <InputGroupAddon className="input-icon" onClick={submitChat} addonType="append">
                                            <InputGroupText>
                                                <i className="fa fa-paper-plane" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </FormGroup>
                                </Form>
                            </Modal>
                            <Modal
                                className="modal-dialog-centered"
                                isOpen={isOpenForm}
                                toggle={() => {
                                    setIsOpenForm(false)
                                    // setValidateErr({})
                                    // setForm({ ...defaultForm })
                                }}
                            >
                                <div className="modal-header" style={{ display: "block" }}>
                                    <h4 className="modal-title" style={{ fontWeight: '700' }} id="modal-title-default">
                                        Booking
                                    </h4>
                                    <p style={{ marginBottom: "0" }}>You shoud deposit 80% of total money</p>
                                </div>
                                <div className="modal-body">
                                    <Row>
                                        <Col md="12">
                                            <FormGroup>
                                                <p className={`input-label ${validateErr.name ? (ani ? 'err1' : 'err2') : ''}`} >Email</p>
                                                <Input type="text"
                                                    onChange={e => form.email = e.target.value}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <p className={`input-label ${validateErr.name ? (ani ? 'err1' : 'err2') : ''}`} >Phone</p>
                                                <Input type="number"
                                                    onChange={e => form.phone = e.target.value}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <p className={`input-label ${validateErr.name ? (ani ? 'err1' : 'err2') : ''}`} >People</p>
                                                <Input type="number"
                                                    onChange={e => form.people = e.target.value}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <p className="input-label">Check in</p>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        onChange={(e) => {
                                                            form.checkin = formatDate(e._d)
                                                            fetchDiscount()
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
                                                <p className="input-label">Check in</p>
                                                <InputGroup className="input-group-alternative">
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i className="ni ni-calendar-grid-58" />
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                    <ReactDatetime
                                                        onChange={(e) => {
                                                            form.checkout = formatDate(e._d)
                                                            fetchDiscount()
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
                                                <p className={`input-label`} >Note</p>
                                                <Input type="textarea"
                                                    onChange={e => form.note = e.target.value}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="12">
                                            <FormGroup style={{ marginBottom: 0, position: 'relative' }}>
                                                <p className={`input-label`} >Discount</p>
                                                <Input
                                                    className="discount-select"
                                                    type="text"
                                                    value={discount}
                                                    onChange={() => { }}
                                                ></Input>
                                                <Input
                                                    type="select"
                                                    value={discount}
                                                    onChange={e => {
                                                        setDiscount(discounts[e.target.selectedIndex])
                                                    }}
                                                    style={{ opacity: 0 }}
                                                >
                                                    {discounts.map((e, index) => <option key={index} value="e">
                                                        e
                                                    </option>)}
                                                </Input>
                                                {discount && <div className="discount-select-clear" onClick={() => setDiscount('')}><i className="fa fa-times" aria-hidden="true"></i></div>}
                                            </FormGroup>
                                        </Col>
                                        {<Col md='12'>
                                            <p style={{ marginBottom: 0, marginTop: '8px' }}>Money: {data.homestay.price}</p>
                                        </Col>}
                                        {<Col md='12'>
                                            <p style={{ marginBottom: 0 }}>Deposit: {data.homestay.price * 0.8}</p>
                                        </Col>}
                                        {<Col md='12'>
                                            <p style={{ marginBottom: 0 }}>Discount: {data.homestay.price}</p>
                                        </Col>}
                                        {<Col md='12'>
                                            <h4 style={{ marginBottom: 0 }}>Total: {data.homestay.price}</h4>
                                        </Col>}
                                    </Row>
                                </div>
                                <div className="modal-footer">
                                    <Button
                                        color="link"
                                        data-dismiss="modal"
                                        type="button"
                                        onClick={() => {
                                            setIsOpenForm(false)
                                            // setValidateErr({})
                                            // setForm({ ...defaultForm })
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button color="primary" type="button" className="ml-auto" onClick={addHomestay}>
                                        Book
                                    </Button>
                                </div>
                            </Modal>
                        </div>}
                    </div>
                </div>
            </Card>
            <Map coor={mapCoor} onChange={setMapCoor} defaultCoor={defaultCoor} />
            {cookies.role === 'homestay owner' && <Statistics />}
        </>

    )
}
export default DetailHomestay