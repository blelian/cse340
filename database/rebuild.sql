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

-- Insert Data into classification
INSERT INTO classification (classification_name)
VALUES ('SUV'), ('Truck'), ('Sport');

-- Insert Data into inventory
INSERT INTO inventory (
  inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
  inv_price, inv_year, inv_miles, inv_color, classification_id
)
VALUES 
  ('GM', 'Hummer', 'Great off-road vehicle with small interiors',
   '/images/hummer.jpg', '/images/hummer-thumb.jpg',
   32000.00, 2015, 65000, 'Black', 1),
   
  ('Ford', 'F-150', 'Reliable truck for work and play',
   '/images/f150.jpg', '/images/f150-thumb.jpg',
   28000.00, 2018, 45000, 'Red', 2),

  ('Chevy', 'Corvette', 'Fast and sporty with great design',
   '/images/corvette.jpg', '/images/corvette-thumb.jpg',
   50000.00, 2020, 15000, 'Yellow', 3);

-- Insert sample accounts
INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
VALUES 
  ('John', 'Sibanda', 'johnsibanda@gmail.com', 'hashed_password_123', 'Client'),
  ('Jane', 'Smith', 'janesmith@gmail.com', 'hashed_password_456', 'Admin');

-- Task 1 Query 4: Update Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer' AND inv_make = 'GM';

-- Task 1 Query 6: Update image paths to include /vehicles
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
