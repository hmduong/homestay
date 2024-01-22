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
import Paginatior from "components/Paginatior";

const Homestay = () => {
    const { t, i18n } = useTranslation();
    const [rerender, triggerRerender] = useState(false);
    const [homestays, setHomestays] = useState([]);
    const [news, setNews] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(["userid"]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pagiTotal, setPagiTotal] = useState(0)
    const [page, setPage] = useState(1)
    const dispatch = useDispatch();

    const detail = (id) => {
        const url =
            cookies.role === "homestay owner"
                ? `/owner/homestay/${id}`
                : `/homestay/${id}`;
        window.open(url, '_blank')
    };

    const fetchData = async (limit, page) => {
        setLoading(true)
        const data = await getListHomestay(cookies.userid, limit, page);
        if (data.data) {
            setHomestays(data.data.homestays);
            setNews(data.data.bookings);
            setPagiTotal(data.data.totalCount || 0)
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
    };

    const pagiCallback = async (idx) => {
        await fetchData(12, idx)
    }
    useEffect(() => {
        fetchData(12, 1);
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
                    <>
                        <>
                            {homestays.map((homestay, index) => (
                                <Col key={index} className="mb-4" md="3">
                                    <HomestayCard
                                        detail={detail}
                                        newBooking={checkNew(homestay._id)}
                                        homestay={homestay}
                                    />
                                </Col>))}
                        </>
                        <>{homestays.length > 0 && <Paginatior refe="#searchResponse" numOfPage={pagiTotal} pagiCallback={pagiCallback} page={page} />}</>
                    </>
                )
                    : (
                        <></>
                    )}
                {show && <HomestayForm turnOff={() => setShow(false)} triggerRerender={() => triggerRerender(!rerender)} />}
            </Row>}
        </>
    );
};

export default Homestay;
