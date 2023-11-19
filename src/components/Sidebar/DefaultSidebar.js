import { useNavigate } from "react-router-dom";

const DefaultSidebar = ({ children, drawer }) => {
    const navigate = useNavigate();
    const pathname = window.location.pathname;
    const currentPage = pathname.split('/').pop();
    return (<div className="owner-sidebar">
        <div className={'sidebar-slider' + (drawer ? ' drawer' : '')}>
            <div className="sidebar-main">
                <div onClick={() => navigate('homestay')} className={'sidebar-row' + (currentPage === 'homestay' ? ' active' : '')}><i className="fa fa-home" aria-hidden="true"></i>Homestay</div>
                <div onClick={() => navigate('discount')} className={'sidebar-row' + (currentPage === 'discount' ? ' active' : '')}><i className="fa fa-ticket" aria-hidden="true"></i>Discount</div>
                <div onClick={() => navigate('/chat')} className={'sidebar-row' + (currentPage === 'chat' ? ' active' : '')}><i className="fa fa-comment" aria-hidden="true"></i>Chat<span><i className="fa fa-external-link" aria-hidden="true"></i></span></div>
            </div>
        </div>
        <div className="content">{children}</div>
    </div>)
}

export default DefaultSidebar