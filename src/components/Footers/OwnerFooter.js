import React from "react";
import {
    Button,
    Container,
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap";
import { withTranslation } from "react-i18next";

class OwnerFooter extends React.Component {
    render() {
        const { t } = this.props;
        return (
            <>
                <footer className="footer has-cards">
                    <Container>
                        <Row className="row-grid align-items-center my-md">
                            <Col lg="6">
                                <h3 className="text-primary font-weight-light mb-2">
                                    {t('footer.thanks')}
                                </h3>
                                <h4 className="mb-0 font-weight-light">
                                    {t('footer.detailSocials')}
                                </h4>
                            </Col>
                            <Col className="text-lg-center btn-wrapper" lg="6">
                                <Button
                                    className="btn-icon-only rounded-circle"
                                    color="twitter"
                                    href="https://twitter.com"
                                    id="tooltip475038074"
                                    target="_blank"
                                >
                                    <span className="btn-inner--icon">
                                        <i className="fa fa-twitter" />
                                    </span>
                                </Button>
                                <UncontrolledTooltip delay={0} target="tooltip475038074">
                                    {t('footer.followUs')}
                                </UncontrolledTooltip>
                                <Button
                                    className="btn-icon-only rounded-circle ml-1"
                                    color="facebook"
                                    href="https://www.facebook.com"
                                    id="tooltip837440414"
                                    target="_blank"
                                >
                                    <span className="btn-inner--icon">
                                        <i className="fa fa-facebook-square" />
                                    </span>
                                </Button>
                                <UncontrolledTooltip delay={0} target="tooltip837440414">
                                    {t('footer.likeUs')}
                                </UncontrolledTooltip>
                                <Button
                                    className="btn-icon-only rounded-circle ml-1"
                                    color="dribbble"
                                    href="https://www.instagram.com"
                                    id="tooltip829810202"
                                    target="_blank"
                                >
                                    <span className="btn-inner--icon">
                                        <i className="fa fa-instagram" />
                                    </span>
                                </Button>
                                <UncontrolledTooltip delay={0} target="tooltip829810202">
                                    {t('footer.followUs')}
                                </UncontrolledTooltip>
                                <Button
                                    className="btn-icon-only rounded-circle ml-1"
                                    color="github"
                                    href="https://github.com"
                                    id="tooltip495507257"
                                    target="_blank"
                                >
                                    <span className="btn-inner--icon">
                                        <i className="fa fa-github" />
                                    </span>
                                </Button>
                                <UncontrolledTooltip delay={0} target="tooltip495507257">
                                    {t('footer.starGithub')}
                                </UncontrolledTooltip>
                            </Col>
                        </Row>
                        <hr />
                        <Row className="align-items-center justify-content-md-between">
                            <Col md="6">
                                <div className="copyright">
                                    © {new Date().getFullYear()}{" "}
                                    <a
                                        href=""
                                        target="_blank"
                                    >
                                        Tran Khanh Le
                                    </a>
                                    .
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </footer>
            </>
        );
    }
}

export default withTranslation()(OwnerFooter);
