import { useState } from 'react'
import { Button, Card, CardImg, UncontrolledTooltip } from "reactstrap";
import { Slide } from "react-slideshow-image";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
const HomestayCard = ({ homestay, onClick }) => {
    const [cookies, setCookie, removeCookie] = useCookies([
        "role",
    ]);
    const navigate = useNavigate()
    const imgLink = (id, idx = 0) => `http://localhost:3333/homestays/${id}/images?index=${idx}`;
    const detail = () => {
        const url = cookies.role === 'homestay owner' ? `/owner/homestay/${homestay._id}` : `/homestay/${homestay._id}`
        navigate(url)
    }
    const bookings = () => {
        console.log("haha");
    }
    return (
        homestay ?
            <Card onClick={detail} className="homestay-card slide-container card-lift--hover shadow border-0">
                <Slide>{homestay.images.length > 0 ?
                    homestay.images.map((img, idx) => <CardImg
                        key={idx}
                        className="each-slide"
                        alt="..."
                        src={imgLink(homestay._id, idx)}
                    />)
                    : <CardImg
                        className="each-slide"
                        alt="..."
                        src={require('assets/img/theme/team-1-800x800.jpg')}
                    />}
                </Slide>
                <div className='card-detail'>
                    <div className='card-price'>${homestay.price}</div>
                    <div className='card-rate'>{new Array(homestay.rate).fill(0).map((q, key) => <i key={key} className="fa fa-star" aria-hidden="true"></i>)}</div>
                    <h2 style={{ width: 'fit-content', cursor: 'pointer', fontWeight: 'bolder' }}>{homestay.name}</h2>
                    <div>address: {homestay.address}</div>
                    <div>people: {homestay.people}</div>
                    <div>pool: {homestay.pool ? 'Yes' : 'No'}</div>
                    <div>bookings: {homestay.bookingNumber}</div>
                </div>
            </Card> : <>
                <UncontrolledTooltip
                    delay={0}
                    placement="bottom"
                    target="add-homestay"
                >
                    Create new homestay
                </UncontrolledTooltip>
                <Card onClick={onClick} id='add-homestay' className="homestay-card add-homestay slide-container card-lift--hover shadow border-0">
                    <i className='fa fa-plus'></i>
                </Card>
            </>
    )
}

export default HomestayCard