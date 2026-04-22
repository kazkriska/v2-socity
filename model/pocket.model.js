import pool from "../config/db.js";

export const createPocket = async (name, societyId) => {
  const query =
    "INSERT INTO pocket (name, society_id) VALUES ($1, $2) RETURNING *";
  const values = [name, societyId];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Pocket with this name already exists in the society.");
    }
    console.error("Error creating pocket:", error);
    throw error;
  }
};

export const getPocketsBySocietyId = async (societyId) => {
  const query = "SELECT * FROM pocket WHERE society_id = $1";
  const values = [societyId];
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error fetching pockets by society ID:", error);
    throw error;
  }
};

export const getPocketByName = async (name, society_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM pocket WHERE name = $1 AND society_id = $2`,
    [name, society_id],
  );
  return rows[0];
};

export const getPocketById = async (id) => {
  const query = "SELECT * FROM pocket WHERE id = $1";
  const values = [id];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching pocket by ID:", error);
    throw error;
  }
};

export const updatePocket = async (id, name) => {
  const query = "UPDATE pocket SET name = $1 WHERE id = $2 RETURNING *";
  const values = [name, id];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Pocket with this name already exists in the society.");
    }
    console.error("Error updating pocket:", error);
    throw error;
  }
};

export const deletePocket = async (id) => {
  const query = "DELETE FROM pocket WHERE id = $1 RETURNING *";
  const values = [id];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting pocket:", error);
    throw error;
  }
};
