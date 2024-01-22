import BookingCard from "components/BookingCard";
import { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { getYourBooking } from "services/booking";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useTranslation } from "react-i18next";
import Paginatior from "components/Paginatior";

function Booking() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [rerender, triggerRerender] = useState(false);
    const [pagiTotal, setPagiTotal] = useState(0)
    const [page, setPage] = useState(1)
    const getData = async (limit, page) => {
        setLoading(true)
        const response = await getYourBooking(limit, page);
        if (response.data) {
            setBookings(response.data.bookings);
            setPagiTotal(response.data.totalCount || 0)
            setPage(page)
        } else {
            dispatch(
                actions.createAlert({
                    message: t('alert.error'),
                    type: "error"
                })
            );
        }
        setLoading(false)
    }

    const pagiCallback = async (idx) => {
        await getData(10, idx)
    }
    useEffect(() => {
        getData(10, 1);
    }, [rerender]);

    return (
        <>
            <Container>
                <h1>{t('booking.header')}</h1>
                {loading ? <Loading /> : <div className="booking-container">
                    {bookings && bookings.map((booking, key) => <div key={key}><BookingCard indexkey={key} booking={booking} triggerRerender={() => triggerRerender(!rerender)} /></div>
                    )}
                    {bookings && bookings.length > 0 && <Paginatior refe="#searchResponse" numOfPage={pagiTotal} pagiCallback={pagiCallback} page={page} />}
                </div>}
            </Container>
        </>
    );
}

export default Booking;
