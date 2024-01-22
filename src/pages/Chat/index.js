import ChartSidebar from "components/Sidebar/ChatSidebar";
import { useEffect, useState } from "react";
import { yourChats } from "services/chat";
import ChatSlug from "./ChatSlug";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useTranslation } from "react-i18next";
import ChatNavbar from "components/Navbars/ChatNavbar";

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [cookies, setCookie, removeCookie] = useCookies([
    "currentuser",
    "name"
  ]);
  const [chats, setChats] = useState([]);
  const [opposit, setOpposit] = useState(null);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true)
    const response = await yourChats();
    if (response?.data?.chats) {
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
  useEffect(() => {
    if (!cookies.currentuser) {
      navigate('/login')
      sessionStorage.setItem('pearRedirect', '/chat')
      return
    }
    getData();
  }, []);

  return (
    <div className="chat-page">
      <ChatNavbar />
      {loading ? <Loading /> : <div className="chat-content">
        <ChartSidebar setOpposit={setOpposit} chats={chats} />
        {opposit && <ChatSlug opposit={opposit} />}
      </div>}
    </div>
  );
};
export default Chat;
