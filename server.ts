import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import filtersRouter from "./routes/filters";
import usersRouter from "./routes/users";

dotenv.config();
const PORT = process.env.PORT || 3333;

const app = express();

/* Configuration */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* Routes */
app.use("/api/filters", filtersRouter);
app.use("/api/users", usersRouter);

app.get("/greet", (req, res) => {
  return res.send("Hello");
});

app.get("/", (req, res) => {
  return res.send("Server is up & running.");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
