import pool from "../config/db.js";

export const createSociety = async (name) => {
  const query = "INSERT INTO society (name) VALUES ($1) RETURNING *";
  const values = [name];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Society with this name already exists.");
    }
    console.error("Error creating society:", error);
    throw error;
  }
};

export const getAllSocieties = async () => {
  const query = "SELECT * FROM society";
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching societies:", error);
    throw error;
  }
};

export const getSocietyById = async (id) => {
  const query = "SELECT * FROM society WHERE id = $1";
  const values = [id];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching society by ID:", error);
    throw error;
  }
};

export const getSocietyByName = async (name) => {
  const { rows } = await pool.query(`SELECT * FROM society WHERE name = $1`, [
    name,
  ]);
  return rows[0];
};

export const updateSociety = async (id, name) => {
  const query = "UPDATE society SET name = $1 WHERE id = $2 RETURNING *";
  const values = [name, id];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("Society with this name already exists.");
    }
    console.error("Error updating society:", error);
    throw error;
  }
};

export const deleteSociety = async (id) => {
  const query = "DELETE FROM society WHERE id = $1 RETURNING *";
  const values = [id];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting society:", error);
    throw error;
  }
};
