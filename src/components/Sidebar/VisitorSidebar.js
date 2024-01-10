import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const VisitorSidebar = ({ children, drawer }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const pathname = window.location.pathname;
    const currentPage = pathname.split('/').pop();
    return (<div className="owner-sidebar ">
        <div className={'sidebar-slider display_none' + ' drawer'}>
            <div className="sidebar-main">
                <div onClick={() => navigate('/')} className={'sidebar-row' + (currentPage === 'homestay' ? ' active' : '')}><i className="fa fa-home" aria-hidden="true"></i>Homestay</div>
                <div onClick={() => navigate('/visitor')} className={'sidebar-row' + (currentPage === 'discount' ? ' active' : '')}><i className="fa fa-ticket" aria-hidden="true"></i>{t('booking.self')}</div>
                <div onClick={() => navigate('/chat')} className={'sidebar-row' + (currentPage === 'chat' ? ' active' : '')}><i className="fa fa-comment" aria-hidden="true"></i>{t('sideBar.chat')}<span><i className="fa fa-external-link" aria-hidden="true"></i></span></div>
            </div>
        </div>
        <div className="content">{children}</div>
    </div>)
}

export default VisitorSidebar;