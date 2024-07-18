import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Col, Row } from "react-bootstrap";

const SidebarLayout = () => {
  return (
    <main className="App">
      <Row>
        <Col sm={3} md={3} lg={3} xl={2}>
          <Sidebar />
        </Col>
        <Col sm={9} md={9} lg={9} xl={10}>
          <Outlet />
        </Col>
      </Row>
    </main>
  );
};

export default SidebarLayout;
