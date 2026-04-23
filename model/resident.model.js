import pool from "../config/db.js";

export const createResident = async (pocket_id, flat_number) => {
  const query =
    "INSERT INTO resident (pocket_id, flat_number) VALUES ($1, $2) RETURNING *";
  const values = [pocket_id, flat_number];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error(
        "Resident with this flat number already exists in the pocket.",
      );
    }
    console.error("Error creating resident:", error);
    throw error;
  }
};

export const getResidentsBySocietyAndPocket = async (society_id, pocket_id) => {
  const query = `
    SELECT *
    FROM resident_details
    WHERE society_id = $1
      AND pocket_id = $2
    ORDER BY flat_number
  `;
  try {
    const { rows } = await pool.query(query, [society_id, pocket_id]);
    return rows;
  } catch (error) {
    console.error("Error fetching residents by society and pocket:", error);
    throw error;
  }
};

export const getAllResidents = async () => {
  const query = `SELECT * FROM resident_details ORDER BY society_name, pocket_name, flat_number`;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error fetching all residents:", error);
    throw error;
  }
};

export const getResidentById = async (resident_id) => {
  const query = `
    SELECT *
    FROM resident_details
    WHERE resident_id = $1
  `;
  try {
    const { rows } = await pool.query(query, [resident_id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching resident by ID:", error);
    throw error;
  }
};

export const updateResident = async (id, flat_number) => {
  const query =
    "UPDATE resident SET flat_number = $1 WHERE id = $2 RETURNING *";
  const values = [flat_number, id];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error(
        "Resident with this flat number already exists in the pocket.",
      );
    }
    console.error("Error updating resident:", error);
    throw error;
  }
};

export const deleteResident = async (id) => {
  const query = "DELETE FROM resident WHERE id = $1 RETURNING *";
  const values = [id];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting resident:", error);
    throw error;
  }
};

export const getResidentsBySocietyId = async (society_id) => {
  const query = `
    SELECT *
    FROM resident_details
    WHERE society_id = $1
    ORDER BY pocket_name, flat_number
  `;
  try {
    const { rows } = await pool.query(query, [society_id]);
    return rows;
  } catch (error) {
    console.error("Error fetching residents by society:", error);
    throw error;
  }
};

export const getResidentsByPocketId = async (pocket_id) => {
  const query = `
        SELECT *
        FROM resident_details
        WHERE pocket_id = $1
        ORDER BY flat_number
    `;

  try {
    const { rows } = await pool.query(query, [pocket_id]);
    return rows;
  } catch (error) {
    console.error("Error fetching residents by pocket ID:", error);
    throw error;
  }
};

export const getResidentIdByFlatNumber = async (pocket_id, flat_number) => {
  const query = `
    SELECT id
    FROM resident
    WHERE pocket_id = $1
      AND flat_number = $2
  `;
  try {
    const { rows } = await pool.query(query, [pocket_id, flat_number]);
    return rows[0] ? rows[0].id : null;
  } catch (error) {
    console.error("Error fetching resident ID by flat number:", error);
    throw error;
  }
};
