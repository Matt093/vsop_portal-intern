module.exports = (app) => {
  const { Client, Pool } = require("pg");
  const dotenv = require("dotenv");
  dotenv.config();

  const client = new Pool({
    host: "", //process.env.REACT_APP_NFVD_DB_VIP,
    user: "nfvd",
    password: "nfvd",
    database: "nfvdhadb",
    port: 5444,
  });

  app.post("/nfvd-template-version", async (req, res) => {
    const templateid = req.body.templateid;
    const sql =
      "select att_value as software_version,nfvd_template.name from nfvd_def_attribute,nfvd_template_att_value,nfvd_template,nfvd_template_tree where nfvd_template.id = nfvd_template_tree.template_id and nfvd_template_att_value.tem_art_id = nfvd_template_tree.tem_art_id and nfvd_template_att_value.att_id = nfvd_def_attribute.id and nfvd_template.id  = '" +
      templateid +
      "' and attribute = 'software_version'";
    client.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data.rows);
        console.log(data.rows);
      }
    });
  });

  app.post("/vnf-status", async (req, res) => {
    const vnfname = req.body.vnfname;
    const sql =
      "select nfvd_def_art_status.status as status, nfvd_instance.name from nfvd_def_art_status join nfvd_instance_artifact on nfvd_instance_artifact.status_id=nfvd_def_art_status.id join nfvd_instance_tree on nfvd_instance_tree.ins_art_id=nfvd_instance_artifact.id join nfvd_instance on nfvd_instance.id=nfvd_instance_tree.instance_id where name = '" +
      vnfname +
      "' and nfvd_instance_artifact.identifier = 'VNF-0'";
    client.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data.rows);
        console.log(data.rows);
      }
    });
  });

  app.post("/nfvd-names", async (req, res) => {
    const app = req.body.app;
    let sql = "";
    if (app == "SAMSUNG_VCU") {
      sql =
        "select name, id from nfvd_instance where (name like '%AUPF%' or name like '%ACPF%') and instance_type = 'vnf' and name not like '202%';";
    } else if (app == "QWILT") {
      sql =
        "select name, id from nfvd_instance where name like '%vOCN-L-QW-CACHE-00-QN%' and instance_type = 'vnf' group by name, id;";
    } else if (app == "ERICSSON_AMF") {
      sql =
        "select name,id, count(1) from nfvd_instance where name like '%amf-y-ec%' and instance_type = 'vnf' group by name, id;";
    } else if (app == "ERICSSON_VCU") {
      sql =
        "select name,id, count(1) from nfvd_instance where name like '%EXILISVCU%' and instance_type = 'vnf' group by name, id;";
    } else if (app == "ERICSSON_SMF") {
      sql =
        "select name,id, count(1) from nfvd_instance where name like '%csmf-y-ec%' and instance_type = 'vnf' group by name, id;";
    } else if (app == "CALEA_CPAG") {
      sql =
        "select name,id, count(1) from nfvd_instance where name like '%cpag-y-s8%' and instance_type = 'vnf' group by name, id;";
    } else {
      console.log("No app match");
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
