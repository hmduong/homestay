import BookingCard from "components/BookingCard";
import { useState, useEffect } from "react";
import { Card, Container } from "reactstrap";
import { getYourBooking } from "services/booking";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";

function Booking() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        async function getData() {
            setLoading(true)
            const response = await getYourBooking();
            if (response.data) {
                setBookings(response.data.bookings);
            } else {
                dispatch(
                    actions.createAlert({
                        message: "Error occur",
                        type: "error"
                    })
                );
            }
            setLoading(false)
        }
        getData();
    }, []);

    return (
        <>
            <Container>
                <h1>Your booking</h1>
                {loading ? <Loading /> : <Card className="booking-container shadow">
                    {bookings && bookings.map((booking, key) => <div key={key}><BookingCard booking={booking} /></div>
                    )}</Card>}
            </Container>
        </>
    );
}

export default Booking;
