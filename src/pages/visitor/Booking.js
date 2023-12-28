import BookingCard from "components/BookingCard";
import { useState, useEffect } from "react";
import { Card, CardHeader, NavLink, Container, Nav, NavItem, TabContent, TabPane } from "reactstrap";
import { getYourBooking } from "services/booking";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";

function Booking() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [rerender, triggerRerender] = useState(false);
    useEffect(() => {
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
    }, [rerender]);

    return (
        <>
            <Container>
                <h1>Your booking</h1>
                {loading ? <Loading /> : <div className="booking-container">
                    {bookings && bookings.map((booking, key) => <div key={key}><BookingCard indexkey={key} booking={booking} triggerRerender={() => triggerRerender(!rerender)} /></div>
                    )}
                </div>}
            </Container>
        </>
    );
}

export default Booking;
