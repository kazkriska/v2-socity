import { createSociety, getSocietyByName } from "./model/society.model.js";
import {
  createPocket,
  getPocketByName,
  getPocketsBySocietyId,
} from "./model/pocket.model.js";
import { createResident } from "./model/resident.model.js";
import { createPayments } from "./model/payment.model.js";

const society = await getSocietyByName("Sarita Vihar");

console.log("Created Society:", society);

const pocket = await getPocketByName("E", society.id);

console.log("Created Pocket:", pocket);

//for (let i = 29; i <= 84; i++) {
//  const resident = await createResident(pocket.id, i);
//  console.log("Created Resident: ", resident);
//}

const payment = await createPayments({
  amount_due: 600,
  late_fee: 20,
  due_date: "2026-05-07",
  payment_for_month: "MAY",
  society_id: society.id,
  pocket_id: pocket.id,
});

console.log(payment);
