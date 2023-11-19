import { useCookies } from "react-cookie";
import { Outlet, Navigate } from "react-router-dom";

function UserLayout() {
    const [cookies, setCookie, removeCookie] = useCookies([
        "role",
    ]);

    return (
        <>
            {cookies.role === "visitor" ? (
                <Outlet />
            ) : (
                <Navigate to="/login" replace={true} />
            )}
        </>
    );
}

export default UserLayout;