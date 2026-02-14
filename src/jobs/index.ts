import cron from "node-cron";
import { runJob } from "../lib/jobRunner";
import checkExpiresDocs from "./checkExpiresDocs";

export const setupJobs = (): void => {
    cron.schedule('*/1 * * * *', () => {
        runJob('checkExpireDocs', checkExpiresDocs)
    })
}