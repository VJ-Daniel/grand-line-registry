import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const crewMembers = [
  {
    id: 1,
    name: "Monkey D. Luffy",
    role: "Captain",
    bounty: 3000000000,
    devilFruit: "Hito Hito no Mi, Model: Nika",
    status: "active",
  },
  {
    id: 2,
    name: "Roronoa Zoro",
    role: "Swordsman",
    bounty: 1111000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 3,
    name: "Nami",
    role: "Navigator",
    bounty: 366000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 4,
    name: "Usopp",
    role: "Sniper",
    bounty: 500000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 5,
    name: "Vinsmoke Sanji",
    role: "Cook",
    bounty: 1032000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 6,
    name: "Tony Tony Chopper",
    role: "Doctor",
    bounty: 1000,
    devilFruit: "Hito Hito no Mi",
    status: "inactive",
  },
  {
    id: 7,
    name: "Nico Robin",
    role: "Archaeologist",
    bounty: 930000000,
    devilFruit: "Hana Hana no Mi",
    status: "active",
  },
  {
    id: 8,
    name: "Franky",
    role: "Shipwright",
    bounty: 394000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 9,
    name: "Brook",
    role: "Musician",
    bounty: 383000000,
    devilFruit: "Yomi Yomi no Mi",
    status: "active",
  },
  {
    id: 10,
    name: "Jinbe",
    role: "Helmsman",
    bounty: 1100000000,
    devilFruit: "None",
    status: "active",
  },
];

//Task 2.1: Request Logger Middleware
app.use((req, res, next) => {

    // get user agent from request headers
    const userAgent = req.headers["user-agent"];

    // get current date and time
    const currentTime = new Date().toLocaleString();

    // create log string
    const logString = `Request from: ${userAgent} at ${currentTime}`;

    // print to console
    console.log(logString);

    // attach log to request object
    req.log = logString;

    // pass control to next middleware/route
    next();
});

//Task 2.2: Route Restricting Middleware
function verifyBounty(req, res, next) {
    const checkpoint = Math.floor(Math.random() * 2);
    if (checkpoint === 1) {
        next();
    } 
    else {
        res.status(403).send("403 - The Marines have blocked your path. Turn back.");
    }
}

//Task 3.2: Home Page: Crew Cards
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    crew: crewMembers
  });
});

//Task 3.3: Crew Table Page
app.get("/crew", (req, res) => {
  res.render("crew", {
    title: "The Crew",
    crew: crewMembers
  });
});

//Task 3.4 Recruit Application Form
app.get("/recruit", (req, res) => {
  res.render("recruit", {
    title: "Join the Crew",
    errors: [],
    formData: {}
  });
});

app.post("/recruit", (req, res) => {

  const { applicantName, skill, role, message, sea, agreeTerms } = req.body;

  let errors = [];
  if (!applicantName || applicantName.trim() === "") {
    errors.push("Name is required.");
  }

  if (!skill || skill.trim() === "") {
    errors.push("Special skill is required.");
  }

  if (!role || role === "Select a role") {
    errors.push("Please select a role.");
  }

  if (!message || message.trim() === "") {
    errors.push("Message is required.");
  }

  if (!sea) {
    errors.push("Please select your preferred sea.");
  }

  if (!agreeTerms) {
    errors.push("You must accept the risks of the Grand Line.");
  }
  if (errors.length > 0) {
    return res.render("recruit", {
      title: "Join the Crew",
      errors,
      formData: req.body
    });
  }
  crewMembers.push({
    name: applicantName,
    role: role,
    devilFruit: skill,
    bounty: "0 Berries",
    status: "pending"
  });

  res.render("recruit", {
    title: "Join the Crew",
    errors: [],
    formData: {}
  });

});

//Task 3.5: Log Pose 
app.get("/log-pose", verifyBounty, (req, res) => {
  res.render("logPose", {
    crew: crewMembers,
    log: req.log
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {
    message: "404 - We couldn't find what you're looking for on the Grand Line."
  });
});

// error handler
app.use((err, req, res, next) => {
  res.status(500).send(
    `500 - Something went wrong on the Thousand Sunny: ${err.message}`
  );
});

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
export default app;