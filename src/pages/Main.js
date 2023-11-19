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

const Main = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["role"]);
    const [checkin, setCheckin] = useState(null);
    const [checkout, setCheckout] = useState(null);
    const [city, setCity] = useState("Ha Noi");
    const [price, setPrice] = useState(5000000);
    const [homestays, setHomestays] = useState([]);

    const searchHandler = async () => {
        const data = {
            city,
            checkin,
            checkout,
            price
        };
        const response = await search(data);
        if (response.status >= 400) {
            return;
        }
        if (response.data.homestays) {
            setHomestays(response.data.homestays);
        }
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
                    <Col md="3">
                        <FormGroup>
                            <p className="input-label">City</p>
                            <Input
                                type="select"
                                onChange={(e) =>
                                    setCity(defaultGeo.geoList[e.target.selectedIndex])
                                }
                            >
                                <option value="Ha Noi">Ha Noi</option>
                                <option value="Ho Chi Minh">Ho Chi Minh</option>
                                <option value="Da Nang">Da Nang</option>
                                <option value="Hue">Hue</option>
                                <option value="Can Tho">Can Tho</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md="3">
                        <FormGroup>
                            <p className="input-label">Price</p>
                            <Input
                                type="select"
                                onChange={(e) =>
                                    setPrice((e.target.selectedIndex + 1) * 1000000)
                                }
                            >
                                <option value="5000000">5000000</option>
                                <option value="4000000">4000000</option>
                                <option value="3000000">3000000</option>
                                <option value="2000000">2000000</option>
                                <option value="1000000">1000000</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md="3">
                        <FormGroup>
                            <p className="input-label">Check in</p>
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
                            <p className="input-label">Check out</p>
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
                <Row>
                    {homestays ? (
                        homestays.map((homestay, index) => (
                            <Col key={index} className="mb-4" md="4">
                                <HomestayCard homestay={homestay} />
                            </Col>
                        ))
                    ) : (
                        <></>
                    )}
                </Row>
            </div>
        );
    }
};
export default Main;
