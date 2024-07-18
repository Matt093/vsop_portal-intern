import React from "react";
import { Container, Row, Card, Col } from "react-bootstrap";
import logo from "../assets/verizon-checkmark.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function PageNotFound() {
  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={8} xs={12}>
            <Card style={{ backgroundColor: "#fbe4d7", border: "none" }}>
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
                  <div
                    className="d-grid"
                    style={{
                      width: "30px",
                      margin: "auto",
                      paddingBottom: "10px",
                      paddingTop: "20px",
                      display: "block",
                    }}
                  >
                    <FontAwesomeIcon icon={faTriangleExclamation} size="2x" />
                  </div>
                  <div className="d-grid">
                    <h4
                      style={{
                        fontFamily: "VerizonDSBold",
                        fontSize: 24,
                        display: "inline",
                        fontWeight: "bolder",
                        paddingBottom: "10px",
                      }}
                    >
                      Page Not Found
                    </h4>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
