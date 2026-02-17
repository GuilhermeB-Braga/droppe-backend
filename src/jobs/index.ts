import cron from "node-cron";
import { runJob } from "../lib/jobRunner.js";
import checkExpiresDocs from "./checkExpiresDocs.js";

export const setupJobs = (): void => {
    cron.schedule('*/1 * * * *', () => {
        runJob('checkExpireDocs', checkExpiresDocs)
    })
}