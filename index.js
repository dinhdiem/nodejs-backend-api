const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DBConection Successfull!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api", userRouter);
app.use("/api", authRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running port ");
});
