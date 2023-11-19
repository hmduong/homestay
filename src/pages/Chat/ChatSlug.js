import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client";
import ChatBox from "components/ChatBox";

const ChatSlug = ({ opposit }) => {
    const socket = useRef();
    useEffect(() => {
        socket.current = io(process.env.REACT_APP_API_URL);
    }, [])

    return (
        <div className="chat-slug">
            <div className="chat-current-user chat-header">
                {opposit.name}
            </div>
            <ChatBox
                chatuserid={opposit._id}
                chatUserName={opposit.name}
                socket={socket}
            />
        </div>
    )
}

export default ChatSlug