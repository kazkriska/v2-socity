"use server";

import { getAllSocieties } from "../../../model/society.model.js";
import { getPocketsBySocietyId } from "../../../model/pocket.model.js";
import { getResidentIdByFlatNumber as getResidentId } from "../../../model/resident.model.js";
import { getPaymentsByResidentId } from "../../../model/payment.model.js";

export async function getSocietiesAction() {
  try {
    const societies = await getAllSocieties();
    return societies;
  } catch (error) {
    console.error("Failed to fetch societies:", error);
    return [];
  }
}

export async function getPocketsAction(societyId: number) {
  try {
    const pockets = await getPocketsBySocietyId(societyId);
    return pockets;
  } catch (error) {
    console.error("Failed to fetch pockets:", error);
    return [];
  }
}

export async function getResidentAction(pocketId: number, flatNumber: number) {
  try {
    const residentId = await getResidentId(pocketId, flatNumber);
    return residentId;
  } catch (error) {
    console.error("Failed to fetch resident ID:", error);
    return null;
  }
}

export async function getPaymentsAction(residentId: number) {
  try {
    const payments = await getPaymentsByResidentId(residentId);
    return payments;
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return [];
  }
}
