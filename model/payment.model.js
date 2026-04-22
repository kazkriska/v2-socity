import pool from "../config/db.js";

export const createPayments = async ({
  amount_due,
  late_fee,
  due_date,
  payment_for_month,
  society_id = null,
  pocket_id = null,
}) => {
  let query = `
    INSERT INTO payment (
        resident_id,
        amount_due,
        late_fee,
        due_date,
        paid,
        payment_date,
        payment_for_month
    )
    SELECT 
        r.id,
        $1,
        $2,
        $3,
        FALSE,
        NULL,
        $4
    FROM resident r
    JOIN pocket p ON r.pocket_id = p.id
    WHERE 1=1
  `;

  const values = [amount_due, late_fee, due_date, payment_for_month];
  let paramIndex = 5;

  // Optional filters
  if (society_id) {
    query += ` AND p.society_id = $${paramIndex++}`;
    values.push(society_id);
  }

  if (pocket_id) {
    query += ` AND r.pocket_id = $${paramIndex++}`;
    values.push(pocket_id);
  }

  // Prevent duplicates
  query += `
    AND NOT EXISTS (
        SELECT 1 
        FROM payment pay
        WHERE pay.resident_id = r.id
        AND pay.payment_for_month = $4
    )
    RETURNING *;
  `;

  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    console.error("Error creating payments:", error);
    throw error;
  }
};

export const getAllPayments = async () => {
  const query = `
    SELECT *
    FROM payment_details
    ORDER BY due_date DESC
  `;
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error fetching all payments:", error);
    throw error;
  }
};

export const getPaymentsBySocietyId = async (society_id) => {
  const query = `
        SELECT *
        FROM payment_details
        WHERE society_id = $1
        ORDER BY due_date DESC
    `;

  try {
    const { rows } = await pool.query(query, [society_id]);
    return rows;
  } catch (error) {
    console.error("Error fetching payments by society ID:", error);
    throw error;
  }
};

export const getPaymentsByPocketId = async (pocket_id) => {
  const query = `
        SELECT *
        FROM payment_details
        WHERE pocket_id = $1
        ORDER BY due_date DESC
    `;

  try {
    const { rows } = await pool.query(query, [pocket_id]);
    return rows;
  } catch (error) {
    console.error("Error fetching payments by pocket ID:", error);
    throw error;
  }
};

export const getPaymentsByResidentId = async (resident_id) => {
  const query = `
        SELECT *
        FROM payment_details
        WHERE resident_id = $1
        ORDER BY due_date DESC
    `;

  try {
    const { rows } = await pool.query(query, [resident_id]);
    return rows;
  } catch (error) {
    console.error("Error fetching payments by resident ID:", error);
    throw error;
  }
};

export const getPaymentById = async (payment_id) => {
  const query = `
        SELECT *
        FROM payment_details
        WHERE payment_id = $1
    `;

  try {
    const { rows } = await pool.query(query, [payment_id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    throw error;
  }
};

export const getUnpaidPayments = async () => {
  const query = `
        SELECT *
        FROM payment_details
        WHERE paid = false
        ORDER BY due_date ASC
    `;

  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error fetching unpaid payments:", error);
    throw error;
  }
};

export const getPaymentsByMonth = async (month) => {
  const query = `
        SELECT *
        FROM payment_details
        WHERE payment_for_month = $1
        ORDER BY due_date DESC
    `;

  try {
    const { rows } = await pool.query(query, [month]);
    return rows;
  } catch (error) {
    console.error("Error fetching payments by month:", error);
    throw error;
  }
};

export const getPayments = async ({
  society_id,
  pocket_id,
  resident_id,
  paid,
  month,
}) => {
  let query = `SELECT * FROM payment_details WHERE 1=1`;
  const values = [];
  let i = 1;

  if (society_id) {
    query += ` AND society_id = $${i++}`;
    values.push(society_id);
  }

  if (pocket_id) {
    query += ` AND pocket_id = $${i++}`;
    values.push(pocket_id);
  }

  if (resident_id) {
    query += ` AND resident_id = $${i++}`;
    values.push(resident_id);
  }

  if (paid !== undefined) {
    query += ` AND paid = $${i++}`;
    values.push(paid);
  }

  if (month) {
    query += ` AND payment_for_month = $${i++}`;
    values.push(month);
  }

  query += ` ORDER BY due_date DESC`;

  const { rows } = await pool.query(query, values);
  return rows;
};

export const markPaymentAsPaid = async (payment_id, payment_date = null) => {
  const query = `
    UPDATE payment
    SET 
      paid = TRUE,
      payment_date = COALESCE($2, CURRENT_DATE),
      late_fee = CASE
        WHEN COALESCE($2, CURRENT_DATE) <= due_date THEN 0
        ELSE late_fee
      END
    WHERE id = $1
      AND paid = FALSE
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [payment_id, payment_date]);
  return rows[0] || null;
};
