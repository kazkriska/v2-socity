import cron from "node-cron";
import { createPaymentsForAllResidents } from "../model/payment.model.js";

cron.schedule("0 0 1 * *", async () => {
  console.log("Running monthly payment generation job...");

  try {
    const now = new Date();

    // Get month enum (JAN, FEB, etc.)
    const monthNames = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const payment_for_month = monthNames[now.getMonth()];

    // Example: due date = 10th of current month
    const due_date = new Date(now.getFullYear(), now.getMonth(), 10);

    const amount_due = 600; // you can make this dynamic later
    const late_fee = 20;

    const result = await createPaymentsForAllResidents(
      amount_due,
      late_fee,
      due_date,
      payment_for_month,
    );

    console.log(`Created ${result.length} payment records`);
  } catch (error) {
    console.error("Cron job failed:", error);
  }
});
