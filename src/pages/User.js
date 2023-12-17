import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice";
import validator from 'utils/validator';
import Loading from "components/Loading";
import { Button, Card, Container, Modal, Row, Col, Input, FormGroup } from "reactstrap";
import { getUserInfo } from "services/authService";
import BubbleBackground from "components/Decorators/BubbleBackground";
import { multipleFilesUpload } from "utils/request";
import MainNavbar from "components/Navbars/MainNavbar";
import OwnerNavbar from "components/Navbars/OwnerNavbar";
import { postAsyncWithToken } from "utils/request";

const User = () => {
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies([
        "currentuser",
        "name",
        "role"
    ]);
    const [loading, setLoading] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isOpenActive, setIsOpenActive] = useState(false)
    const [bankqr, setBankqr] = useState(null);
    const [rerender, triggerRerender] = useState(false);
    const [enableEdit, setEnableEdit] = useState(false);

    const [isOpenModal, setIsOpenModal] = useState(false)
    const [password, setRecentpassword] = useState("")
    const [newPassword, setNewpassword] = useState("")
    const [repeatePassword, setRepeatepassword] = useState("")
    const [validateErr, setValidateErr] = useState({});
    const [ani, toggleAni] = useState(false);
    const [isOpenQr, setIsOpenQr] = useState(false);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState();
    const uploadBankqr = async () => {
        const err = validator({ bankqr: bankqr }, { empty: (v) => !v ? 'wut???' : null }, {})
        if (!err) {
            setLoading(true)
            const res = await saveBankqr();
            if (res._id) {
                setIsOpenActive(false)
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
            setIsOpenActive(false)
        }
    }
    const editUser = async () => {
        const url = process.env.REACT_APP_API_URL + "/users/" + userInfo._id + "/edit";
        const data = {
            name,
            username,
            email,
            phone,
            role: userInfo.role,
            _id: userInfo._id
        }
        setLoading(true)
        const response = await postAsyncWithToken(url, data);
        if (response.data.user) {
            dispatch(
                actions.createAlert({
                    message: "Edit user info success!",
                    type: "success"
                })
            );
            setUserInfo(response.data.user)
        } else {
            dispatch(
                actions.createAlert({
                    message: "Error occur",
                    type: "error"
                })
            );
        }
        setEnableEdit(false)
        setLoading(false)
    }
    const saveBankqr = async () => {
        const formData = new FormData();
        formData.append("bankqr", bankqr);
        const url = process.env.REACT_APP_API_URL + "/users/" + userInfo._id + "/banking";
        const res = await multipleFilesUpload(url, formData);
        if (res.status >= 400 || !res) console.log("err");
        return res
    };
    const changePassword = async () => {
        const url = process.env.REACT_APP_API_URL + "/users/" + userInfo._id + "/changepass";
        const data = {
            username: userInfo.username,
            password,
            newPassword
        }
        const form = {
            password,
            newPassword,
            repeatePassword
        }
        const err = validator(
            form,
            {
                empty: (v) => (!v ? "wut???" : null),
                equal: (v) => (v !== repeatePassword || v != newPassword ? "sada" : null)
            },
            { equal: ["password"] }
        );
        if (err) {
            setLoadingModal(true)
            const response = await postAsyncWithToken(url, data);
            if (response.data.user) {
                dispatch(
                    actions.createAlert({
                        message: "Change password success!",
                        type: "success"
                    })
                );
                setUserInfo(response.data.user)
                setValidateErr({})
                setIsOpenModal(false)
            } else {
                dispatch(
                    actions.createAlert({
                        message: "Error occur",
                        type: "error"
                    })
                );
                setValidateErr(err);
                toggleAni(!ani)
            }
            setRecentpassword("")
            setNewpassword("")
            setRepeatepassword("")
            setLoadingModal(false)
        }
    }
    useEffect(() => {
        async function getData() {
            setLoading(true);
            const response = await getUserInfo();
            setUserInfo(response);
            setName(response.name)
            setUsername(response.username)
            setPhone(response.phone)
            setEmail(response.email)
            setLoading(false);
        }
        getData();
    }, [rerender]);

    return (
        <div className="user-page">
            <BubbleBackground />
            {cookies.role === "homestay owner" ? <OwnerNavbar /> : <MainNavbar />}
            {loading ? <Loading /> : userInfo && <Container>
                <div className="pt-8"></div>
                <Card className="shadow user-info">
                    <div className="user-avatar">
                        <span className="nav-link-inner--text">
                            {userInfo.name.toUpperCase()[0]}
                        </span>
                    </div>
                    <div className="the-split"></div>
                    <div className="user-text">
                        <div className="user-info-header"><h3>User info</h3> {enableEdit ? <Button color="success" onClick={editUser}>Save</Button> : <Button color="primary" onClick={() => setEnableEdit(true)}>Edit</Button>}</div>
                        <div className="user-info-input"><span>Name:</span><Input disabled={!enableEdit} value={name} onChange={e => setName(e.target.value)} defaultValue={userInfo.name} /></div>
                        <div className="user-info-input"><span>User name:</span><Input disabled={!enableEdit} value={username} onChange={e => setUsername(e.target.value)} defaultValue={userInfo.username} /></div>
                        <div className="user-info-input"><span>Email:</span><Input disabled={!enableEdit} value={email} onChange={e => setEmail(e.target.value)} defaultValue={userInfo.email} /></div>
                        <div className="user-info-input"><span>Phone:</span><Input disabled={!enableEdit} value={phone} onChange={e => setPhone(e.target.value)} defaultValue={userInfo.phone} /></div>
                        <div className="user-info-input">
                            <span>Password:</span>
                            <Button className="ml-n3" color="dangerr" onClick={() => setIsOpenModal(true)}>Change password</Button>
                            <Modal
                                className="modal-dialog-centered"
                                isOpen={isOpenModal}
                                toggle={() => setIsOpenModal(false)}
                            >

                                {loadingModal ? <Loading /> : <Row className="modal-body">
                                    <Col md={12} className="m-2 mt-3">
                                        <h5>
                                            Change password
                                        </h5>
                                    </Col>
                                    <Col md="12" className='m-2'>
                                        <FormGroup>
                                            <p className={`input-label ml-n2 ${validateErr.password ? (ani ? "err1" : "err2") : ""}`}>Recent password</p>
                                            <Input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setRecentpassword(e.target.value)}
                                                className="ml-n2"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="12" className='m-2'>
                                        <FormGroup>
                                            <p className={`input-label ml-n2 ${validateErr.newPassword ? (ani ? "err1" : "err2") : ""}`}>New password</p>
                                            <Input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewpassword(e.target.value)}
                                                className="ml-n2"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="12" className='m-2'>
                                        <FormGroup>
                                            <p className={`input-label ml-n2 ${validateErr.repeatePassword ? (ani ? "err1" : "err2") : ""}`}>Repeate password</p>
                                            <Input
                                                type="password"
                                                value={repeatePassword}
                                                onChange={(e) => setRepeatepassword(e.target.value)}
                                                className="ml-n2"
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="12" className='booking-submit'>
                                        <Button color='primary' onClick={changePassword}>Submit</Button>
                                    </Col>
                                </Row>}
                            </Modal>
                        </div>
                        {cookies.role === "homestay owner" && <div className="user-info-input"><span>Qrcode:</span>
                            {userInfo.bankqr ?
                                <>
                                    <Button className="ml-n3" color="dangerr" onClick={() => setIsOpenQr(true)}>Check Qr</Button>
                                    <Modal
                                        className="modal-dialog-centered"
                                        isOpen={isOpenQr}
                                        toggle={() => setIsOpenQr(false)}
                                    >

                                        {loading ? <Loading /> : <Row>
                                            <Col md={12} className="m-2 mt-3">
                                                <h5>
                                                    Your qr
                                                </h5>
                                            </Col>
                                            <Col md="12" className='m-2'>
                                                <img width={400} height={400} src={process.env.REACT_APP_API_URL + "/users/" + userInfo._id + "/banking"} alt="" />
                                            </Col>
                                        </Row>}
                                    </Modal>
                                </> :
                                <>
                                    <Button color="primaryy" className="mt-5 btn" onClick={() => setIsOpenActive(true)}>Active</Button>
                                    <Modal
                                        className="modal-dialog-centered"
                                        isOpen={isOpenActive}
                                        toggle={() => setIsOpenActive(false)}
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
                                </>}</div>}
                    </div>
                </Card>
            </Container>}
        </div>
    )
}
export default User;
