import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Headroom from "headroom.js";
import {
    Button,
    UncontrolledCollapse,
    NavbarBrand,
    Navbar,
    NavItem,
    Nav,
    Container,
    UncontrolledDropdown,
    DropdownToggle,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Modal
} from "reactstrap";
import { useCookies } from "react-cookie";
import Avatar from "components/Avatar";
import { getNoti } from "services/notification";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

function ChatNavbar({ currUserName }) {
    const { t, i18n } = useTranslation();
    const languageStore = JSON.parse(localStorage.getItem('language'));
    const [enLang, setEnLang] = useState(languageStore == 'vi' ? false : true ?? true);
    const [isOpenModal, setIsOpenModal] = useState(false);
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
                    {currUserName[0].toUpperCase()}
                </div>
                <div className="cnuserinfo">
                    <h5>{currUserName}</h5>
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
