import { useState } from 'react'
import { Button, Card, CardImg, UncontrolledTooltip } from "reactstrap";
import { Slide } from "react-slideshow-image";
import { useNavigate } from 'react-router-dom';
const HomestayCard = ({ homestay, onClick }) => {
    const navigate = useNavigate()
    const [hover, setHover] = useState(false)
    const imgLink = (id, idx = 0) => `http://localhost:3333/homestays/${id}/images?index=${idx}`;
    const detail = () => {
        navigate(`/owner/homestay/${homestay._id}`)
    }
    const bookings = () => {
        console.log("haha");
    }
    return (
        homestay ?
            <Card onMouseLeave={() => setHover(false)} onMouseOver={() => setHover(true)} className="homestay-card slide-container card-lift--hover shadow border-0">
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
                <div style={{ padding: '8px 16px' }}>
                    <h2 style={{ width: 'fit-content', cursor: 'pointer', fontWeight: 'bolder' }}>{homestay.name}</h2>
                    <div>address: {homestay.address}</div>
                    <div>people: {homestay.people}</div>
                    <div>pool: {homestay.pool ? 'Yes' : 'No'}</div>
                    <div>rate: {homestay.rate}</div>
                    <div>bookings: {homestay.bookingNumber}</div>
                </div>
                {
                    hover ?
                        <div className='hover-actions'>
                            <Button onClick={detail} className='actions-btn' color="secondary" size="lg" type="button">
                                Detail
                            </Button>
                            <Button onClick={bookings} className='actions-btn' color="secondary" size="lg" type="button">
                                Bookings
                            </Button>
                            <Button onClick={bookings} className='actions-btn' color="secondary" size="lg" type="button">
                                Statistic
                            </Button>
                        </div>
                        : <>
                        </>
                }
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