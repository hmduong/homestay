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
import { getTop } from "services/homestayManagementService";
import { useTranslation } from 'react-i18next';

const Main = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["role"]);
    const [checkin, setCheckin] = useState(null);
    const [checkout, setCheckout] = useState(null);
    const [city, setCity] = useState("");
    const [price, setPrice] = useState(null);
    const [homestays, setHomestays] = useState([]);
    const [topHomestays, setTopHomestays] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingTop, setLoadingTop] = useState(false);
    const dispatch = useDispatch();
    const prices = [1000000, 2000000, 3000000, 4000000, 5000000]
    const { t, i18n } = useTranslation();
    const dateOnChange = async (date, isCheckin) => {
        if (date) {
            if (isCheckin) {
                if (checkout && date > checkout) {
                    setCheckin(checkout)
                    dispatch(
                        actions.createAlert({
                            message: 'Invalid checkin!',
                            type: "error",
                        })
                    );
                } else {
                    setCheckin(date)
                }
            } else {
                if (checkin && date < checkin) {
                    setCheckout(checkin)
                    dispatch(
                        actions.createAlert({
                            message: 'Invalid checkout!',
                            type: "error",
                        })
                    );
                } else {
                    setCheckout(date)
                }
            }
        }
    }

    const detail = (id) => {
        const url =
            cookies.role === "homestay owner"
                ? `/owner/homestay/${id}`
                : `/homestay/${id}`;
        window.open(url, '_blank')
    };

    const priceChange = (newPrice) => {
        if (newPrice) setPrice(prices[newPrice - 1]);
        else setPrice("")
    }

    const cityChange = (newCity) => {
        if (newCity) setCity(defaultGeo.geoList[newCity - 1]);
        else setCity("")
    }

    const topHandler = async () => {
        setLoadingSearch(true)
        const response = await getTop({ limit: 6 });
        if (response.data.homestays) {
            setTopHomestays(response.data.homestays);
        }
        else {
            dispatch(
                actions.createAlert({
                    message: "Error occur",
                    type: "error"
                })
            );
        }
        setLoadingSearch(false)
    };

    const searchHandler = async () => {
        const data = {
            city,
            checkin,
            checkout,
            price: price || 0
        };
        setLoadingTop(true)
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
        setLoadingTop(false)
    };

    useEffect(() => {
        topHandler()
    }, [])

    useEffect(() => {
        if (checkin || checkout || city || price) searchHandler(); else setHomestays([])
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
                                    value={checkin}
                                    onChange={(e) => dateOnChange(formatDate(e._d), true)}
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
                                    value={checkout}
                                    onChange={(e) => dateOnChange(formatDate(e._d), false)}
                                    inputProps={{
                                        placeholder: "mm/dd/yyyy",
                                    }}
                                    timeFormat={false}
                                />
                            </InputGroup>
                        </FormGroup>
                    </Col>
                </Row>
                {loadingSearch ? <Loading /> : <Row>
                    {homestays && (
                        homestays.map((homestay, index) => (
                            <Col key={index} className="mb-4" md="4">
                                <HomestayCard detail={detail} homestay={homestay} />
                            </Col>
                        ))
                    )}
                </Row>}
                <Row>
                    <Col md={12} className="main-page-header">
                        <i className="fa fa-home" aria-hidden="true"></i>
                        <h2>{t('topHomestay')}</h2>
                    </Col>
                </Row>
                {loadingTop ? <Loading /> :
                    <Row className="mt-4">
                        {topHomestays && topHomestays.map((homestay, index) => (
                            <Col key={index} className="mb-4" md="4">
                                <HomestayCard detail={detail} homestay={homestay} />
                            </Col>
                        ))}
                    </Row>}
            </div>
        );
    }
};
export default Main;
