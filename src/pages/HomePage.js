import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import {
    Col,
    Row,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
} from "reactstrap";
import HomestayCard from "components/HomestayCard";
import { useEffect } from "react";
import { useState } from "react";
import { search } from "services/booking";
import defaultGeo from "utils/geolist";
import ReactDatetime from "react-datetime";
import { formatDate } from "utils/date";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useTranslation } from 'react-i18next';

const Main = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["role"]);
    const [checkin, setCheckin] = useState(null);
    const [checkout, setCheckout] = useState(null);
    const [city, setCity] = useState("");
    const [price, setPrice] = useState(null);
    const [homestays, setHomestays] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const prices = [1000000, 2000000, 3000000, 4000000, 5000000]
    const { t, i18n } = useTranslation();

    const priceChange = (newPrice) => {
        if (newPrice) setPrice(prices[newPrice - 1]);
        else setPrice("")
    }

    const cityChange = (newCity) => {
        if (newCity) setCity(defaultGeo.geoList[newCity - 1]);
        else setCity("")
    }

    const searchHandler = async () => {
        const data = {
            city,
            checkin,
            checkout,
            price: price || 0
        };
        setLoading(true)
        const response = await search(data);
        if (response.status < 299) {
            setHomestays(response.data.homestays);
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

    useEffect(() => {
        searchHandler();
    }, [checkin, checkout, city, price]);

    if (cookies.role === "homestay owner") {
        return <Navigate to="/owner" />;
    } else {
        return (
            <div className="main-page">
                <Row className="main-filter">
                    <Col md={12} className="main-page-header">
                        <i className="fa fa-home" aria-hidden="true"></i>
                        <h2>{t('search.title')}</h2>
                    </Col>
                    <Col md="3">
                        <FormGroup style={{ position: 'relative' }}>
                            <p className="input-label">{t('city')}</p>
                            <Input
                                placeholder={t('search.selectCity')}
                                className="main-filter-select"
                                type="text"
                                value={city}
                            ></Input>
                            <Input
                                className="main-filter-select-dropdown"
                                type="select"
                                onChange={(e) => cityChange(e.target.selectedIndex)}
                            >
                                <option
                                    style={{ display: "none" }}
                                    value={""}
                                ></option>
                                <option value="Ha Noi">{t('search.address.hanoi')}</option>
                                <option value="Da Nang">{t('search.address.danang')}</option>
                                <option value="Ho Chi Minh">{t('search.address.hochiminh')}</option>
                                <option value="Hue">{t('search.address.hue')}</option>
                                <option value="Can Tho">{t('search.address.cantho')}</option>
                            </Input>
                            {city && (
                                <div
                                    className="main-select-clear"
                                    onClick={() => cityChange(0)}
                                >
                                    <i
                                        className="fa fa-times"
                                        aria-hidden="true"
                                    ></i>
                                </div>
                            )}
                        </FormGroup>
                    </Col>
                    <Col md="3">
                        <FormGroup style={{ position: 'relative' }}>
                            <p className="input-label">{t('price')}</p>
                            <Input
                                placeholder={t('search.priceHolder')}
                                className="main-filter-select"
                                type="text"
                                value={price}
                            ></Input>
                            <Input
                                className="main-filter-select-dropdown"
                                type="select"
                                onChange={(e) => priceChange(e.target.selectedIndex)}
                            >
                                <option
                                    style={{ display: "none" }}
                                    value={null}
                                ></option>
                                {prices.map((price, index) => (
                                    <option key={index} value={price}>
                                        {price}
                                    </option>
                                ))}
                            </Input>
                            {price != 0 && price != null && (
                                <div
                                    className="main-select-clear"
                                    onClick={() => priceChange(null)}
                                >
                                    <i
                                        className="fa fa-times"
                                        aria-hidden="true"
                                    ></i>
                                </div>
                            )}
                        </FormGroup>
                    </Col>
                    <Col md="3">
                        <FormGroup>
                            <p className="input-label">{t('checkin')}</p>
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-calendar-grid-58" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <ReactDatetime
                                    onChange={(e) => setCheckin(formatDate(e._d))}
                                    inputProps={{
                                        placeholder: "mm/dd/yyyy",
                                    }}
                                    timeFormat={false}
                                />
                            </InputGroup>
                        </FormGroup>
                    </Col>
                    <Col md="3">
                        <FormGroup>
                            <p className="input-label">{t('checkout')}</p>
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-calendar-grid-58" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <ReactDatetime
                                    onChange={(e) => setCheckout(formatDate(e._d))}
                                    inputProps={{
                                        placeholder: "mm/dd/yyyy",
                                    }}
                                    timeFormat={false}
                                />
                            </InputGroup>
                        </FormGroup>
                    </Col>
                </Row>
                {loading ? <Loading /> : <Row>
                    {homestays ? (
                        homestays.map((homestay, index) => (
                            <Col key={index} className="mb-4" md="4">
                                <HomestayCard homestay={homestay} />
                            </Col>
                        ))
                    ) : (
                        <></>
                    )}
                </Row>}
                <Row>
                    <Col md={12} className="main-page-header">
                        <i className="fa fa-home" aria-hidden="true"></i>
                        <h2>{t('topHomestay')}</h2>
                    </Col>
                    <Col md={12}>
                        {t('topHomestay')}
                    </Col>
                </Row>
            </div>
        );
    }
};
export default Main;
