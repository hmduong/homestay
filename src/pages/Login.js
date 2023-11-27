import React, { useEffect, useState } from "react";
import { login } from "services/authService";
import { useCookies } from "react-cookie";
import {
  Button,
  Card,
  CardHeader,
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

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    document.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        handleLogin()
      }
    })
  }, []);
  const [cookies, setCookie, removeCookie] = useCookies([
    "currentuser",
    "userid",
    "role",
    "name"
  ]);

  const loginForm = {
    username: "",
    password: ""
  }

  const handleLogin = async () => {
    let tmp = `{ "username": "${loginForm.username}", "password": "${loginForm.password}" }`;
    let params = JSON.parse(tmp);
    if (loginForm.username && loginForm.password && !cookies.currentuser) {
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
            message: "Error occur",
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
        <section className="section section-shaped section-lg" style={{ height: "100vh" }}>
          <DarkBubbleBackground />
          <Container className="pt-lg-7">
            <Row className="justify-content-center">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  {loading ? <Loading /> : <>
                    <CardHeader className="bg-white pb-5">
                      <div className="text-muted text-center mb-3">
                        <small>Sign in with</small>
                      </div>
                      <div className="btn-wrapper text-center">
                        <Button
                          className="btn-neutral btn-icon"
                          color="default"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="btn-inner--icon mr-1">
                            <img
                              alt="..."
                              src={require("assets/img/icons/common/github.svg").default}
                            />
                          </span>
                          <span className="btn-inner--text">Github</span>
                        </Button>
                        <Button
                          className="btn-neutral btn-icon ml-1"
                          color="default"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="btn-inner--icon mr-1">
                            <img
                              alt="..."
                              src={require("assets/img/icons/common/google.svg").default}
                            />
                          </span>
                          <span className="btn-inner--text">Google</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                      <div className="text-center text-muted mb-4">
                        <small>Or sign in with credentials</small>
                      </div>
                      <Form role="form">
                        <FormGroup className="mb-3">
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="User name" type="text" onChange={(e) => loginForm.username = e.target.value} />
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
                              placeholder="Password"
                              type="password"
                              autoComplete="off"
                              onChange={(e) => loginForm.password = e.target.value}
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
                            Sign in
                          </Button>
                        </div>
                        <div className="text-center">
                          <a className="text-light" href="/register">
                            <small>Create a new account</small>
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
