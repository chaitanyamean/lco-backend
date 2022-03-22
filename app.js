require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/User");
const app = express();
app.use(express.json());

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors")
const auth =  require("./middlewares/auth")
const server = require('http').createServer(app);


app.use(cors({
  origin: "*"
}))

const io = require('socket.io')(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
  // console.log("What is socket: ", socket)
  console.log("Socket is active to be connected");

  socket.on('chat', (payload) => {
      // console.log("What is payload", payload)
      io.emit("chat", payload);
  })

});

app.get("/", (req, res) => {
  res.json({
    name: "krishna",
  });
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(firstName && lastName && email && password)) {
      res.status(400).send("All fields are mandatory");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(410).send("Already exists");
    }

    const myEcryptPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: myEcryptPassword,
    });

    // Token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    user.password = undefined;
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Fields are missing");
    }

    const user = await User.findOne({ email });
    // if (!user) {
    //   res.status(400).send("U r not registered");
    // }

    // const pass = await bcrypt.compare(password, user.password);

    if (user && (await bcrypt.compare(password, user.password))) {
      // Token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      user.password = undefined;
      res.status(200).json(user);
    }

      res.status(400).send("U r not registered");

  } catch (error) {
    console.log(error);
  }
});


app.get("/dashboard", auth, async(req,res) => {
    res.send("Welcome to secret information")
})

module.exports = app;
