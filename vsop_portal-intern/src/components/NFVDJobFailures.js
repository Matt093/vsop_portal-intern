import { Container, Button, Col, Row, Spinner, Modal } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "../routes/api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../context/UserContext";
import "../assets/prism.css";
import "../assets/vzbootstrap.min.css";

function NFVDJobFailures() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uswinErrors, setUswinErrors] = useState([]);
  const [user] = useContext(UserContext);
  const [checked, setChecked] = useState(false);
  const [bulkError, setBulkError] = useState("");
  const [bulkComment, setBulkComment] = useState("");
  const [bulkCategory, setBulkCategory] = useState("");
  const dt = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleClose = () => setShowConfirmModal(false);
  const handleShow = () => setShowConfirmModal(true);
  const [categories] = useState([
    "",
    "ATLAS",
    "NFVD",
    "Operator",
    "SD",
    "VCP",
    "VNFMP",
  ]);

  const [bulkcategories] = useState([
    "",
    "ATLAS",
    "NFVD",
    "Operator",
    "SD",
    "VCP",
    "VNFMP",
  ]);

  useEffect(() => {
    fetchFailedJobs();
    if (user) {
      fetchFailedJobsByUswin(user.uswin);
    }
  }, []);

  const fetchFailedJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/failed-jobs", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setErrors(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const fetchFailedJobsByUswin = async (uswin) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/failed-jobs-by-username",
        JSON.stringify({ uswin }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUswinErrors(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const updateFailure = async (id, notes, category) => {
    try {
      const response = await axios.put(
        "/update-failure",
        JSON.stringify({ id, notes, category }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //setUswinErrors(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onRowEditComplete = (e) => {
    let _errors = [...errors];
    let { newData, index } = e;
    _errors = _errors.filter((obj) => {
      return obj.id !== newData.id;
    });
    _errors[index] = newData;
    updateFailure(newData.id, newData.notes, newData.category);
    setErrors(_errors);
  };

  const bulkUpdate = async (error, comment, category) => {
    try {
      const response = await axios.put(
        "/update-failure-bulk",
        JSON.stringify({ error, comment, category }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      handleClose();
    } catch (err) {
      console.log(err);
    }
    console.log("Bulk of Failures' Comments Updated");
  };

  const notesEditor = (options) => {
    return (
      <InputTextarea
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        rows={5}
        cols={30}
      />
    );
  };

  const categoryEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={categories}
        onChange={(e) => options.editorCallback(e.target.value)}
        placeholder="Select a category"
      />
    );
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const header = (
    <>
      <Row>
        <Col style={{ textAlign: "left" }}>
          <InputSwitch
            style={{ float: "left" }}
            checked={checked}
            onChange={(e) => setChecked(e.value)}
          />
          <div
            className="toggleText"
            style={{ float: "left", marginTop: "4px", marginLeft: "8px" }}
          >
            Show Only My Failures
          </div>
        </Col>
        <Col style={{ textAlign: "right" }}>
          <Button
            type="button"
            className="btn-small"
            rounded
            onClick={handleShow}
            style={{ marginRight: "5px" }}
          >
            Bulk Update
          </Button>
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
        NFVD Job Failures <hr />
      </h1>
      {loading ? (
        <Spinner
          style={{
            marginTop: "10px",
            alignSelf: "center",
          }}
          animation="border"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <DataTable
          value={checked ? uswinErrors : errors}
          ref={dt}
          paginator
          rows={10}
          size="small"
          filterDisplay="menu"
          emptyMessage="No Failures Found."
          scrollable
          style={{ fontSize: "12px", marginLeft: "50px" }}
          header={header}
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          exportFilename="NFVD Job Failures"
        >
          <Column
            field="id"
            header="Id"
            filter
            filterPlaceholder="Search by id"
            sortable
            headerStyle={{ wordBreak: "normal" }}
            style={{ wordBreak: "break-all", width: "80px" }}
          />
          <Column
            field="start_time"
            header="Start Time"
            filter
            filterPlaceholder="Search by start time"
            sortable
            style={{ width: "140px" }}
          />
          <Column
            field="job_name"
            header="Job Name"
            filter
            filterPlaceholder="Search by job name"
            sortable
            headerStyle={{ wordBreak: "normal" }}
            style={{ wordBreak: "break-all", width: "140px" }}
          />
          <Column
            field="operation"
            header="Operation"
            filter
            filterPlaceholder="Search by operation"
            sortable
            headerStyle={{ wordBreak: "normal" }}
            style={{ wordBreak: "break-all", width: "125px" }}
          />
          <Column
            field="username"
            header="Username"
            filter
            filterPlaceholder="Search by username"
            sortable
            headerStyle={{ wordBreak: "normal" }}
            style={{ wordBreak: "break-all", width: "160px" }}
          />
          <Column
            field="error_description"
            header="Description"
            filter
            filterPlaceholder="Search by error"
            sortable
            headerStyle={{ wordBreak: "normal" }}
            style={{ wordBreak: "break-all", width: "180px" }}
          />
          <Column
            field="notes"
            header="Operation's Comment"
            filter
            filterPlaceholder="Search by comments"
            editor={(options) => notesEditor(options)}
            sortable
            headerStyle={{ wordBreak: "normal" }}
            style={{ wordBreak: "break-all", width: "150px" }}
          />
          <Column
            field="category"
            header="Category"
            filter
            filterPlaceholder="Search by category"
            editor={(options) => categoryEditor(options)}
            sortable
            style={{ width: "185px" }}
          />
          <Column
            rowEditor
            headerStyle={{ width: "8%", minWidth: "4rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
        </DataTable>
      )}
      <Modal show={showConfirmModal} onHide={handleClose}>
        <div className="modal-content-wrapper">
          <Modal.Header closeButton>
            <Modal.Title>Bulk Update of Comments & Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row style={{ marginLeft: "10px", marginRight: "10px" }}>
              Common Error of the Bulk:<br></br>
              <InputTextarea
                value={bulkError}
                onChange={(e) => setBulkError(e.target.value)}
                rows={5}
                cols={30}
                placeholder="Enter the common error for the bulk of failures"
              />
            </Row>
            <hr></hr>
            <Row style={{ marginLeft: "0px", marginTop: "10px" }}>
              <Col>
                Comments:<br></br>
                <InputTextarea
                  value={bulkComment}
                  onChange={(e) => setBulkComment(e.target.value)}
                  rows={5}
                  cols={30}
                  placeholder="Enter a comment for the bulk of failures"
                />
              </Col>
              <Col>
                Category:<br></br>
                <Dropdown
                  style={{ zIndex: "1100" }}
                  value={bulkCategory}
                  options={bulkcategories}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  placeholder="Select a category"
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer style={{ marginTop: "-15px" }}>
            <Button className="btn btn-secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              className="btn btn-primary"
              onClick={() => {
                if (bulkError !== "") {
                  bulkUpdate(bulkError, bulkComment, bulkCategory);
                  window.location.reload();
                }
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </Container>
  );
}
export default NFVDJobFailures;
