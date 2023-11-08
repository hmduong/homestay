import { useState, useEffect } from "react";
import { getListDiscount } from "services/discount";
import { useCookies } from "react-cookie";
import { Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Modal, Row, Button } from "reactstrap";
import DiscountTicket from "components/DiscountTicket";
import ReactDatetime from "react-datetime";

const Discount = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies([
        "_id",
    ]);
    const [show, setShow] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getListDiscount(cookies._id);
            let discounts = []
            if (data.activeDiscounts && data.inactiveDiscounts) {
                discounts = data.activeDiscounts.concat(data.inactiveDiscounts)
            }
            setData(discounts);
            setLoading(false)
        };
        fetchData();
    }, []);

    const addDiscount = () => {

    }
    return (
        loading ? <div className="loading"></div> :
            <>
                <div className="homestay-head">
                    <h1>Your Discounts</h1>
                    <Button onClick={() => setShow(true)} color="primary" className="add-btn">Create</Button>
                </div>
                <Row>
                    {
                        data ? data.map((discount, index) => <Col key={index} className="mb-5" md="4">
                            <DiscountTicket discount={discount} />
                        </Col>) : <></>
                    }
                    <Col className="mb-5" md="4">
                        <DiscountTicket onClick={() => setShow(true)} />
                    </Col>
                </Row>
                <Modal
                    className="modal-dialog-centered"
                    isOpen={show}
                    toggle={() => setShow(false)}
                >
                    <div className="modal-header">
                        <h6 className="modal-title" id="modal-title-default">
                            Create new discount
                        </h6>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setShow(false)}
                        >
                            <span>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Input
                                        id="exampleFormControlInput1"
                                        placeholder="name@example.com"
                                        type="email"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Input placeholder="Regular" type="text" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-calendar-grid-58" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <ReactDatetime
                                            inputProps={{
                                                placeholder: "Date Picker Here"
                                            }}
                                            timeFormat={false}
                                        />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-calendar-grid-58" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <ReactDatetime
                                            inputProps={{
                                                placeholder: "Date Picker Here"
                                            }}
                                            timeFormat={false}
                                        />
                                    </InputGroup>
                                </FormGroup>
                            </Col>

                        </Row>
                    </div>
                    <div className="modal-footer">
                        <Button
                            color="link"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setShow(false)}
                        >
                            Cancel
                        </Button>
                        <Button color="primary" type="button" className="ml-auto" onClick={addDiscount}>
                            Create
                        </Button>
                    </div>
                </Modal>
            </>
    );
}

export default Discount;





