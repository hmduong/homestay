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
import Paginatior from "components/Paginatior";
import attributes from "utils/attributes";

const Main = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["role"]);
    const [checkin, setCheckin] = useState(null);
    const [checkout, setCheckout] = useState(null);
    const [city, setCity] = useState("");
    const [people, setPeople] = useState(null);
    const [homestays, setHomestays] = useState([]);
    const [topHomestays, setTopHomestays] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [pagiTotal, setPagiTotal] = useState(0)
    const [page, setPage] = useState(0)
    const [loadingTop, setLoadingTop] = useState(false);
    const [rerender, triggerRerender] = useState(false);
    const [minPrice, setMin] = useState(null);
    const [maxPrice, setMax] = useState(200000);
    const dispatch = useDispatch();
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
    const [searchAttr, setS] = useState([])
    const checkAttrs = (value, attr) => {
        if (value) {
            if (!searchAttr.includes(attr)) searchAttr.push(attr)
        } else {
            if (searchAttr.includes(attr)) {
                let ind = searchAttr.indexOf(attr);
                if (ind !== -1) {
                    searchAttr.splice(ind, 1);
                }
            }
        }
        setS(searchAttr)
        console.log(searchAttr);
        triggerRerender(!rerender)
    }

    const detail = (id) => {
        const url =
            cookies.role === "homestay owner"
                ? `/owner/homestay/${id}`
                : `/homestay/${id}`;
        window.open(url, '_blank')
    };

    const setMinPrice = (price) => {
        if (!maxPrice || maxPrice > price) {
            setMin(price)
        }
    };

    const setMaxPrice = (price) => {
        if (!minPrice || minPrice < price) {
            setMax(price)
        }
    };

    const changePrice = (priceType) => {
        const cases = [[null, 200000], [200001, 500000], [500001, 1000000], [1000001, null]]
        setMin(cases[priceType - 1][0])
        setMax(cases[priceType - 1][1])
    };

    const cityChange = (newCity) => {
        if (newCity) setCity(defaultGeo.geoList[newCity - 1]);
        else setCity("")
    }

    const topHandler = async () => {
        setLoadingTop(true)
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
        setLoadingTop(false)
    };

    const searchHandler = async (pagi) => {
        const data = {
            city,
            checkin,
            checkout,
            people,
        };
        if (minPrice) data.minPrice = minPrice
        if (maxPrice) data.maxPrice = maxPrice
        if (searchAttr.length) data.attributes = searchAttr
        setLoadingSearch(true)
        const response = await search(data, pagi);
        if (response.status < 299) {
            setHomestays(response.data.homestays);
            setPagiTotal(response.data.totalCount || 0)
            setPage(pagi.page)
        } else {
            dispatch(
                actions.createAlert({
                    message: t('alert.error'),
                    type: "error"
                })
            );
        }
        setLoadingSearch(false)
    };

    const pagiCallback = async (idx) => {
        await searchHandler({ limit: 3, page: idx })
    }

    useEffect(() => {
        topHandler()
    }, [])

    useEffect(() => {
        if ((checkin && checkout) || city || people) searchHandler({ limit: 3, page: 1 }); else setHomestays([])
    }, [(checkin && checkout), city, people, rerender, minPrice, maxPrice]);

    if (cookies.role === "homestay owner") {
        return <Navigate to="/owner" />;
    } else {
        return (
            <div className="main-page">
                <Row className="main-filter" id="searchResponse">
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
                            <p className="input-label">{t('people')}</p>
                            <Input
                                placeholder={t('search.people')}
                                type="number"
                                value={people}
                                onChange={(e) => setPeople(e.target.value)}
                            >
                            </Input>
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
                {((checkin && checkout) || city || people) &&
                    <>
                        <Row>
                            <Col md={4}>
                                <FormGroup>
                                    <p
                                        className={`input-label`}
                                        style={{ color: '#fff' }}
                                    >
                                        {t('price')}
                                    </p>
                                    <Input
                                        type="select"
                                        onChange={(e) => changePrice(e.target.value)}
                                    >
                                        <option value="1"> {'< 200000'}</option>
                                        <option value="2">{'200000 - 500000'}</option>
                                        <option value="3">{'500000 - 1000000'}</option>
                                        <option value="4">{'> 1000000'}</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={8}>
                                <Row>
                                    {attributes.map((el, key) => <Col md='4' key={key}>
                                        <div className="custom-control custom-control-alternative custom-checkbox mb-3">
                                            <input
                                                className="custom-control-input"
                                                id={`customCheckLeft${key}`}
                                                type="checkbox"
                                                checked={searchAttr.includes(el)}
                                                onChange={(e) => checkAttrs(e.target.checked, el)}
                                            />
                                            <label
                                                style={{ color: '#fff' }}
                                                className="custom-control-label"
                                                htmlFor={`customCheckLeft${key}`}
                                            >
                                                <span>{t(`attrs${key}`)}</span>
                                            </label>
                                        </div>
                                    </Col>)}
                                </Row>
                            </Col>
                        </Row>
                    </>
                }
                {loadingSearch ? <Loading /> :
                    <>
                        {homestays && (
                            <>
                                <Row>{homestays.map((homestay, index) => (
                                    <Col key={index} className="mb-4" md="4">
                                        <HomestayCard detail={detail} homestay={homestay} />
                                    </Col>
                                ))}
                                    {homestays.length > 0 && <Paginatior refe="#searchResponse" numOfPage={pagiTotal} pagiCallback={pagiCallback} page={page} />}
                                </Row>
                            </>
                        )}
                    </>
                }
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
