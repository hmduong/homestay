import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Modal,
    Container,
} from "reactstrap";
import { getHomestay } from "services/homestayManagementService";
import Statistics from "pages/Owner/Statistics";
import BookingList from "pages/Owner/BookingList";
import Review from "pages/Owner/Review";
import { useCookies } from "react-cookie";
import { deleteHomestay } from "services/homestayManagementService";
import Loading from "components/Loading";
import DetailHomestay from "pages/DetailHomestay";
import { useTranslation } from "react-i18next";

const HomestaySlug = () => {
    const { t, i18n } = useTranslation();
    const [cookies, setCookie, removeCookie] = useCookies(["role", "userid"]);
    const [IsOpenDelete, setIsOpenDelete] = useState(false);
    const [rerender, triggerRerender] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const openDeleteModal = () => {
        setIsOpenDelete(true)
    }
    const deleteThisHomestay = async () => {
        const response = await deleteHomestay(id);
        if (response.status === 200) {
            navigate(`/owner/homestay`);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getHomestay(id);
            setData(data.data);
            setLoading(false);
        };
        fetchData();
    }, [rerender]);
    return loading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <div style={{ display: "flex", justifyContent: cookies.role === "homestay owner" ? "space-between" : 'center' }}>
                    <h2
                        style={{
                            width: "fit-content",
                            cursor: "pointer",
                            fontWeight: "bolder",
                            marginLeft: 8,
                            color: cookies.role === "homestay owner" ? '' : '#FFF'
                        }}
                    >
                        {data.homestay.name}
                    </h2>
                    {cookies.role === "homestay owner" && (
                        <>
                            <Button style={{ marginBottom: 16 }} color="danger" onClick={openDeleteModal}>
                                <i style={{ fontSize: 20 }} className="fa fa-trash" aria-hidden="true"></i>
                            </Button>
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
                                        {t('homestay.slug.delete.body')} {data.homestay.name} ?
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
                        </>
                    )}
                </div>
                <DetailHomestay homestay={data.homestay} owner={data.owner} triggerRerender={() => triggerRerender(!rerender)} />
            </Container>
            {cookies.role === "homestay owner" && (
                <>
                    <BookingList homestay={data.homestay} />
                    <Statistics />
                </>
            )}
            <Review homestay={data.homestay} />
        </>
    );
};
export default HomestaySlug;
