import BubbleBackground from "components/Decorators/BubbleBackground";
import SimpleFooter from "components/Footers/SimpleFooter";
import MainNavbar from "components/Navbars/MainNavbar";
import { Container } from "reactstrap";

function DefaultLayout({ children }) {

    return (
        <>
            <MainNavbar />
            <div style={{ height: '75px' }}></div>
            <Container className="content">
                <BubbleBackground />
                {children}
            </Container>
            <SimpleFooter />
        </>
    );
}

export default DefaultLayout;
