import React, { useState, useEffect } from "react";
import { getListHomestay } from "services/homestayManagementService";
import { useCookies } from "react-cookie";
import { Button, Col, Row } from "reactstrap";
import HomestayCard from "components/HomestayCard";
import HomestayForm from "components/HomestayForm";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const Homestay = () => {
    const { t, i18n } = useTranslation();
    const [rerender, triggerRerender] = useState(false);
    const [homestays, setHomestays] = useState([]);
    const [news, setNews] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["userid"]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const data = await getListHomestay(cookies.userid);
            if (data.data) {
                setHomestays(data.data.homestays);
                setNews(data.data.bookings);
            } else {
                dispatch(
                    actions.createAlert({
                        message: "Error occur",
                        type: "error"
                    })
                );
            }
            setLoading(false)
        };
        fetchData();
    }, [rerender]);
    const checkNew = (id) => {
        const found = news.find((newId) => newId === id);
        return found ? true : false;
    };
    return (
        <>
            <div className="homestay-head">
                <h1>{t('homestay.header')}</h1>
                <Button
                    onClick={() => setShow(true)}
                    color="primary"
                    className="add-btn"
                >
                    {t('create')}
                </Button>
            </div>
            {loading ? <Loading /> : <Row>
                {homestays ? (
                    homestays.map((homestay, index) => (
                        <Col key={index} className="mb-4" md="3">
                            <HomestayCard
                                newBooking={checkNew(homestay._id)}
                                homestay={homestay}
                            />
                        </Col>
                    ))
                ) : (
                    <></>
                )}
                <Col className="mb-4" md="3">
                    <HomestayCard onClick={() => setShow(true)} />
                    {show && <HomestayForm turnOff={() => setShow(false)} triggerRerender={() => triggerRerender(!rerender)} />}
                </Col>
            </Row>}
        </>
    );
};

export default Homestay;
