import ChatCard from "components/ChatCard";
import { useState } from "react";

const ChartSidebar = ({ chats, setOpposit }) => {
    const [active, setActive] = useState(null)
    const onClick = (idx, oppo) => {
        setActive(idx)
        setOpposit(oppo)
    }
    return (
        <div className="chat-side-bar">
            <div className="chat-cards">
                {chats.map((chat, index) => <ChatCard active={active === index} onclick={(oppo) => onClick(index, oppo)} chat={chat} key={index} />)}
            </div>
        </div>
    )
}

export default ChartSidebar