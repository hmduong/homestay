import { useEffect, useState } from "react";
import { login } from "services/authService";
import { useCookies } from "react-cookie";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import DarkBubbleBackground from "components/Decorators/DarkBubbleBackground";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, []);
  const [cookies, setCookie, removeCookie] = useCookies([
    "currentuser",
    "userid",
    "role",
    "name"
  ]);

  const handleLogin = async () => {
    let tmp = `{ "username": "${username}", "password": "${password}" }`;
    let params = JSON.parse(tmp);
    if (username && password && !cookies.currentuser) {
      setLoading(true)
      const response = await login(params);
      if (response?.token) {
        setCookie("currentuser", response?.token, { path: '/' });
        setCookie("userid", response?.user._id, { path: '/' });
        setCookie("role", response.user.role, { path: '/' });
        setCookie("name", response.user.name, { path: '/' });
        let owner = '/'
        if (response.user.role === 'homestay owner')
          owner = '/owner';
        navigate(owner)
      } else {
        dispatch(
          actions.createAlert({
            message: t('alert.error'),
            type: "error"
          })
        );
      }
      setLoading(false)
    }
  };

  return (cookies.currentuser ? <Navigate to={cookies.role === "visitor" ? "/" : "/owner"} /> :
    <>
      <main>
        <section className="section section-shaped section-lg" style={{ height: "100vh", padding: 0 }}>
          <DarkBubbleBackground />
          <Container className="pt-lg-7">
            <Row className="login-wrapper">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  {loading ? <Loading /> : <>
                    <CardBody className="px-lg-5 py-lg-5">
                      <h4 className="text-center text-muted mb-4">
                        {t('authAction.signIn')}
                      </h4>
                      <Form role="form">
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input value={username} placeholder={t('authAction.userName')} type="text" onChange={(e) => setUsername(e.target.value)} />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-lock-circle-open" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder={t('authAction.password')}
                              type="password"
                              autoComplete="off"
                              onChange={(e) => setPassword(e.target.value)}
                              value={password}
                            />
                          </InputGroup>
                        </FormGroup>
                        <div className="text-center">
                          <Button
                            className="my-4"
                            color="primary"
                            type="button"
                            onClick={handleLogin}
                          >
                            {t('authAction.signIn')}
                          </Button>
                        </div>
                        <div className="text-center">
                          <a className="text-light" href="/register">
                            <small>{t('authAction.createNewAccount')}</small>
                          </a>
                        </div>
                      </Form>
                    </CardBody>
                  </>}
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
};

export default Login;
