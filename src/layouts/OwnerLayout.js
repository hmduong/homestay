import OwnerNavbar from "components/Navbars/OwnerNavbar";
import { useCookies } from "react-cookie";
import { Outlet, Navigate } from "react-router-dom";
import OwnerFooter from "components/Footers/OwnerFooter";
import OwnerSidebar from "components/Sidebar/OwnerSidebar";
import { useState } from "react";

function OwnerLayout() {
    const [cookies, setCookie, removeCookie] = useCookies([
        "role",
    ]);

    const [drawer, setDrawer] = useState(true)

    return (
        <>
            {cookies.role === "homestay owner" ? (
                <>
                    <OwnerNavbar refe={{ drawer, setDrawer }} />
                    <div style={{ height: '69px' }}></div>
                    <OwnerSidebar drawer={drawer}>
                        <Outlet />
                        <OwnerFooter />
                    </OwnerSidebar>
                </>
            ) : (
                <Navigate to="/login" replace={true} />
            )}
        </>
    );
}

export default OwnerLayout;
