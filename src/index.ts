import "dotenv/config";
import express from "express";
import cors, { type CorsOptions } from "cors";
import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import { setupJobs } from "./jobs/index.js";

const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN_URL,
  optionsSuccessStatus: 200,
};

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use("/", routes);

app.use(errorMiddleware);

setupJobs()

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
