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

const HomestaySlug = () => {
    const { t, i18n } = useTranslation();
    const [cookies, setCookie, removeCookie] = useCookies(["role", "userid"]);
    const { id } = useParams();
    const navigate = useNavigate();

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
    const [formService, setFormService] = useState({
        name: null,
        description: null,
        price: null,
        homestay: id,
    });
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
            document.title = 'Home 4 stay'
        }
    }, [rerender]);
    return loading ? (
        <Loading />
    ) : (
        <>
            {thisHomestay && <Container>
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
                        <Button id="hs-service" color="success" onClick={() => setIsOpenService(true)}>
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
                    </>}
                </>
                : <Container>
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
                </Container>}
            {thisHomestay && <Review homestay={thisHomestay} />}
        </>
    );
};
export default HomestaySlug;
