import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { startReminderCron } from './services/reminder.service.js';
console.log("Server Started");
dotenv.config();

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`CrediScope API running on port ${port}`);
      startReminderCron();
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });