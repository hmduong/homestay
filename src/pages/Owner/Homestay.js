import React, { useState, useEffect } from "react";
import { getListHomestay } from "services/homestayManagementService";
import { useCookies } from "react-cookie";
import { Button, Col, Row, FormGroup, Input, Modal } from "reactstrap";
import HomestayCard from "components/HomestayCard";
import Map from "components/Map"
import defaultGeo from 'utils/geolist';
import validator from 'utils/validator';
import { createHomestay } from 'services/homestayManagementService';
import { multipleFilesUpload } from 'utils/request';

const Homestay = () => {
    const defaultForm = {
        name: '',
        address: '',
        city: defaultGeo.geoList[0],
        price: 0,
        people: 0,
        description: '',
        pool: false,
        longitude: defaultGeo.geoMap.get('Ha Noi')[0],
        latitude: defaultGeo.geoMap.get('Ha Noi')[1],
    }
    const [rerender, triggerRerender] = useState(false)
    const [data, setData] = useState({});
    const [cookies, setCookie, removeCookie] = useCookies([
        "_id",
    ]);
    const [ani, toggleAni] = useState(false)
    const [validateErr, setValidateErr] = useState({})
    const [show, setShow] = useState(false)
    const [files, setFiles] = useState(null);
    const [form, setForm] = useState({ ...defaultForm })
    const [mapCoor, setMapCoor] = useState({
        lng: defaultGeo.geoMap.get('Ha Noi')[0],
        lat: defaultGeo.geoMap.get('Ha Noi')[1],
        zoom: [13]
    })

    useEffect(() => {
        const fetchData = async () => {
            const data = await getListHomestay(cookies._id);
            setData(data.data);
        };
        fetchData();
    }, [rerender]);
    const saveImage = async (id) => {
        const formData = new FormData();
        if (files && files.length) for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        const url = process.env.REACT_APP_BACK_END + "/homestays/" + id;
        const res = await multipleFilesUpload(url, formData);
        if (res.status >= 400 || !res) console.log("err");
    }
    const addHomestay = async () => {
        form.longitude = mapCoor.lng;
        form.latitude = mapCoor.lat;
        const err = validator(form, { empty: (v) => !v ? 'wut???' : null }, { pool: ['empty'] })
        if (!err) {
            const res = await createHomestay(form);
            if (res.status < 299) {
                await saveImage(res.data._id)
                setShow(false)
                setValidateErr({})
                setForm({ ...defaultForm })
                triggerRerender(!rerender)
            }
            setValidateErr({})
        } else {
            setValidateErr(err);
            toggleAni(!ani)
        }
    }
    return (
        <>
            <div className="homestay-head">
                <h1>Your Homestays</h1>
                <Button onClick={() => setShow(true)} color="primary" className="add-btn">Create</Button>
            </div>
            <Row>
                {
                    data.homestays ? data.homestays.map((homestay, index) => <Col key={index} className="mb-4" md="3">
                        <HomestayCard homestay={homestay} />
                    </Col>) : <></>
                }
                <Col className="mb-4" md="3">
                    <HomestayCard onClick={() => setShow(true)} />
                </Col>
            </Row><Modal
                className="modal-dialog-centered"
                isOpen={show}
                toggle={() => {
                    setShow(false)
                    setValidateErr({})
                    setForm({ ...defaultForm })
                }}
            >
                <div className="modal-header">
                    <h4 className="modal-title" style={{ fontWeight: '700' }} id="modal-title-default">
                        Create new discount
                    </h4>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => {

                            setShow(false)
                            setValidateErr({})
                            setForm({ ...defaultForm })
                        }}
                    >
                        <span>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <p className={`input-label ${validateErr.name ? (ani ? 'err1' : 'err2') : ''}`} >Name</p>
                                <Input type="text" onChange={e => form.name = e.target.value} />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <p className={`input-label ${validateErr.city ? (ani ? 'err1' : 'err2') : ''}`} >City</p>
                                <Input
                                    type="select"
                                    onChange={e => {
                                        form.city = defaultGeo.geoList[e.target.selectedIndex];
                                        setMapCoor({
                                            lng: defaultGeo.geoMap.get(e.target.value)[0],
                                            lat: defaultGeo.geoMap.get(e.target.value)[1],
                                            zoom: mapCoor.zoom
                                        })
                                    }}
                                >
                                    <option value="Ha Noi">
                                        Ha Noi
                                    </option>
                                    <option value="Ho Chi Minh">
                                        Ho Chi Minh
                                    </option>
                                    <option value="Da Nang">
                                        Da Nang
                                    </option>
                                    <option value="Hue">
                                        Hue
                                    </option>
                                    <option value="Can Tho">
                                        Can Tho
                                    </option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <p className={`input-label ${validateErr.price ? (ani ? 'err1' : 'err2') : ''}`} >Price</p>
                                <Input type="number" onChange={e => form.price = e.target.value} />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <p className={`input-label ${validateErr.people ? (ani ? 'err1' : 'err2') : ''}`} >People</p>
                                <Input type="number" onChange={e => form.people = e.target.value} />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <p className={`input-label`} >Images</p>
                                <Input type="file" accept=".jpg,.png" multiple onChange={e => setFiles(e.target.files)} />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <p className={`input-label ${validateErr.address ? (ani ? 'err1' : 'err2') : ''}`} >Address</p>
                                <Input type="text" onChange={e => form.address = e.target.value} />
                            </FormGroup>
                        </Col>
                        <Col xs="12">
                            <div className="custom-control custom-control-alternative custom-checkbox mb-3">
                                <input
                                    className="custom-control-input"
                                    id="customCheckLeft"
                                    type="checkbox"
                                    onChange={e => form.pool = e.target.checked}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor="customCheckLeft"
                                >
                                    <span>
                                        Pool
                                    </span>
                                </label>
                            </div>
                        </Col>
                        <Col md="12">
                            <FormGroup>
                                <p className={`input-label ${validateErr.description ? (ani ? 'err1' : 'err2') : ''}`} >Description</p>
                                <Input type="textarea" onChange={e => form.description = e.target.value} />
                            </FormGroup>
                        </Col>
                        <Col md="12">
                            <Map coor={mapCoor} onChange={setMapCoor} />
                        </Col>

                    </Row>
                </div>
                <div className="modal-footer">
                    <Button
                        color="link"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => {
                            setShow(false)
                            setValidateErr({})
                            setForm({ ...defaultForm })
                        }}
                    >
                        Cancel
                    </Button>
                    <Button color="primary" type="button" className="ml-auto" onClick={addHomestay}>
                        Create
                    </Button>
                </div>
            </Modal>
        </>
    );
}

export default Homestay;





