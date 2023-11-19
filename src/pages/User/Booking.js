import BookingCard from "components/BookingCard";
import { useState, useEffect } from "react";
import { Card, Container } from "reactstrap";
import { getYourBooking } from "services/booking";

function Booking() {
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        async function getData() {
            const response = await getYourBooking();
            setBookings(response.data.bookings);
        }
        getData();
    }, []);

    return (
        <>
            <Container>
                <h1>Your booking</h1>
                <Card className="booking-container shadow">
                    {bookings && bookings.map((booking, key) => <div key={key}><BookingCard booking={booking} /></div>
                    )}</Card>
            </Container>
        </>
    );
}

export default Booking;
