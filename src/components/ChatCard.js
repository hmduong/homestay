import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const ChatCard = ({ chat, curr, onclick }) => {
    // const navigate = useNavigate()
    // const link = `${props.chatuserid}`;
    const opposit = chat.users.find((u) => u._id !== curr);
    console.log(chat);
    const click = () => {
        onclick(opposit)
        // navigate(link)
    }
    return (
        <div className="chat-card" onClick={click}>
            <div className="chat-avt">
                {opposit.name[0]}
            </div>
            <div className="chat-look">
                <div className="chat-name">
                    {opposit.name}
                </div>
                <div className="chat-last-content">
                    <div className="chat-last-mess">
                        {chat.lastMessage.from === curr ? "Me: " : ""}
                        {chat.lastMessage.message}
                    </div>
                    <div className="chat-time">
                        {format(new Date(chat.updatedAt), "dd/MM/yyyy")}
                    </div>
                </div>
            </div>
        </div >
    );
};
export default ChatCard;
