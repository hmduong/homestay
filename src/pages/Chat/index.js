import ChartSidebar from "components/Sidebar/ChatSidebar";
import { useEffect, useState } from "react";
import { yourChats } from "services/chat";
import ChatSlug from "./ChatSlug";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

const Chat = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "currentuser",
    "name"
  ]);
  const currUser = { id: cookies.userid, name: cookies.name }
  const [chats, setChats] = useState([]);
  const [opposit, setOpposit] = useState(null);
  useEffect(() => {
    async function getData() {
      const response = await yourChats();
      if (response.data.chats) {
        setChats(response.data.chats);
      }
    }
    getData();
  }, []);

  return (cookies.currentuser ?
    <div className="chat-page"><ChartSidebar setOpposit={setOpposit} chats={chats} currentUser={currUser} />
      {opposit && <ChatSlug opposit={opposit} />}</div>
    : <Navigate to="/login" replace />
  );
};
export default Chat;
