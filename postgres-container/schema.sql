-- =========================
-- DROP TABLES (for re-run safety)
-- =========================
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS resident CASCADE;
DROP TABLE IF EXISTS pocket CASCADE;
DROP TABLE IF EXISTS society CASCADE;

-- =========================
-- SOCIETY TABLE
-- =========================
CREATE TABLE society (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- =========================
-- POCKET TABLE
-- =========================
CREATE TABLE pocket (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    society_id INT NOT NULL,
    
    CONSTRAINT fk_pocket_society
        FOREIGN KEY (society_id)
        REFERENCES society(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_pocket_per_society
        UNIQUE (society_id, name)
);

-- =========================
-- RESIDENT TABLE
-- =========================
CREATE TABLE resident (
    id SERIAL PRIMARY KEY,
    pocket_id INT NOT NULL,
    flat_number INT NOT NULL,

    CONSTRAINT fk_resident_pocket
        FOREIGN KEY (pocket_id)
        REFERENCES pocket(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_flat_per_pocket
        UNIQUE (pocket_id, flat_number)
);

-- =========================
-- PAYMENT TABLE
-- =========================

-- Enum for months
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'month_enum') THEN
        CREATE TYPE month_enum AS ENUM (
            'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
            'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
        );
    END IF;
END$$;

CREATE TABLE payment (
    id SERIAL PRIMARY KEY,
    resident_id INT NOT NULL,
    amount_due INT NOT NULL,
   -- late_fee INT DEFAULT 0,
    due_date DATE NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    payment_date DATE,
    payment_for_month month_enum NOT NULL,

    CONSTRAINT fk_payment_resident
        FOREIGN KEY (resident_id)
        REFERENCES resident(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_payment_per_month
        UNIQUE (resident_id, payment_for_month)
);

-- =========================
-- INDEXES (for performance)
-- =========================
CREATE INDEX idx_pocket_society_id ON pocket(society_id);
CREATE INDEX idx_resident_pocket_id ON resident(pocket_id);
CREATE INDEX idx_payment_resident_id ON payment(resident_id);

-- =========================
-- VIEW FOR EASY QUERYING
-- =========================
CREATE OR REPLACE VIEW resident_details AS
SELECT
    r.id AS resident_id,
    s.id AS society_id,
    p.id AS pocket_id,
    s.name AS society_name,
    p.name AS pocket_name,
    r.flat_number
FROM resident r
JOIN pocket p ON r.pocket_id = p.id
JOIN society s ON p.society_id = s.id;

-- =========================
-- VIEW FOR PAYMENT DETAILS
-- =========================
CREATE OR REPLACE VIEW payment_details AS
SELECT
    pay.id AS payment_id,
    pay.resident_id,
    r.pocket_id,
    p.society_id,

    s.name AS society_name,
    p.name AS pocket_name,
    r.flat_number,

    pay.amount_due,

    -- 👇 dynamic late fee
    CASE 
        WHEN CURRENT_DATE > pay.due_date AND pay.paid = FALSE THEN 20
        ELSE 0
    END AS late_fee,

    pay.due_date,
    pay.paid,
    pay.payment_date,
    pay.payment_for_month
FROM payment pay
JOIN resident r ON pay.resident_id = r.id
JOIN pocket p ON r.pocket_id = p.id
JOIN society s ON p.society_id = s.id;
