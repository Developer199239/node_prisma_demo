import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import router from "./routes/index.js";
import { fetchWebexData, getOrganizationNumbers } from "./services/webexService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(router);

// Initial Webex data fetch
(async () => {
  try {
    console.log("Running initial Webex data sync...");
    // await fetchWebexData();
    await getOrganizationNumbers();
  } catch (error) {
    console.error("Failed to sync Webex data on app startup:", error.message);
  }
})();

// Schedule sync every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("Running scheduled Webex data sync...");
  try {
    await fetchWebexData();
  } catch (error) {
    console.error("Scheduled Webex data sync failed:", error.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
