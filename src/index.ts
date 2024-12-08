import express, { Request, Response } from "express";
import studentRoute from "./routes/studentRoute";
import classRoute from "./routes/classRoute";

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

app.use('/students', studentRoute)
app.use('/classes', classRoute)

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});