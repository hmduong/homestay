import { format } from "date-fns";
import { useCookies } from "react-cookie";

const ChatCard = ({ chat, active, onclick }) => {
    const [cookies, setCookie, removeCookie] = useCookies([
        "name",
        "userid"
    ]);
    const opposit = chat.users.find((u) => u._id !== cookies.userid);
    const click = () => {
        onclick(opposit)
    }
    return (
        <div className={`chat-card${active ? ' active' : ''}`} onClick={click}>
            <div className="chat-avt">
                {opposit.name[0].toUpperCase()}
            </div>
            <div className="chat-look">
                <h6 className="chat-name">
                    {opposit.name}
                </h6>
                <div className="chat-last-content">
                    <div className="chat-last-mess">
                        {chat.lastMessage.from === cookies.name ? "Me: " : ""}
                        <div className="chat-last-mess-content">{chat.lastMessage.message}</div>
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
