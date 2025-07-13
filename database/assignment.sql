-- Clean-up (only use if you're rebuilding)
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS classification CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TYPE IF EXISTS account_type CASCADE;

-- Create ENUM
CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');

-- Create Tables
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(255) NOT NULL,
  account_lastname VARCHAR(255) NOT NULL,
  account_email VARCHAR(255) UNIQUE NOT NULL,
  account_password VARCHAR(255) NOT NULL,
  account_type account_type DEFAULT 'Client'
);

CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(255) NOT NULL,
  inv_model VARCHAR(255) NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image VARCHAR(255) NOT NULL,
  inv_thumbnail VARCHAR(255) NOT NULL,
  inv_price NUMERIC(10,2) NOT NULL,
  inv_year INTEGER NOT NULL,
  inv_miles INTEGER NOT NULL,
  inv_color VARCHAR(20) NOT NULL,
  classification_id INTEGER REFERENCES classification(classification_id)
);

-- Insert Data
INSERT INTO classification (classification_name)
VALUES ('SUV'), ('Truck'), ('Sport');
INSERT INTO inventory (
  inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
  inv_price, inv_year, inv_miles, inv_color, classification_id
)
VALUES (
  'GM', 'Hummer', 'Great off-road vehicle with small interiors',
  '/images/hummer.jpg', '/images/hummer-thumb.jpg',
  32000.00, 2015, 65000, 'Black', 1
);
