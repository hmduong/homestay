import BookingListCard from "components/BookingListCard";
import { useState, useEffect } from "react";
import { Card, Col, Container, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
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
        <><Container style={{ minHeight: '300px', marginTop: 24 }}>
            <h2>Bookings</h2>
            <Row className="mb-3">
                <Col md='6'>
                    <p className="mb-0">User name</p>
                    <Input
                        className="input-text"
                        placeholder="Aa"
                        type="text"
                    />
                </Col>
                <Col md='6'>
                    <p className="mb-0">Time</p>
                    <Input
                        className="input-text"
                        placeholder="Aa"
                        type="select"
                    >
                        <option>All</option>
                        <option>This week</option>
                        <option>This month</option>
                    </Input>
                </Col>
            </Row>
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

            {loading ? <Loading /> :
                <TabContent activeTab={tabIndex}>
                    {tabs.map((tab, key) =>
                        <TabPane tabId={key} key={key}>
                            <Card className="booking-container shadow">
                                {bookings && bookings.length > 0 ?
                                    <Row>
                                        {bookings && bookings.map((booking, index) => <Col md='6' key={index}><BookingListCard booking={booking} triggerRerender={() => triggerRerender(!rerender)} /></Col>
                                        )}
                                    </Row>
                                    : <div>No data</div>
                                }
                            </Card>
                        </TabPane>
                    )}
                </TabContent>
            }
        </Container>
        </>
    );
}

export default BookingList;

