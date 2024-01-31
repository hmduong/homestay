
import { Button, Col, Row, FormGroup, Input, Modal } from "reactstrap";
import Map from "components/Map";
import defaultGeo from "utils/geolist";
import validator from "utils/validator";
import { createHomestay } from "services/homestayManagementService";
import { multipleFilesUpload } from "utils/request";
import { useState } from "react";
import { editHomestay } from "services/homestayManagementService";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useTranslation } from "react-i18next";
import attributes from "utils/attributes";

const HomestayForm = ({ turnOff, triggerRerender, editPayload }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const defaultForm = {
        name: editPayload ? editPayload.name : "",
        address: editPayload ? editPayload.address : "",
        city: editPayload ? editPayload.city : defaultGeo.geoList[0],
        price: editPayload ? editPayload.price : 0,
        people: editPayload ? editPayload.people : 0,
        description: editPayload ? editPayload.description : "",
        attributes: editPayload ? editPayload.attributes : [],
        longitude: editPayload ? editPayload.longitude : defaultGeo.geoMap.get("Ha Noi")[0],
        latitude: editPayload ? editPayload.latitude : defaultGeo.geoMap.get("Ha Noi")[1],
    };
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState(null);
    const [form, setForm] = useState({ ...defaultForm });
    const [validateErr, setValidateErr] = useState({});
    const [ani, toggleAni] = useState(false);
    const [mapCoor, setMapCoor] = useState({
        lng: editPayload ? editPayload.longitude : defaultGeo.geoMap.get("Ha Noi")[0],
        lat: editPayload ? editPayload.latitude : defaultGeo.geoMap.get("Ha Noi")[1],
        zoom: [13],
    });
    const checkAttrs = (value, attr) => {
        if (value) {
            if (!form.attributes.includes(attr)) form.attributes.push(attr)
        } else {
            if (form.attributes.includes(attr)) {
                let ind = form.attributes.indexOf(attr);
                if (ind !== -1) {
                    form.attributes.splice(ind, 1);
                }
            }
        }
    }
    const addHomestay = async () => {
        form.longitude = mapCoor.lng;
        form.latitude = mapCoor.lat;
        const thef = { ...form }
        if (!editPayload) {
            thef.files = { ...files }
        }
        const err = validator(
            thef,
            {
                empty: (v) => {
                    return !v ? "wut???" : null
                },
                image: (v) => {
                    if (!Array.from(v).every(el => el.size < (1024 * 1024))) {
                        dispatch(
                            actions.createAlert({
                                message: "Invalid image! file > 1MB.",
                                type: "error"
                            })
                        );
                    };
                    return Array.from(v).every(el => el.size < (1024 * 1024)) ? null : "bro"
                },
                files: (v) => {
                    return Object.keys(v).length !== 3 ? "whut" : null
                }
            },
            {
                attributes: ["empty", "image", "files"],
                name: ["image", "files"],
                address: ["image", "files"],
                city: ["image", "files"],
                price: ["image", "files"],
                people: ["image", "files"],
                description: ["image", "files"],
                longitude: ["image", "files"],
                latitude: ["image", "files"],
            }
        );
        if (!err) {
            setLoading(true)
            const res = editPayload ? await editHomestay(editPayload._id, form) : await createHomestay(form);
            if (res.status < 299) {
                dispatch(
                    actions.createAlert({
                        message: editPayload ? t('alert.editedHomestay') : t('alert.createdHomestay'),
                        type: "success"
                    })
                );
                await saveImages(res.data._id);
                turnOff();
                setForm({ ...defaultForm });
                triggerRerender();
            } else {
                dispatch(
                    actions.createAlert({
                        message: t('alert.error'),
                        type: "error"
                    })
                );
            }
            setValidateErr({});
            setLoading(false)
        } else {
            setValidateErr(err);
            toggleAni(!ani);
        }
    };
    const saveImages = async (id) => {
        const formData = new FormData();
        if (files && files.length)
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }
        const url = process.env.REACT_APP_API_URL + "/homestays/" + id;
        const res = await multipleFilesUpload(url, formData);
        if (res.status >= 400 || !res) console.log("err");
    };
    return (
        <Modal
            className="modal-dialog-centered"
            isOpen={true}
            toggle={() => {
                turnOff();
                setValidateErr({});
                setForm({ ...defaultForm });
            }}
        >
            {loading ? <Loading /> : <>
                <div className="modal-header">
                    <h4
                        className="modal-title"
                        style={{ fontWeight: "700" }}
                        id="modal-title-default"
                    >
                        {editPayload ? t('homestay.slug.edit') : t('homestay.slug.create')}
                    </h4>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => {
                            turnOff();
                            setValidateErr({});
                            setForm({ ...defaultForm });
                        }}
                    >
                        <span>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <p
                                    className={`input-label ${validateErr.name ? (ani ? "err1" : "err2") : ""
                                        }`}
                                >
                                    {t('name')}
                                </p>
                                <Input
                                    type="text"
                                    defaultValue={editPayload ? editPayload.name : ''}
                                    onChange={(e) => (form.name = e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <p
                                    className={`input-label ${validateErr.city ? (ani ? "err1" : "err2") : ""
                                        }`}
                                >
                                    {t('city')}
                                </p>
                                <Input
                                    type="select"
                                    defaultValue={editPayload ? editPayload.name : 0}
                                    onChange={(e) => {
                                        form.city = defaultGeo.geoList[e.target.selectedIndex];
                                        setMapCoor({
                                            lng: defaultGeo.geoMap.get(e.target.value)[0],
                                            lat: defaultGeo.geoMap.get(e.target.value)[1],
                                            zoom: mapCoor.zoom,
                                        });
                                    }}
                                >
                                    <option value="Ha Noi">{t('search.address.hanoi')}</option>
                                    <option value="Da Nang">{t('search.address.danang')}</option>
                                    <option value="Ho Chi Minh">{t('search.address.hochiminh')}</option>
                                    <option value="Hue">{t('search.address.hue')}</option>
                                    <option value="Can Tho">{t('search.address.cantho')}</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <p
                                    className={`input-label ${validateErr.price ? (ani ? "err1" : "err2") : ""
                                        }`}
                                >
                                    {t('price')}
                                </p>
                                <Input
                                    type="number"
                                    defaultValue={editPayload ? editPayload.price : null}
                                    onChange={(e) => (form.price = e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <p
                                    className={`input-label ${validateErr.people ? (ani ? "err1" : "err2") : ""
                                        }`}
                                >
                                    {t('slot')}
                                </p>
                                <Input
                                    type="number"
                                    defaultValue={editPayload ? editPayload.people : null}
                                    onChange={(e) => (form.people = e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup style={{ position: 'relative' }}>
                                <p className={`input-label ${!editPayload && (validateErr.files ? (ani ? "err1" : "err2") : "")}`}>{t('images')} (3 files)</p>
                                <Input
                                    disabled={editPayload ? true : false}
                                    className="img-input form-control"
                                    type="file"
                                    accept=".jpg,.png"
                                    multiple
                                    onChange={(e) => setFiles(e.target.files)}
                                />
                                {files && files.length ? <div className="img-input-mask">{files.length} file</div> : <div className="img-input-mask">Upload file</div>}
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <p className={`input-label ${validateErr.address ? (ani ? "err1" : "err2") : ""}`}>
                                    {t('address')}
                                </p>
                                <Input
                                    type="text"
                                    defaultValue={editPayload ? editPayload.address : ''}
                                    onChange={(e) => (form.address = e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        {attributes.map((el, key) => <Col xs="3" key={key}>
                            <div className="custom-control custom-control-alternative custom-checkbox mb-3">
                                <input
                                    className="custom-control-input"
                                    id={`customCheckLeft${key}`}
                                    type="checkbox"
                                    defaultChecked={form.attributes.includes(el)}
                                    onChange={(e) => checkAttrs(e.target.checked, el)}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor={`customCheckLeft${key}`}
                                >
                                    <span>{t(`attrs${key}`)}</span>
                                </label>
                            </div>
                        </Col>)}
                        <Col md="12">
                            <FormGroup>
                                <p
                                    className={`input-label ${validateErr.description ? (ani ? "err1" : "err2") : ""
                                        }`}
                                >
                                    {t('description')}
                                </p>
                                <Input
                                    type="textarea"
                                    defaultValue={editPayload ? editPayload.description : ''}
                                    onChange={(e) => (form.description = e.target.value)}
                                />
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
                            turnOff();
                            setValidateErr({});
                            setForm({ ...defaultForm });
                        }}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        color="primary"
                        type="button"
                        className="ml-auto"
                        onClick={addHomestay}
                    >
                        {t('ok')}
                    </Button>
                </div>
            </>}
        </Modal>
    )
}

export default HomestayForm