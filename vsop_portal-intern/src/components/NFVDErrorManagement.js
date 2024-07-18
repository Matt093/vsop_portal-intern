import { Container, Button, Col, Row, Spinner, Modal } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "../routes/api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCsv,
  faCircleExclamation,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import UserContext from "../context/UserContext";
import "../assets/prism.css";
import "../assets/vzbootstrap.min.css";

function NFVDErrorManagement() {
  const [errors, setErrors] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [newErrorMessage, setNewErrorMessage] = useState("");
  const [newErrorCount, setNewErrorCount] = useState("");
  const [newErrorDate, setNewErrorDate] = useState("");
  const dt = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleClose = () => setShowConfirmModal(false);
  const handleShow = () => setShowConfirmModal(true);

  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/nfvd-errors", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      let errorsList = [];
      let errorMessagesList = [];
      response.data.map((error) => {
        const dateN = new Date(error.date);
        console.log(dateN);
        const newDate = dateN.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        });
        //setErrorMessages((oldList) => [...oldList, error.error_message]);
        errorMessagesList.push(error.error_message);
        errorsList.push({
          id: error.id,
          error_message: error.error_message,
          date: newDate,
          count: error.count,
        });
      });
      const removeDupes = fetchDuplicates(errorMessagesList);
      console.log(removeDupes);
      setErrorMessages(removeDupes);
      console.log(errorsList);
      setErrors(errorsList);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const addError = async (error_message, date, count) => {
    try {
      const response = await axios.post(
        "/nfvd-error",
        JSON.stringify({ error_message, date, count }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const updateError = async (id, count) => {
    try {
      const response = await axios.put(
        "/update-error",
        JSON.stringify({ id, count }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDuplicates = (arr) => {
    const dupes = arr.filter(
      (
        (s) => (v) =>
          s.has(v) || !s.add(v)
      )(new Set())
    );

    let result = dupes.filter(
      (dupe, index) => index === dupes.findIndex((other) => dupe === other)
    );
    return result.sort();
  };

  const onRowEditComplete = (e) => {
    let _errors = [...errors];
    let { newData, index } = e;
    _errors = _errors.filter((obj) => {
      return obj.id !== newData.id;
    });
    _errors[index] = newData;
    updateError(newData.id, newData.count);
    setErrors(_errors);
  };

  const countEditor = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
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
            onClick={handleShow}
            style={{ marginRight: "5px" }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Error
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

  const headerTemplate = (data) => {
    return (
      <div className="flex align-items-center gap-2">
        <FontAwesomeIcon icon={faCircleExclamation} size="2x" />
        <span className="font-bold datatableGroupTitle">
          {data.error_message}
        </span>
      </div>
    );
  };

  return (
    <Container>
      <h1 className="mb-3 text-start bannertitle">
        NFVD Error Management <hr />
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
          value={errors}
          ref={dt}
          paginator
          rows={50}
          size="small"
          filterDisplay="menu"
          emptyMessage="No Errors Found."
          scrollable
          style={{ fontSize: "12px", marginLeft: "50px" }}
          header={header}
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          exportFilename="NFVD Error Counts"
          rowGroupMode="subheader"
          groupRowsBy="error_message"
          rowGroupHeaderTemplate={headerTemplate}
          sortMode="single"
          sortField="error_message"
          sortOrder={1}
        >
          <Column
            field="error_message"
            header="Description"
            filter
            filterPlaceholder="Search by error"
            sortable
          />
          <Column
            field="date"
            header="Date"
            filter
            filterPlaceholder="Search by date"
            sortable
          />
          <Column
            field="count"
            header="Count"
            filter
            filterPlaceholder="Search by count"
            editor={(options) => countEditor(options)}
            sortable
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
            <Modal.Title>Add Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row style={{ marginLeft: "10px", marginRight: "10px" }}>
              Error Message:<br></br>
              <Dropdown
                style={{ zIndex: "1100" }}
                value={newErrorMessage}
                options={errorMessages}
                onChange={(e) => setNewErrorMessage(e.target.value)}
                placeholder="Select an existing error"
              />
            </Row>
            <Row style={{ marginLeft: "10px", marginRight: "10px" }}>
              <span style={{ margin: "10px 0px 10px 200px" }}>OR</span>{" "}
              <br></br>
              <InputTextarea
                value={newErrorMessage}
                onChange={(e) => setNewErrorMessage(e.target.value)}
                rows={5}
                cols={30}
                placeholder="Enter a new error"
              />
            </Row>
            <hr></hr>
            <Row style={{ marginLeft: "0px", marginTop: "10px" }}>
              <Col>
                Date:<br></br>
                <Calendar
                  style={{ zIndex: "1100" }}
                  value={newErrorDate}
                  onChange={(e) => setNewErrorDate(e.target.value)}
                  dateFormat="MM-yy"
                />
              </Col>
              <Col>
                Count:<br></br>
                <InputText
                  value={newErrorCount}
                  onChange={(e) => setNewErrorCount(e.target.value)}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer style={{ marginTop: "-15px" }}>
            <Button
              className="btn btn-secondary"
              onClick={() => {
                handleClose();
                setNewErrorCount("");
                setNewErrorDate("");
                setNewErrorMessage("");
              }}
            >
              Close
            </Button>
            <Button
              className="btn btn-primary"
              onClick={() => {
                if (
                  newErrorMessage !== "" &&
                  newErrorDate !== "" &&
                  newErrorCount !== ""
                ) {
                  addError(
                    newErrorMessage.replace(/'/g, "\\'"),
                    newErrorDate.toISOString().split("T")[0],
                    newErrorCount
                  );
                  window.location.reload();
                }
              }}
            >
              Add
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </Container>
  );
}
export default NFVDErrorManagement;
