import BookingListCard from "components/BookingListCard";
import { useState, useEffect } from "react";
import { Card, Col, Container, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { getBookingListByHomestay } from "services/booking";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useTranslation } from "react-i18next";

function BookingList({ homestay }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [bookings, setBookings] = useState([]);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [tabIndex, setTab] = useState(0);
    const [rerender, triggerRerender] = useState(false);
    const [loading, setLoading] = useState(false);
    // const tabs = ['requested', 'accepted', 'stayed', 'declined'];
    const tabs = [
        {
            title: t('requested'),
            value: 'requested',
        },
        {
            title: t('accepted'),
            value: 'accepted',
        },
        {
            title: t('stayed'),
            value: 'stayed',
        },
        {
            title: t('declined'),
            value: 'declined',
        },
    ];
    const getData = async (tab = 0) => {
        setLoading(true)
        let query =
            `${process.env.REACT_APP_API_URL}/bookings/homestay/${homestay._id}?tab=${tabs[tab]?.value}&&username=${name}&&time=${date}`;
        const response = await getBookingListByHomestay(query);
        if (response.status === 200) {
            setBookings(response.data.bookingList);
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
    const switchTab = async (t) => {
        console.log(t)
        setTab(t)
        await getData(t)
    }
    useEffect(() => {
        getData();
    }, [rerender]);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <Container style={{ marginTop: 24 }}>
            <h2>{t('homestay.bookings.title')}</h2>
            <Nav tabs>
                {tabs.map((tab, key) =>
                    <NavItem key={key}>
                        <NavLink
                            className={tabIndex === key ? 'active' : ''}
                            onClick={() => switchTab(key)}
                            style={{ cursor: 'pointer' }}
                        >
                            {capitalizeFirstLetter(tab?.title)}
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
                                        {bookings && bookings.map((booking, index) => <Col md='12' key={index}><BookingListCard booking={booking} triggerRerender={() => triggerRerender(!rerender)} /></Col>
                                        )}
                                    </Row>
                                    : <div className="nodata">{t('noData')}</div>
                                }
                            </Card>
                        </TabPane>
                    )}
                </TabContent>
            }
        </Container>
    );
}

export default BookingList;

