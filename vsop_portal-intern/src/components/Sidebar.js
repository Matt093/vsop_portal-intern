import React, { useContext, useEffect } from "react";
import {
  CDBSidebar,
  CDBSidebarHeader,
  CDBSidebarMenuItem,
  CDBSidebarContent,
  CDBSidebarMenu,
  CDBSidebarFooter,
} from "cdbreact";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Accordion,
  Dropdown,
  DropdownButton,
  Card,
  Container,
} from "react-bootstrap";
import UserContext from "../context/UserContext";
import axios from "../routes/api/axios";
import logo from "../assets/Icon-on-stone.png";

const LOGOUT_URL = "/logout";

const Sidebar = () => {
  const [user, setUser] = useContext(UserContext);

  const navigate = useNavigate();
  const logout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(LOGOUT_URL, {
        withCredentials: true,
      });
      console.log("Logging out...");
      setUser("");
      console.log(user);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const data = window.localStorage.getItem("USER_OBJECT");
    console.log(JSON.parse(data));
    if (data != null) {
      setUser(JSON.parse(data));
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("USER_OBJECT", JSON.stringify(user));
  }, [user]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "scroll initial",
        position: "sticky",
        top: 0,
      }}
    >
      <CDBSidebar textColor="#000" backgroundColor="#F6F6F6">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <Container
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "-25px",
            }}
          >
            <img
              src={logo}
              alt=""
              style={{ width: "40px", margin: "0px 0px 10px 0px" }}
            />
            <h5
              className="ms-2"
              style={{
                fontFamily: "VerizonDSBold",
                fontSize: 24,
              }}
            >
              VSOP Portal
            </h5>
          </Container>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <CDBSidebarMenuItem
                    icon="fa-solid fa-user"
                    className="noHover"
                  >
                    NFVD
                  </CDBSidebarMenuItem>
                </Accordion.Header>
                <Accordion.Body
                  style={{
                    padding: "0px",
                    paddingLeft: "15px",
                  }}
                >
                  <NavLink to="/nfvd-job-failures">
                    <CDBSidebarMenuItem icon="exclamation">
                      Job Failures
                    </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/nfvd-charts">
                    <CDBSidebarMenuItem icon="chart-pie">
                      Job Failures Charts
                    </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/nfvd-error-management">
                    <CDBSidebarMenuItem icon="bug">
                      Error Management
                    </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/nfvd-slack-issues">
                    <CDBSidebarMenuItem icon="bug">
                      Slack Issues
                    </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/nfvd-slack-charts">
                    <CDBSidebarMenuItem icon="chart-pie">
                      Slack charts
                    </CDBSidebarMenuItem>
                  </NavLink>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter>
          <DropdownButton
            drop="end"
            style={{
              height: "75px",
            }}
            title={
              <div className="side-menu-footer">
                <div className="avatar">
                  <img
                    src={
                      user && user.employeeNumber
                        ? "https://profilepicture.verizon.com/apps/photoapp/ImageServlet?eid=" +
                          user.employeeNumber
                        : "https://profilepicture.verizon.com/apps/photoapp/ImageServlet?eid=1"
                    }
                    alt="user"
                  />
                </div>
                <div className="user-info">
                  <h5 className="nameFooter">
                    {" "}
                    {user && user.displayName ? user.displayName : "Anonymous"}
                  </h5>
                </div>
              </div>
            }
          >
            <Dropdown.Item href="" onClick={logout}>
              Logout
            </Dropdown.Item>
          </DropdownButton>
          <Card className="version">v1.0</Card>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
/*
<Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <CDBSidebarMenuItem
                    icon="fa-solid fa-user"
                    className="noHover"
                  >
                    NFVD Self-Service
                  </CDBSidebarMenuItem>
                </Accordion.Header>
                <Accordion.Body
                  style={{
                    padding: "0px",
                    paddingLeft: "15px",
                  }}
                >
                  <Accordion defaultActiveKey="1">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <CDBSidebarMenuItem
                          icon="fa-solid fa-building"
                          className="noHover"
                        >
                          Datacenter
                        </CDBSidebarMenuItem>
                      </Accordion.Header>
                      <Accordion.Body
                        style={{
                          padding: "0px",
                          borderBottom: "solid white",
                        }}
                      >
                        <NavLink to="/datacenter">
                          <CDBSidebarMenuItem icon="plus">
                            Create Datacenter
                          </CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/datacenter">
                          <CDBSidebarMenuItem icon="info">
                            Datacenter Info
                          </CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/datacenter">
                          <CDBSidebarMenuItem icon="search">
                            Discovery
                          </CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/datacenter">
                          <CDBSidebarMenuItem icon="cubes">
                            VDC Management
                          </CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/datacenter">
                          <CDBSidebarMenuItem icon="network-wired">
                            Network Management
                          </CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink to="/datacenter">
                          <CDBSidebarMenuItem icon="file-image">
                            Image Management
                          </CDBSidebarMenuItem>
                        </NavLink>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <NavLink to="/nfvd-users">
                    <CDBSidebarMenuItem icon="users">Users</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/rpms">
                    <CDBSidebarMenuItem icon="file-code">
                      RPMs
                    </CDBSidebarMenuItem>
                  </NavLink>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
*/

/*
<NavLink to="/">
              <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/user-activity">
              <CDBSidebarMenuItem icon="fa-solid fa-users">
                User Activity
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/project-activity">
              <CDBSidebarMenuItem icon="fa-solid fa-chart-line">
                Project Activity
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/architecture">
              <CDBSidebarMenuItem icon="fa-solid fa-sitemap">
                Architecture
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/documentation">
              <CDBSidebarMenuItem icon="fa-solid fa-file">
                Documentation
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/support">
              <CDBSidebarMenuItem icon="fa-solid fa-headset">
                Support
              </CDBSidebarMenuItem>
            </NavLink>
*/
