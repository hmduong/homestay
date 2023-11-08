import React, { useEffect } from "react";
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

const Login = () => {
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
    "name",
    "_id"
  ]);

  const loginForm = {
    username: "",
    password: ""
  }

  const handleLogin = async () => {
    let tmp = `{ "username": "${loginForm.username}", "password": "${loginForm.password}" }`;
    let params = JSON.parse(tmp);
    if (loginForm.username && loginForm.password) {
      const response = await login(params);
      console.log({ response });
      if (response?.token) {
        // toastSuccess("Success Notification !");
        setCookie("currentuser", response?.token);
        setCookie("userid", response?.user._id);
        setCookie("role", response.user.role);
        setCookie("name", response.user.name);
        setCookie("_id", response.user._id);
        if (response.user.role === 'homestay owner')
          window.location.pathname = '/owner';
        else window.location.pathname = '/'
      }
      //   else toastError(response?.error);
      // } else {
      //   // toastError("Error");
    }
  };

  return (
    <>
      <main>
        <section className="section section-shaped section-lg" style={{ height: "100vh" }}>
          <DarkBubbleBackground />
          <Container className="pt-lg-7">
            <Row className="justify-content-center">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
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
                      <FormGroup className="mb-3 has-danger">
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
