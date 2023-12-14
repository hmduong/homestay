import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice";
import validator from 'utils/validator';
import Loading from "components/Loading";
import { Button, Card, Container, Modal, Row, Col, Input, FormGroup } from "reactstrap";
import { getUserInfo } from "services/authService";
import BubbleBackground from "components/Decorators/BubbleBackground";
import { useTranslation } from "react-i18next";
import { multipleFilesUpload } from "utils/request";

const User = () => {
    const { t, i18n } = useTranslation();
    const [enLang, setEnLang] = useState(true);
    const changeLanguage = () => {
        setEnLang(!enLang)
        i18n.changeLanguage(enLang ? 'vi' : 'en')
    }
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies([
        "currentuser",
        "name",
    ]);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenActive, setIsOpenactive] = useState(false)
    const [bankqr, setBankqr] = useState(null);
    const navigate = useNavigate();
    const [rerender, triggerRerender] = useState(false);
    const logout = () => {
        removeCookie("currentuser", { path: '/' });
        removeCookie("userid", { path: '/' });
        removeCookie("role", { path: '/' });
        removeCookie("name", { path: '/' });
        navigate("/");
    };
    const uploadBankqr = async () => {
        const err = validator({ bankqr: bankqr }, { empty: (v) => !v ? 'wut???' : null }, {})
        if (!err) {
            setLoading(true)
            const res = await saveBankqr();
            if (res._id) {
                setIsOpenactive(false)
                dispatch(
                    actions.createAlert({
                        message: "Active successed!",
                        type: "success"
                    })
                );
                triggerRerender()
            } else {
                dispatch(
                    actions.createAlert({
                        message: "Error occur!",
                        type: "error"
                    })
                );
            }
            setLoading(false)
            setIsOpenactive(false)
        }
    }
    const saveBankqr = async () => {
        const formData = new FormData();
        formData.append("bankqr", bankqr);
        const url = process.env.REACT_APP_API_URL + "/users/" + userInfo._id + "/banking";
        const res = await multipleFilesUpload(url, formData);
        if (res.status >= 400 || !res) console.log("err");
        return res
    };
    useEffect(() => {
        async function getData() {
            setLoading(true);
            const response = await getUserInfo();
            setUserInfo(response);
            setLoading(false);
        }
        getData();
    }, [rerender]);

    return loading ? (
        <Loading />
    ) : (
        <div className="user-page">
            <BubbleBackground />
            <div className="user-navbar">
                <Container>
                    <i className="fa fa-arrow-left" aria-hidden="true" onClick={() => navigate('/')}></i>
                    <img onClick={changeLanguage} width={40} src={enLang ? "https://flagicons.lipis.dev/flags/4x3/gb.svg" : "https://flagicons.lipis.dev/flags/4x3/vn.svg"} alt="" />
                </Container>
            </div>
            {userInfo.name && <Container>
                <div className="pt-8"></div>
                <Card className="shadow user-info">
                    <div className="user-avatar">
                        <span className="nav-link-inner--text">
                            {userInfo.name.toUpperCase()[0]}
                        </span>
                    </div>
                    <div className="user-text">
                        <div>Name: {userInfo.name}</div>
                        <div>Email: {userInfo.email}</div>
                        <div>Phone: {userInfo.phone}</div>
                    </div>
                </Card>
                {cookies.role === "homestay owner" && <Card className="shadow user-action">
                    {userInfo.bankqr ? <div className="">
                        <img width={400} height={400} src={process.env.REACT_APP_API_URL + "/users/" + userInfo._id + "/banking"} alt="" />
                    </div> : <div className="active-pane">
                        <Button color="primary" className="mt-5 btn" onClick={() => setIsOpenactive(true)}>Active</Button>
                        <Modal
                            className="modal-dialog-centered"
                            isOpen={isOpenActive}
                            toggle={() => setIsOpenactive(false)}
                        >

                            {loading ? <Loading /> : <Row>
                                <Col md={12} className="m-2 mt-3">
                                    <h5>
                                        Active account
                                    </h5>
                                </Col>
                                <Col md="12" className='m-2'>
                                    <FormGroup>
                                        <Input
                                            type="file"
                                            accept=".jpg,.png"
                                            multiple
                                            onChange={(e) => setBankqr(e.target.files[0])}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="12" className='booking-submit'>
                                    <Button color='primary' onClick={uploadBankqr}>Submit</Button>
                                </Col>
                            </Row>}
                        </Modal>
                        <p className="mt-2">You need to active account</p>
                    </div>}
                </Card>}
                <Button className="logout-btn" color="danger" onClick={() => setIsOpenModal(true)}>Log out</Button>
                <Modal
                    className="modal-dialog-centered"
                    isOpen={isOpenModal}
                    toggle={() => setIsOpenModal(false)}
                >
                    <div className="modal-header">
                        <h6 className="modal-title" id="modal-title-default">
                            {t('logout.title')}
                        </h6>
                        <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setIsOpenModal(false)}
                        >
                            <span>×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>
                            {t('logout.content')}
                        </p>
                    </div>
                    <div className="modal-footer">
                        <Button
                            color="link"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setIsOpenModal(false)}
                        >
                            {t('cancel')}
                        </Button>
                        <Button color="primary" type="button" className="ml-auto" onClick={logout}>
                            {t('ok')}
                        </Button>
                    </div>
                </Modal>
            </Container>}
        </div>
    );
};
export default User;
