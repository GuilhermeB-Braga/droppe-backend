import express from "express";
import sessionRoutes from "./session.routes.js";
import fileRoutes from "./file.routes.js";

const routes = express.Router();

routes.use("/session", sessionRoutes);
routes.use("/files", fileRoutes);

export default routes;
