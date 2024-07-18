const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const credentials = require("./src/middleware/credentials");
const corsOptions = require("./src/config/corsOptions");

//const keys = require("./src/config/keys");

const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions, { credentials: true }));

// makes responses more readable
app.use(bodyParser.json());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

require("./src/routes/authRoutes")(app);
require("./src/routes/apiGatewayRoutes")(app);
require("./src/routes/nfvdAlarmDBRoutes")(app);
require("./src/routes/nfvdDBRoutes")(app);
require("./src/routes/sdDBRoutes")(app);
require("./src/routes/nfvdErrorsDBRoutes")(app);
require("./src/routes/nfvdSlackRoutes")(app);

app.get("/logout", function (req, res) {});

// start express server on port 5000
app.listen(5000, () => {
  console.log("Listening...");
});



