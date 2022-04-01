const express = require("express");
const app = express();

const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

// Connects mongoose when the app is started
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/pizza-hunt",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Logs mongo queries being executed
mongoose.set("debug", true);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
