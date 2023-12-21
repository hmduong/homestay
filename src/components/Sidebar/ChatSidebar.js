import ChatCard from "components/ChatCard";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { useTranslation } from "react-i18next";

const ChartSidebar = ({ chats, currentUser, setOpposit }) => {
    const { t } = useTranslation();
    const [cookies, setCookie, removeCookie] = useCookies([
        "role",
    ]);
    const navigate = useNavigate()
    const out = () => {
        let owner = '/'
        if (cookies.role === 'homestay owner')
            owner = '/owner';
        navigate(owner)
    }
    return (
        <div className="chat-side-bar">
            <div className="chat-current-user chat-header">
                <div>{currentUser.name}</div>
                <Button onClick={out}>{t('chat.out')}</Button>
            </div>
            <div className="chat-cards">
                {chats.map((chat, index) => <ChatCard onclick={setOpposit} curr={currentUser.id} chat={chat} key={index} />)}
            </div>
        </div>
    )
}

export default ChartSidebar