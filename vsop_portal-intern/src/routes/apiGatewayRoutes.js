var ldap = require("ldapjs");

module.exports = (app) => {
  const fs = require("fs");
  let Client = require("ssh2-sftp-client");
  const dotenv = require("dotenv");
  dotenv.config();

  app.post("/fast-discovery-org", async (req, res) => {
    let sftp = new Client();
    const orgName = req.body.org;
    const email = req.body.user.mail;

    const file =
      "/var/www/html/nfvd/portal/logs/vdcs/fast_discoveries_requests.log";
    const TS = `[${new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")}]`;
    const timestamp = TS.replace(/-/g, "");
    console.log(timestamp);

    sftp
      .connect({
        host: "63.56.134.177",
        username: "root",
        privateKey: fs.readFileSync("/root/.ssh/pem_id_rsa"),
      })
      .then(() => {
        console.log("Connected");
        const jobid = (new Date().getTime() / 1000)
          .toString()
          .replace(".", "-");
        const filename = "fast_discover_org_request_" + jobid;
        const jobFile = "/var/www/html/nfvd/portal/logs/jobs/" + filename;
        console.log(jobFile);
        const writeStreamOptions = {
          flags: "a", // w - write and a - append
          encoding: null, // use null for binary files
          mode: 0o666, // mode to use for created file (rwx)
          autoClose: true, // automatically close the write stream when finished
        };
        sftp.append(
          Buffer.from(timestamp + ": " + filename + "\n"),
          file,
          writeStreamOptions
        );
        console.log(
          '{"org":"' +
            orgName +
            '","email":"' +
            email +
            '","state":"requested","jobid":"' +
            jobid +
            '","requested":"' +
            TS.replace("[", "").replace("]", "") +
            '"}\n'
        );
        sftp.append(
          Buffer.from(
            '{"org":"' +
              orgName +
              '","email":"' +
              email +
              '","state":"requested","jobid":"' +
              jobid +
              '","requested":"' +
              TS.replace("[", "").replace("]", "") +
              '"}\n'
          ),
          jobFile,
          writeStreamOptions
        );
      })
      .catch((err) => {
        console.log(err, "catch error");
        res.status(400).send("Unable to submit discovery");
      });
    res.status(200).send("Discovery submitted");
  });

  app.post("/fast-discovery-vdc", async (req, res) => {
    let sftp = new Client();
    const vdcs = req.body.vdcs;
    const email = req.body.user.mail;
    let vdcsList = [];
    let vdcsListString = [];
    vdcs.map((item) => {
      vdcsList.push({ vdc: item.vdc });
      vdcsListString.push(item.vdc);
    });
    const vdcsJSONString = JSON.stringify(vdcsList);
    const vdcsString = vdcsListString.toString();

    const file =
      "/var/www/html/nfvd/portal/logs/vdcs/fast_discoveries_requests.log";
    const TS = `[${new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")}]`;
    const timestamp = TS.replace(/-/g, "");

    sftp
      .connect({
        host: "63.56.134.177",
        username: "root",
        privateKey: fs.readFileSync("/root/.ssh/pem_id_rsa"),
      })
      .then(() => {
        console.log("Connected");
        const jobid = (new Date().getTime() / 1000)
          .toString()
          .replace(".", "-");
        const filename = "fast_discover_request_" + jobid;
        const jobFile = "/var/www/html/nfvd/portal/logs/jobs/" + filename;
        const writeStreamOptions = {
          flags: "a", // w - write and a - append
          encoding: null, // use null for binary files
          mode: 0o666, // mode to use for created file (rwx)
          autoClose: true, // automatically close the write stream when finished
        };
        sftp.append(
          Buffer.from(timestamp + ": " + filename + "," + vdcsString + "\n"),
          file,
          writeStreamOptions
        );
        console.log(
          '{"vdcs":' +
            vdcsJSONString +
            ',"email":"' +
            email +
            '","state":"requested","jobid":"' +
            jobid +
            '","requested":"' +
            TS +
            '"}\n'
        );
        sftp.append(
          Buffer.from(
            '{"vdcs":' +
              vdcsJSONString +
              ',"email":"' +
              email +
              '","state":"requested","jobid":"' +
              jobid +
              '","requested":"' +
              TS +
              '"}\n'
          ),
          jobFile,
          writeStreamOptions
        );
      })
      .catch((err) => {
        console.log(err, "catch error");
        res.status(400).send("Unable to submit discovery");
      });
    res.status(200).send("Discovery submitted");
  });

  app.post("/takeover", async (req, res) => {
    let sftp = new Client();
    const vnfs = req.body.vnfs;
    const sd_account = req.body.account;
    const nfvd_org_name = req.body.org;
    const nfvd_vdc_name = req.body.vdc;
    const nfvd_vnfg_name = req.body.vnfg;
    const email = req.body.user.mail;
    let vnfsList = [];
    let vnfsListString = [];
    vnfs.map((item) => {
      vnfsList.push({
        nf_instance_name: item.name,
        nf_instance_id: item.id,
        nf_descriptor_id: item.template,
      });
      vnfsListString.push(item.name);
    });
    const vnfsJSONString = JSON.stringify(vnfsList);
    const vnfsString = vnfsListString.toString();

    const file = "/var/www/html/nfvd/portal/logs/vdcs/takeover_requests.log";
    const TS = `[${new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")}]`;
    const timestamp = TS.replace(/-/g, "");
    const currentDate = new Date();
    const formattedDate =
      currentDate.getDate() +
      "-" +
      currentDate.toLocaleString("default", { month: "short" }) +
      "-" +
      currentDate.getFullYear() +
      " " +
      currentDate.getHours() +
      ":" +
      currentDate.getMinutes() +
      ":" +
      currentDate.getSeconds() +
      "." +
      currentDate.getMilliseconds();
    console.log(formattedDate);

    sftp
      .connect({
        host: "63.56.134.177",
        username: "root",
        privateKey: fs.readFileSync("/root/.ssh/pem_id_rsa"),
      })
      .then(() => {
        console.log("Connected");
        const jobid = (new Date().getTime() / 1000)
          .toString()
          .replace(".", "-");
        const filename = "takeover_request_" + jobid;
        const jobFile = "/var/www/html/nfvd/portal/logs/jobs/" + filename;
        const writeStreamOptions = {
          flags: "a", // w - write and a - append
          encoding: null, // use null for binary files
          mode: 0o666, // mode to use for created file (rwx)
          autoClose: true, // automatically close the write stream when finished
        };
        console.log(timestamp + ": " + filename + "," + vnfsString + "\n");
        sftp.append(
          Buffer.from(timestamp + ": " + filename + "," + vnfsString + "\n"),
          file,
          writeStreamOptions
        );
        console.log(
          '{"email":"' +
            email +
            '","state":"requested","jobid":"' +
            jobid +
            '","requested":"' +
            formattedDate +
            '","sd_account":"' +
            sd_account +
            '","nfvd_org_name":"' +
            nfvd_org_name +
            '","nfvd_vdc_name":"' +
            nfvd_vdc_name +
            '","nfvd_vnfg_name":"' +
            nfvd_vnfg_name +
            '","takeovers":' +
            vnfsJSONString +
            "}\n"
        );
        sftp.append(
          Buffer.from(
            '{"email":"' +
              email +
              '","state":"requested","jobid":"' +
              jobid +
              '","requested":"' +
              formattedDate +
              '","sd_account":"' +
              sd_account +
              '","nfvd_org_name":"' +
              nfvd_org_name +
              '","nfvd_vdc_name":"' +
              nfvd_vdc_name +
              '","nfvd_vnfg_name":"' +
              nfvd_vnfg_name +
              '","takeovers":' +
              vnfsJSONString +
              "}\n"
          ),
          jobFile,
          writeStreamOptions
        );
      })
      .catch((err) => {
        console.log(err, "catch error");
        res.status(400).send("Unable to submit takeover");
      });
    res.status(200).send("Takeover submitted");
  });

  app.post("/onboard", async (req, res) => {
    let sftp = new Client();
    const vendor = req.body.vendor;
    const org = req.body.org;
    const adomGroups = req.body.adomGroups;
    const vdcs = req.body.vdcs;
    const email = req.body.user.mail;
    let vdcsList = [];
    let adomList = [];
    //let vnfsListString = [];

    adomGroups.map((adom) => {
      adomList.push(adom.group);
    });
    const adomsJSONString = JSON.stringify(adomList);

    vdcs.map((vdc) => {
      vdcsList.push(vdc.name);
      //vnfsListString.push(item.name);
    });
    const vdcsJSONString = JSON.stringify(vdcsList);

    //const vnfsString = vnfsListString.toString();
    //const file = "/var/www/html/nfvd/portal/logs/vdcs/takeover_requests.log";
    const currentDate = new Date();
    const formattedDate =
      currentDate.getDate() +
      "-" +
      currentDate.toLocaleString("default", { month: "short" }) +
      "-" +
      currentDate.getFullYear() +
      " " +
      currentDate.getHours() +
      ":" +
      currentDate.getMinutes() +
      ":" +
      currentDate.getSeconds() +
      "." +
      currentDate.getMilliseconds();
    console.log(formattedDate);

    sftp
      .connect({
        host: "63.56.134.177",
        username: "root",
        privateKey: fs.readFileSync("/root/.ssh/pem_id_rsa"),
      })
      .then(() => {
        console.log("Connected");
        const jobid = (new Date().getTime() / 1000)
          .toString()
          .replace(".", "-");
        const filename = "vsop_onboard_request_" + jobid;
        const jobFile = "/var/www/html/nfvd/portal/logs/jobs/" + filename;
        const writeStreamOptions = {
          flags: "a", // w - write and a - append
          encoding: null, // use null for binary files
          mode: 0o666, // mode to use for created file (rwx)
          autoClose: true, // automatically close the write stream when finished
        };
        console.log(
          '{"email":"' +
            email +
            '","state":"requested","requested":"' +
            formattedDate +
            '","vendor":"' +
            vendor +
            '","org_name":"' +
            org +
            '","adom":' +
            adomsJSONString +
            ',"vdcs":' +
            vdcsJSONString +
            "}\n"
        );
        sftp.append(
          Buffer.from(
            '{"email":"' +
              email +
              '","state":"requested","requested":"' +
              formattedDate +
              '","vendor":"' +
              vendor +
              '","org_name":"' +
              org +
              '","adom":' +
              adomsJSONString +
              ',"vdcs":' +
              vdcsJSONString +
              "}\n"
          ),
          jobFile,
          writeStreamOptions
        );
      })
      .catch((err) => {
        console.log(err, "catch error");
        res.status(400).send("Unable to submit onboard request");
      });
    res.status(200).send("Onboard request submitted");
  });

  app.post("/adom-groups", async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Content-Type", "application/json");
    const usrid = "svc-vzo";
    //const usrid = req.body.username;
    const usr = usrid + "@uswin.ad.vzwcorp.com";
    const pwd = "";//process.env.REACT_SVC_VZO_PASS;
    //const pwd = req.body.password;
    const base =
      "OU=General Population,OU=Accounts,OU=Wireline,DC=uswin,DC=ad,DC=vzwcorp,DC=com";

    const usrdn = "uid=" + usrid + "," + base;
    let full_name = [];
    let adomGroups = [];
    let dn = "";

    var client = ldap.createClient({
      url: "ldap://uswinlb.verizon.com",
    });

    var client2 = ldap.createClient({
      url: "ldap://uswinlb.verizon.com",
    });

    var opts = {
      filter: "(cn=" + "grajjo6" + ")", // and search
      attributes: ["distinguishedName"],
      scope: "sub",
    };

    client.bind(usr, pwd, function (error, result) {
      if (error) {
        console.error("Error authenticating", error);
        res.status(500).json({ error: "Error authenticating" });
      } else {
        console.log("Success");
        console.log(usr);
        client.search(
          "DC=uswin,DC=ad,DC=vzwcorp,DC=com",
          opts,
          function (err, result) {
            console.log("Searching...");
            result.on("searchEntry", function (entry) {
              console.log(
                "I found a result in searchEntry",
                JSON.stringify(entry.attributes)
              );
              full_name = JSON.stringify(entry.attributes);
              let new_name = JSON.parse(full_name);
              dn = new_name[0].values[0];
              console.log(dn);

              var opts2 = {
                filter: "(member=" + dn + ")", // and search
                attributes: ["cn"],
                scope: "sub",
              };

              client2.bind(usr, pwd, function (error, result) {
                if (error) {
                  console.error("Error authenticating", error);
                  res.status(500).json({ error: "Error authenticating" });
                } else {
                  console.log("Success");
                  console.log(usr);
                  client2.search(
                    "OU=Groups,DC=uswin,DC=ad,DC=vzwcorp,DC=com",
                    opts2,
                    function (err, result) {
                      console.log("Searching...");
                      result.on("searchEntry", function (entry) {
                        adomGroups.push(entry.attributes);
                      });

                      result.on("error", function (error) {
                        console.error("Error: " + error.message);
                        res.json({
                          usrid: usrid,
                          error: error.message,
                        });
                      });

                      result.on("end", function (result) {
                        console.log(adomGroups);
                        let newList = JSON.stringify(adomGroups);
                        res.json(JSON.parse(newList));
                      });
                    }
                  );
                }
              });
            });

            result.on("error", function (error) {
              console.error("Error: " + error.message);
              res.json({
                usrid: usrid,
                error: error.message,
              });
            });

            result.on("end", function (result) {
              console.log(JSON.parse(full_name));
            });
          }
        );
      }
    });

    client.unbind(function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log("Client disconnected");
      }
    });

    client.on("error", (err) => {
      console.log(err.message); // this will be the ECONNRESET message
    });

    client2.unbind(function (error) {
      if (error) {
        console.log(error.message);
      } else {
        console.log("Client disconnected");
      }
    });

    client2.on("error", (err) => {
      console.log(err.message); // this will be the ECONNRESET message
    });
  });
};
