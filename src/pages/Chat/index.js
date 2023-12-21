import ChartSidebar from "components/Sidebar/ChatSidebar";
import { useEffect, useState } from "react";
import { yourChats } from "services/chat";
import ChatSlug from "./ChatSlug";
import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useTranslation } from "react-i18next";

const Chat = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [cookies, setCookie, removeCookie] = useCookies([
    "currentuser",
    "name"
  ]);
  const currUser = { id: cookies.userid, name: cookies.name }
  const [chats, setChats] = useState([]);
  const [opposit, setOpposit] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getData() {
      setLoading(true)
      const response = await yourChats();
      if (response.data.chats) {
        setChats(response.data.chats);
      } else {
        dispatch(
          actions.createAlert({
            message: t('alert.error'),
            type: "error"
          })
        );
      }
      setLoading(false)
    }
    getData();
  }, []);

  return (cookies.currentuser ?
    (loading ? <Loading /> : <div className="chat-page"><ChartSidebar setOpposit={setOpposit} chats={chats} currentUser={currUser} />
      {opposit && <ChatSlug opposit={opposit} />}</div>)
    : <Navigate to="/login" replace />
  );
};
export default Chat;
