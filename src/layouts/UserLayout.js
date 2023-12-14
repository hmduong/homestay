import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";
import User from "pages/User";

function UserLayout() {
    const [cookies, setCookie, removeCookie] = useCookies([
        "role",
    ]);

    return (
        cookies.role ? <>
            <User />
        </> : <Navigate to="/login" replace={true} />
    );
}

export default UserLayout;