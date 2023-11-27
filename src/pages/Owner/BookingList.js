import BookingListCard from "components/BookingListCard";
import { useState, useEffect } from "react";
import { Card, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { getBookingListByHomestay } from "services/booking";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";

function BookingList({ homestay }) {
    const dispatch = useDispatch();
    const [bookings, setBookings] = useState([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [tabIndex, setTab] = useState(0);
    const [rerender, triggerRerender] = useState(false);
    const [loading, setLoading] = useState(false);
    const tabs = ['requested', 'accepted', 'stayed', 'declined']
    const getData = async (tab = 0) => {
        setLoading(true)
        let query =
            `${process.env.REACT_APP_API_URL}/bookings/homestay/${homestay._id}?tab=${tabs[tab]}&&username=${name}&&time=${date}`;
        const response = await getBookingListByHomestay(query);
        if (response.status === 200) {
            setBookings(response.data.bookingList);
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
    const switchTab = async (t) => {
        setTab(t)
        await getData(t)
    }
    useEffect(() => {
        getData();
    }, [rerender]);

    return (
        <>
            {loading ? <Loading /> : <Container style={{ minHeight: '300px', marginTop: 24 }}>
                <h2>Bookings</h2>
                <Nav tabs>
                    {tabs.map((tab, key) =>
                        <NavItem key={key}>
                            <NavLink
                                className={tabIndex === key ? 'active' : ''}
                                onClick={() => switchTab(key)}
                                style={{ cursor: 'pointer' }}
                            >
                                {tab}
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>
                {bookings && bookings.length > 0 ? <TabContent activeTab={tabIndex}>
                    {tabs.map((tab, key) =>
                        <TabPane tabId={key} key={key}>
                            <Card className="booking-container shadow">
                                <Row>
                                    {bookings && bookings.map((booking, index) => <Col md='6' key={index}><BookingListCard booking={booking} triggerRerender={() => triggerRerender(!rerender)} /></Col>
                                    )}
                                </Row>
                            </Card>
                        </TabPane>
                    )}
                </TabContent>
                    : <div>No data</div>}
            </Container>}
        </>
    );
}

export default BookingList;

