import BubbleBackground from "components/Decorators/BubbleBackground";
import SimpleFooter from "components/Footers/SimpleFooter";
import MainNavbar from "components/Navbars/MainNavbar";
import { Container } from "reactstrap";
import { useCookies } from "react-cookie";
import VisitorSidebar from "components/Sidebar/VisitorSidebar";

function DefaultLayout({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(["role"]);

  return (
    <>
      <MainNavbar />
      <div style={{ height: "69px" }}></div>
      {cookies.role === "visitor" ? (
        <VisitorSidebar>
          <Container className="content content_responsive">
            <BubbleBackground />
            {children}
          </Container>
        </VisitorSidebar>
      ) : (
        <Container className="content content_responsive">
          <BubbleBackground />
          {children}
        </Container>
      )}

      <SimpleFooter />
    </>
  );
}

export default DefaultLayout;
