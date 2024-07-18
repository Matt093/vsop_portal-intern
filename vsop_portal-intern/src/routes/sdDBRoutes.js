module.exports = (app) => {
  const { Client, Pool } = require("pg");
  const dotenv = require("dotenv");
  dotenv.config();

  const client = new Pool({
    host: "", //process.env.REACT_APP_SD_DB,
    user: "sd",
    password: "", //process.env.REACT_APP_SD_API_PASSWORD,
    database: "sd",
    port: 5445,
  });

  app.post("/sd-names", async (req, res) => {
    const app = req.body.app;
    let sql = "";
    if (app == "SAMSUNG_VCU") {
      sql =
        "select servicename as name from dde_service where (servicename like '%AUPF%' or servicename like '%ACPF%')  and childtype = 'SERVICE' and childname = 'NetworkFunction';";
    } else if (app == "QWILT") {
      sql =
        "select servicename as name from dde_service where servicename like '%vOCN-L-QW-CACHE-00%' and childtype = 'SERVICE';";
    } else if (app == "ERICSSON_AMF") {
      sql =
        "select servicename as name from dde_service where servicename like '%amf-y-ec%' and childtype = 'SERVICE';";
    } else if (app == "ERICSSON_VCU") {
      sql =
        "select servicename as name from dde_service where servicename like '%EXILISVCU%' and childtype = 'SERVICE';";
    } else if (app == "ERICSSON_SMF") {
      sql =
        "select servicename as name from dde_service where servicename like '%csmf-y-ec%' and childtype = 'SERVICE';";
    } else if (app == "CALEA_CPAG") {
      sql =
        "select servicename as name from dde_service where servicename like '%cpag-y-s8%' and childtype = 'SERVICE';";
    } else {
      console.log("No match found");
    }
    client.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data.rows);
        console.log(data.rows);
      }
    });
  });
};
