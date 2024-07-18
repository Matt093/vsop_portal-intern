var ldap = require("ldapjs");
const jwt = require("jsonwebtoken");
//const keys = require("../config/keys");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (app) => {
  //creates signin page
  app.post("/auth", async (req, res) => {
    // *** res.header("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    // *** req.setHeader("Access-Control-Allow-Origin", "*");
    const cookies = req.cookies;
    const usrid = req.body.username;
    const usr = usrid + "@uswin.ad.vzwcorp.com";
    const pwd = req.body.password;
    const base =
      "OU=General Population,OU=Accounts,OU=Wireline,DC=uswin,DC=ad,DC=vzwcorp,DC=com";

    const usrdn = "uid=" + usrid + "," + base;
    userAtt = {};

    var client = ldap.createClient({
      url: "ldap://uswinlb.verizon.com",
    });

    var opts = {
      filter: "(cn=" + usrid + ")", // and search
      attributes: [
        "cn",
        "displayName",
        "vzPreferredFullName",
        "employeeNumber",
        "employeeID",
        "mail",
      ],
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
              userAtt = JSON.stringify(entry.attributes);

              const accessToken = jwt.sign(
                {
                  UserInfo: {
                    username: usrid,
                  },
                },
                "",//process.env.REACT_APP_ACCESS_TOKEN_SECRET,
                { expiresIn: "10s" }
              );
              req.session.user = entry.attributes;
              req.session.accessToken = accessToken;
              res.json(req.session);
            });

            result.on("error", function (error) {
              console.error("Error: " + error.message);
              res.json({
                auth: true,
                token: token,
                usrid: usrid,
                error: error.message,
              });
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
  });

  app.get("/session", async (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies) {
      res.send(false);
    } else {
      res.send(true);
    }
  });

  app.get("/auth"),
    (req, res) => {
      if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
      } else {
        res.send({ loggedIn: false });
      }
    };
};
