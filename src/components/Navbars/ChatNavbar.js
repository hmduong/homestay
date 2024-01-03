import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
} from "reactstrap";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";

function ChatNavbar() {
    const { t, i18n } = useTranslation();
    const languageStore = JSON.parse(localStorage.getItem('language'));
    const [enLang, setEnLang] = useState(languageStore == 'vi' ? false : true ?? true);
    const changeLanguage = () => {
        setEnLang(!enLang);
        localStorage.setItem('language', JSON.stringify(enLang ? 'vi' : 'en'))
        i18n.changeLanguage(enLang ? 'vi' : 'en');
    }
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies([
        "name",
        "role"
    ]);

    const leaveChat = () => {
        navigate('/')
    }

    return (
        <div className="chat-navbar">
            <div className="cncurruser">
                <div className="chat-avt" style={{ background: '#5e72e4' }}>
                    {cookies.name[0].toUpperCase()}
                </div>
                <div className="cnuserinfo">
                    <h5>{cookies.name}</h5>
                    <p>{cookies.role === 'homestay owner' ? t('chat.owner') : t('chat.visitor')}</p>
                </div>
            </div>
            <div className="cnoptions">
                <img onClick={changeLanguage} width={30} src={enLang ? "https://flagicons.lipis.dev/flags/4x3/gb.svg" : "https://flagicons.lipis.dev/flags/4x3/vn.svg"} alt="" />
                <Button onClick={leaveChat}>{t('chat.leave')}</Button>
            </div>
        </div>
    );
}

export default ChatNavbar;
