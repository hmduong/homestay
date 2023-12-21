import { useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";
import { useTranslation } from "react-i18next";

function Register() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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
    //validatorr
    if (registerForm.username && registerForm.password && registerForm.phone && registerForm.email && role) {
      setLoading(true)
      const response = await signup(params);
      if (response?.token) {
        window.location.pathname = '/login'
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
    leftName: t('authAction.visitor'),
    rightName: t('authAction.owner')
  }
  return (
    <>
      <main>
        <section className="section section-shaped section-lg" style={{ height: "100vh", padding: 0 }}>
          <DarkBubbleBackground />
          <Container className="pt-lg-4">
            <Row className="register-wrapper">
              <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                  {loading ? <Loading /> : <>
                    <CardBody className="px-lg-5 py-lg-5">
                      <h4 className="text-center text-muted mb-4">
                        {t('authAction.signUp')}
                      </h4>
                      <Form role="form">
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="fa fa-id-card-o" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder={t('authAction.userName')} type="text" onChange={(e) => registerForm.username = e.target.value} />
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="fa fa-user" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder={t('authAction.name')} type="text" onChange={(e) => registerForm.name = e.target.value} />
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
                              placeholder={t('authAction.password')}
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
                            <Input placeholder={t('authAction.phone')} type="text" onChange={(e) => registerForm.phone = e.target.value} />
                          </InputGroup>
                        </FormGroup>
                        <Picker refe={state} />
                        <div className="text-center">
                          <Button
                            className="mt-2 mb-2"
                            color="primary"
                            type="button"
                            onClick={handleRegister}
                          >
                            {t('authAction.createAccount')}
                          </Button>
                        </div>
                        <div className="text-center">
                          <a className="text-light" href="/login">
                            <small>{t('authAction.goToLogin')}</small>
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
}

export default Register;
