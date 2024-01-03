import ChatCard from "components/ChatCard";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ChartSidebar = ({ chats, setOpposit }) => {
    const { t, i18n } = useTranslation();
    const [active, setActive] = useState(null)
    const onClick = (idx, oppo) => {
        setActive(idx)
        setOpposit(oppo)
    }
    return (
        <div className="chat-side-bar">
            <div className="chat-cards">
                {chats.length ? chats.map((chat, index) => <ChatCard active={active === index} onclick={(oppo) => onClick(index, oppo)} chat={chat} key={index} />)
                    : <div className="chat-cards-nodata">{t('chat.nochat')}</div>}
            </div>
        </div>
    )
}

export default ChartSidebar