import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Col,
    Container,
    FormGroup,
    Modal,
    Row,
    Input,
    UncontrolledTooltip
} from "reactstrap";
import { getHomestay } from "services/homestayManagementService";
import Statistics from "pages/Owner/Statistics";
import BookingList from "pages/Owner/BookingList";
import Review from "pages/Owner/Review";
import { useCookies } from "react-cookie";
import Loading from "components/Loading";
import DetailHomestay from "pages/DetailHomestay";
import { deleteHomestay } from "services/homestayManagementService";
import { useTranslation } from "react-i18next";
import HomestayForm from "components/HomestayForm";
import validator from "utils/validator";
import { createService } from "services/serviceManagement";
import HomestayCard from "components/HomestayCard";
import { getSuggest } from "services/homestayManagementService";
import { putAsyncWithToken } from "utils/request";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import { putMultipleFilesUpload } from "utils/request";

const HomestaySlug = () => {
    const { t, i18n } = useTranslation();
    const [cookies, setCookie, removeCookie] = useCookies(["role", "userid"]);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [rerender, triggerRerender] = useState(false);
    const [thisHomestay, setThisHomestay] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [IsOpenDelete, setIsOpenDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [isOpenService, setIsOpenService] = useState(false);
    const [validateErrService, setValidateErrService] = useState({});
    const [ani, toggleAni] = useState(false);
    const [loadingSuggest, setLoadingSuggest] = useState(false);
    const [suggestList, setSuggestList] = useState(null)
    const [isEditImage, setIsEditImage] = useState(false);
    const images = [null, null, null];
    const [formService, setFormService] = useState({
        name: null,
        description: null,
        price: null,
        homestay: id,
    });
    const envApi = process.env.REACT_APP_API_URL
    const imgLink = (id, idx = 1) =>
        `${envApi}/homestays/${id}/images?index=${idx - 1}`;
    const detail = (id) => {
        const url =
            cookies.role === "homestay owner"
                ? `/owner/homestay/${id}`
                : `/homestay/${id}`;
        window.open(url, '_blank')
    };

    const openDeleteModal = () => {
        setIsOpenDelete(true)
    }
    const setImage = (img, idx) => {
        if (img.size > 1024 * 1024) {
            dispatch(
                actions.createAlert({
                    message: "Invalid image! file > 1MB.",
                    type: "error"
                })
            );
        } else {
            images[idx - 1] = img
        }
    }
    const editImage = async () => {
        const formData = new FormData();
        for (let i = 0; i < images.length; i++) {
            formData.append("files", images[i]);
        }
        const url = process.env.REACT_APP_API_URL + "/homestays/" + id + '/images'
        const response = await putMultipleFilesUpload(url, formData);
        if (response.data) {
            dispatch(
                actions.createAlert({
                    message: t('alert.editedImage'),
                    type: "success"
                })
            );
            setIsEditImage(false)
            images[0] = null
            images[1] = null
            images[2] = null
        } else {
            dispatch(
                actions.createAlert({
                    message: t('alert.error'),
                    type: "error"
                })
            );
        }

    }
    const deleteThisHomestay = async () => {
        const response = await deleteHomestay(id);
        if (response.status === 200) {
            navigate(`/owner/homestay`);
        }
    }
    const createServices = async () => {
        const err = validator(
            formService,
            { empty: (v) => (!v ? "wut???" : null) },
            { description: ["empty"], homestay: ["empty"] }
        );
        if (!err) {
            const res = await createService(formService);
            if (res < 299) {
                setFormService({
                    name: null,
                    description: null,
                    price: null,
                    homestay: id,
                });
            }
        } else {
            console.log(err);
            setValidateErrService(err);
            toggleAni(!ani);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getHomestay(id);
            setThisHomestay(data.data.homestay);
            document.title = data.data.homestay.name;
            setOwner(data.data.owner);
            setLoading(false);
            setLoadingSuggest(true);
            const data2 = await getSuggest(id, 3);
            setSuggestList(data2.data.homestays)
            setLoadingSuggest(false)
        };
        fetchData();
        return () => {
            document.title = 'PearLite Homestay'
        }
    }, [rerender]);
    return loading ? (
        <Loading />
    ) : (
        <>
            {thisHomestay && <Container className="pd-0-mobile">
                <div style={{ display: "flex", justifyContent: cookies.role === "homestay owner" ? "space-between" : 'center' }}>
                    <h2
                        className="homestay-slug-header"
                        style={{
                            color: cookies.role === "homestay owner" ? '' : '#FFF'
                        }}
                    >
                        {thisHomestay && thisHomestay.name}
                    </h2>
                    {cookies.role === "homestay owner" && <div className="homestay-slug-actions">
                        <Button id="hs-edit" onClick={() => setShowEdit(true)} color="primary">
                            <i style={{ fontSize: 20 }} className="fa fa-pencil" aria-hidden="true"></i>
                        </Button>
                        <UncontrolledTooltip
                            delay={0}
                            placement="bottom"
                            target="hs-edit"
                        >
                            {t('homestay.slug.edit')}
                        </UncontrolledTooltip>
                        {showEdit && (
                            <HomestayForm
                                turnOff={() => setShowEdit(false)}
                                triggerRerender={triggerRerender}
                                editPayload={thisHomestay}
                            />
                        )}
                        {/* <Button id="hs-service" color="success" onClick={() => setIsOpenService(true)}>
                            <i style={{ fontSize: 20 }} className="fa fa-puzzle-piece" aria-hidden="true"></i>
                        </Button>
                        <UncontrolledTooltip
                            delay={0}
                            placement="bottom"
                            target="hs-service"
                        >
                            {t('homestay.slug.createService')}
                        </UncontrolledTooltip>
                        <Modal
                            className="modal-dialog-centered"
                            isOpen={isOpenService}
                            toggle={() => setIsOpenService(false)}
                        >
                            <div className="modal-header">
                                <h4
                                    className="modal-title"
                                    style={{ fontWeight: "700" }}
                                    id="modal-title-default"
                                >
                                    {t("homestay.slug.createService")}
                                </h4>
                                <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setIsOpenService(false)}
                                >
                                    <span>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <p
                                                className={`input-label ${validateErrService.name
                                                    ? ani
                                                        ? "err1"
                                                        : "err2"
                                                    : ""
                                                    }`}
                                            >
                                                {t("name")}
                                            </p>
                                            <Input
                                                type="text"
                                                onChange={(e) => (formService.name = e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                        <FormGroup>
                                            <p
                                                className={`input-label ${validateErrService.price
                                                    ? ani
                                                        ? "err1"
                                                        : "err2"
                                                    : ""
                                                    }`}
                                            >
                                                {t("price")}
                                            </p>
                                            <Input
                                                type="number"
                                                onChange={(e) => (formService.price = e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                        <FormGroup>
                                            <p
                                                className={`input-label ${validateErrService.description
                                                    ? ani
                                                        ? "err1"
                                                        : "err2"
                                                    : ""
                                                    }`}
                                            >
                                                {t("description")}
                                            </p>
                                            <Input
                                                type="textarea"
                                                onChange={(e) =>
                                                    (formService.description = e.target.value)
                                                }
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                            <div className="modal-footer">
                                <Button
                                    color="link"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setIsOpenService(false)}
                                >
                                    {t("cancel")}
                                </Button>
                                <Button
                                    color="primary"
                                    type="button"
                                    className="ml-auto"
                                    onClick={createServices}
                                >
                                    {t("ok")}
                                </Button>
                            </div>
                        </Modal> */}
                        <Button id="hs-service" color="success" onClick={() => setIsEditImage(true)}>
                            <i style={{ fontSize: 20 }} className="fa fa-picture-o" aria-hidden="true"></i>
                        </Button>
                        <UncontrolledTooltip
                            delay={0}
                            placement="bottom"
                            target="hs-service"
                        >
                            {t('homestay.slug.image')}
                        </UncontrolledTooltip>
                        <Modal
                            className="modal-dialog-centered"
                            isOpen={isEditImage}
                            toggle={() => setIsEditImage(false)}
                        >
                            <div className="modal-header">
                                <h4
                                    className="modal-title"
                                    style={{ fontWeight: "700" }}
                                    id="modal-title-default"
                                >
                                    {t("homestay.slug.imageHeader")}
                                </h4>
                                <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setIsEditImage(false)}
                                >
                                    <span>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <Row>
                                    <Col md="4">
                                        <FormGroup style={{ position: 'relative' }}>
                                            <p className={`input-label`}>Image 1</p>
                                            <Input
                                                className="form-control"
                                                type="file"
                                                accept=".jpg,.png"
                                                multiple
                                                onChange={(e) => setImage(e.target.files[0], 1)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="4">
                                        <FormGroup style={{ position: 'relative' }}>
                                            <p className={`input-label`}>Image 2</p>
                                            <Input
                                                className="form-control"
                                                type="file"
                                                accept=".jpg,.png"
                                                multiple
                                                onChange={(e) => setImage(e.target.files[0], 2)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="4">
                                        <FormGroup style={{ position: 'relative' }}>
                                            <p className={`input-label`}>Image 3</p>
                                            <Input
                                                className="form-control"
                                                type="file"
                                                accept=".jpg,.png"
                                                multiple
                                                onChange={(e) => setImage(e.target.files[0], 3)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="12">
                                        <p className={`input-label`}>{t("homestay.slug.old")}</p>
                                    </Col>
                                    <Col md="4">
                                        <img style={{ width: '100%', height: '100%' }} src={imgLink(id, 1)} alt="" />
                                    </Col>
                                    <Col md="4">
                                        <img style={{ width: '100%', height: '100%' }} src={imgLink(id, 2)} alt="" /></Col>
                                    <Col md="4">
                                        <img style={{ width: '100%', height: '100%' }} src={imgLink(id, 3)} alt="" /></Col>
                                </Row>
                            </div>
                            <div className="modal-footer">
                                <Button
                                    color="link"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setIsEditImage(false)}
                                >
                                    {t("cancel")}
                                </Button>
                                <Button
                                    color="primary"
                                    type="button"
                                    className="ml-auto"
                                    onClick={editImage}
                                >
                                    {t("ok")}
                                </Button>
                            </div>
                        </Modal>
                        <Button id="hs-delete" color="danger" onClick={openDeleteModal}>
                            <i style={{ fontSize: 20 }} className="fa fa-trash" aria-hidden="true"></i>
                        </Button>
                        <UncontrolledTooltip
                            delay={0}
                            placement="bottom"
                            target="hs-delete"
                        >
                            {t('homestay.slug.delete.header')}
                        </UncontrolledTooltip>
                        <Modal
                            className="modal-dialog-centered"
                            isOpen={IsOpenDelete}
                            toggle={() => setIsOpenDelete(false)}
                        >
                            <div className="modal-header">
                                <h6 className="modal-title" id="modal-title-default">
                                    {t('homestay.slug.delete.header')}
                                </h6>
                                <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setIsOpenDelete(false)}
                                >
                                    <span>×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    {t('homestay.slug.delete.body')} {thisHomestay && thisHomestay.name} ?
                                </p>
                            </div>
                            <div className="modal-footer">
                                <Button
                                    color="link"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setIsOpenDelete(false)}
                                >
                                    {t('cancel')}
                                </Button>
                                <Button color="primary" type="button" className="ml-auto" onClick={deleteThisHomestay}>
                                    {t('ok')}
                                </Button>
                            </div>
                        </Modal>
                    </div>}
                </div>
                <DetailHomestay homestay={thisHomestay} owner={owner} triggerRerender={() => triggerRerender(!rerender)} />
            </Container>}
            {cookies.role === "homestay owner" ?
                <>
                    {thisHomestay && <>
                        <BookingList homestay={thisHomestay} />
                        <Statistics homestayId={thisHomestay._id} />
                        <Review homestay={thisHomestay} />
                    </>}
                </>
                : <Container className="pd-0-mobile">
                    <h2 className="mt-6">{t('homestay.suggest')}</h2>
                    {loadingSuggest ? <Loading /> : <Row className="mt-4">
                        {suggestList && (
                            suggestList.map((homestay, index) => (
                                <Col key={index} className="mb-4" md="4">
                                    <HomestayCard detail={detail} homestay={homestay} />
                                </Col>
                            ))
                        )}
                    </Row>}
                    {thisHomestay && <Review homestay={thisHomestay} />}
                </Container>}

        </>
    );
};
export default HomestaySlug;
