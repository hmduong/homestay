import { useEffect, useState, useRef } from "react";
import { getCookie, postAsyncWithToken } from "utils/request";
import { format } from "date-fns";
import { Form, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Card } from "reactstrap";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useTranslation } from "react-i18next";

const ChatBox = ({ socket, chatuserid, chatUserName }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const userid = getCookie("userid");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        var messageBody = document.getElementById('chat-list');
        messagesEndRef.current.scrollTo({ top: messageBody.scrollHeight - messageBody.clientHeight });
    };

    useEffect(() => {
        document.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                submitHandler()
            }
        })
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [chatuserid, messages]);

    useEffect(() => {
        if (socket.current) {
            socket.current.on("message", (data) => {
                setArrivalMessage({
                    message: data.message,
                    updatedAt: data.updatedAt,
                    from: data.from,
                    to: data.to,
                });
            });
            socket.current.emit("add-user", {
                userid: userid,
                chatuserid: chatuserid,
            });
        }
        async function getData() {
            const url = process.env.REACT_APP_API_URL + "/chats/load-messages";
            setLoading(true)
            const response = await postAsyncWithToken(url, {
                users: [userid, chatuserid],
            });
            if (response.data) { setMessages(response.data.messages); } else {
                dispatch(
                    actions.createAlert({
                        message: t('alert.error'),
                        type: "error"
                    })
                );
            }
            setLoading(false)
        }
        if (userid && chatuserid) {
            getData();
        } else {
            setMessages([]);
        }
    }, [chatuserid, chatUserName, userid]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    const submitHandler = async () => {
        if (message) {
            const url = process.env.REACT_APP_API_URL + "/chats/send-messages";
            const msg = {
                from: userid,
                to: chatuserid,
                updatedAt: new Date(),
                message: message,
            };
            const response = await postAsyncWithToken(url, msg);
            if (response.status === 201) {
                socket.current.emit("sendmessage", msg);
                const msgs = [...messages];
                msgs.push(msg);
                setMessages(msgs);
                setMessage("");
                dispatch(
                    actions.createAlert({
                        message: t('alert.sentMessage'),
                        type: "success"
                    })
                );
            } else {
                dispatch(
                    actions.createAlert({
                        message: t('alert.error'),
                        type: "error"
                    })
                );
            }
        }
    };

    return (
        <div className="chat-box">
            <div id="chat-list" ref={messagesEndRef} className="chat-list-mess">
                {loading ? <Loading /> : <ul>
                    {messages && messages.map((message, index) =>
                        <li key={index} className={'chat-mess-row' + (message.from === chatuserid ? '' : " curr-user-mess")}>
                            <Card className="chat-message shadow">
                                <div className="cmtext">{message.message}</div>
                                <div className="cmtime">{format(new Date(message.updatedAt), "dd/MM/yyyy")}</div>
                            </Card>
                        </li>
                    )}
                </ul>}
            </div>
            <Form className="chat-inform">
                <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative" color="primary">
                        <Input value={message} className="input-text" placeholder="Aa" type="text" onChange={(e) => setMessage(e.target.value)} />
                    </InputGroup>
                    <InputGroupAddon className="input-icon" onClick={submitHandler} addonType="append">
                        <InputGroupText>
                            <i className="fa fa-paper-plane" />
                        </InputGroupText>
                    </InputGroupAddon>
                </FormGroup>
            </Form>
        </div>
    );
};

export default ChatBox;
