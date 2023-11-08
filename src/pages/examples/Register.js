import React, { useEffect } from "react";
import { signup } from "services/authService";
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
import Picker from "components/Picker";

function Register() {
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    document.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        handleRegister()
      }
    })
  }, []);

  const handleRegister = async () => {
    let role = state.isLeft ? "visitor" : "homestay owner"
    let tmp = `{ "username": "${registerForm.username}","name": "${registerForm.name}", "password": "${registerForm.password}", "phone": "${registerForm.phone}", "email": "${registerForm.email}", "role": "${role}"}`;
    let params = JSON.parse(tmp);
    if (registerForm.username && registerForm.password && registerForm.phone && registerForm.email && role) {
      const response = await signup(params);
      if (response?.token) {
        // toastSuccess("Success Notification !");
        window.location.pathname = '/login'
        // } else {
        //   toast.error("Can not sign up!");
      }
      // } else {
      //   toast.error("Can not sign up!");
    }
  }

  const registerForm = {
    username: "",
    name: "",
    email: "",
    password: "",
    phone: ""
  }
  const state = {
    isLeft: true,
    leftName: "Visitor",
    rightName: "Owner"
  }
  return (
    <>
      <main>
        <section className="section section-shaped section-lg" style={{ height: "100vh" }}>
          <DarkBubbleBackground />
          <Container className="pt-lg-4">
            <Row className="justify-content-center">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  <CardHeader className="bg-white pb-5">
                    <div className="text-muted text-center mb-3">
                      <small>Sign up with</small>
                    </div>
                    <div className="text-center">
                      <Button
                        className="btn-neutral btn-icon mr-4"
                        color="default"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="btn-inner--icon mr-1">
                          <img
                            alt="..."
                            src={
                              require("assets/img/icons/common/github.svg")
                                .default
                            }
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
                            src={
                              require("assets/img/icons/common/google.svg")
                                .default
                            }
                          />
                        </span>
                        <span className="btn-inner--text">Google</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody className="px-lg-5 py-lg-5">
                    <div className="text-center text-muted mb-4">
                      <small>Or sign up with credentials</small>
                    </div>
                    <Form role="form">
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-id-card-o" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="User name" type="text" onChange={(e) => registerForm.username = e.target.value} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-user" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Name" type="text" onChange={(e) => registerForm.name = e.target.value} />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Email" type="email" onChange={(e) => registerForm.email = e.target.value} />
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
                            autoComplete="off" onChange={(e) => registerForm.password = e.target.value}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-phone" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Phone" type="text" onChange={(e) => registerForm.phone = e.target.value} />
                        </InputGroup>
                      </FormGroup>
                      <Picker refe={state} />
                      <div className="text-center">
                        <Button
                          className="mt-4"
                          color="primary"
                          type="button"
                          onClick={handleRegister}
                        >
                          Create account
                        </Button>
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
}

export default Register;
