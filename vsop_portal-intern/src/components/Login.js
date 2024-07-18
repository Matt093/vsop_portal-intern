import React from "react";
import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Container, Form, Row, Card, Col } from "react-bootstrap";
import logo from "../assets/verizon-checkmark.png";

import axios from "../routes/api/axios";
import UserContext from "../context/UserContext";

const LOGIN_URL = "/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setUser] = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrorMessage("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      //console.log(response.data);
      const user = {
        uswin: response.data.user[0].values[0],
        displayName: response.data.user[1].values[0],
        employeeNumber: response.data.user[2].values[0],
        employeeID: response.data.user[3].values[0],
        mail: response.data.user[4].values[0],
        vzPreferredFullName: response.data.user[5].values[0],
        token: response?.data?.accessToken,
      };
      setUser(user);
      window.localStorage.setItem("USER_OBJECT", JSON.stringify(user));
      setUsername("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setErrorMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setErrorMessage("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrorMessage("Unauthorized");
      } else if (err.response?.status === 500) {
        setErrorMessage("Invalid Credentials");
      } else {
        setErrorMessage("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <div className="border border-3 border-dark"></div>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4" style={{ textAlign: "center" }}>
                  <span>
                    <img
                      src={logo}
                      style={{
                        width: "20px",
                        margin: "0px 10px 10px 0px",
                      }}
                      alt=""
                    />
                    <h2
                      className="fw-bold mb-2"
                      style={{
                        fontFamily: "VerizonDSBold",
                        fontSize: 24,
                        display: "inline",
                      }}
                    >
                      VSOP Portal
                    </h2>
                  </span>

                  <div className="mb-3"></div>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupUsername">
                      <Form.Control
                        type="text"
                        placeholder="USWIN Username"
                        onChange={(e) => setUsername(e.target.value)}
                        ref={userRef}
                        autoComplete="off"
                        value={username}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                      />
                      <p
                        ref={errRef}
                        className={errorMessage ? "errmsg" : "offscreen"}
                        aria-live="assertive"
                      >
                        {errorMessage}
                      </p>
                    </Form.Group>
                    <div className="d-grid">
                      <Button variant="danger" type="submit">
                        Sign In
                      </Button>
                    </div>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
