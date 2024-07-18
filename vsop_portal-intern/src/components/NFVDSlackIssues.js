import { Container, Button, Col, Row, Spinner, Modal } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState, useRef } from "react";
import axios from "../routes/api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import "../assets/prism.css";
import "../assets/vzbootstrap.min.css";

function NFVDSlackIssues() {
  const [issues, setIssues] = useState([]);
  const dt = useRef(null);

  // use effect calls the page to re render everytime its loaded then it fetches data from the api that containts the slack issues
  useEffect(() => {
    fetchSlackIssues();
  }, []);

  
  const fetchSlackIssues = async () => {
    try {
      const response = await axios.get("/api/slack-issues", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setIssues(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const header = (
    <>
      <Row>
        <Col style={{ textAlign: "right" }}>
          <Button
            type="button"
            className="btn-small"
            rounded
            onClick={() => exportCSV(false)}
          >
            <FontAwesomeIcon icon={faFileCsv} />
          </Button>
        </Col>
      </Row>
    </>
  );

  return (
    <Container>
      <h1 className="mb-3 text-start bannertitle">
        NFVD Slack Issues <hr />
      </h1>
      <DataTable
        value={issues}
        ref={dt}
        paginator
        rows={10}
        size="small"
        filterDisplay="menu"
        emptyMessage="No Issues Found."
        scrollable
        style={{ fontSize: "12px", marginLeft: "50px" }}
        header={header}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        exportFilename="NFVD Slack Issues"
      >
        <Column
          field="inc_number"
          header="Incident Number"
          filter
          filterPlaceholder="Search by incident number"
          sortable
          headerStyle={{ wordBreak: "normal" }}
          style={{ wordBreak: "break-all", width: "80px" }}
        />
        <Column
          field="createDate"
          header="Creation Date"
          filter
          filterPlaceholder="Search by creation date"
          sortable
          style={{ width: "140px" }}
        />
        <Column
          field="Urgency"
          header="Urgency"
          filter
          filterPlaceholder="Search by urgency"
          sortable
          headerStyle={{ wordBreak: "normal" }}
          style={{ wordBreak: "break-all", width: "140px" }}
        />
        <Column
          field="Category"
          header="Category"
          filter
          filterPlaceholder="Search by category"
          sortable
          headerStyle={{ wordBreak: "normal" }}
          style={{ wordBreak: "break-all", width: "125px" }}
        />
        <Column
          field="Comment"
          header="Comment"
          filter
          filterPlaceholder="Search by comment"
          sortable
          headerStyle={{ wordBreak: "normal" }}
          style={{ wordBreak: "break-all", width: "160px" }}
        />
      </DataTable>
    </Container>
  );
}
export default NFVDSlackIssues;
