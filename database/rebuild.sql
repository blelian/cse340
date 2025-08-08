-- Clean-up
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

-- Insert Classifications
INSERT INTO classification (classification_name)
VALUES ('SUV'), ('Truck'), ('Sport'), ('Custom'), ('Sedan');

-- Insert Vehicles
INSERT INTO inventory (
  inv_make, inv_model, inv_description, inv_image, inv_thumbnail,
  inv_price, inv_year, inv_miles, inv_color, classification_id
) VALUES
('Cadillac', 'Escalade', 'Luxury full-size SUV', '/images/vehicles/escalade.jpg', '/images/vehicles/escalade-tn.jpg', 70000.00, 2022, 5000, 'Black', 1),
('Jeep', 'Wrangler', 'Off-road SUV', '/images/vehicles/wrangler.jpg', '/images/vehicles/wrangler-tn.jpg', 40000.00, 2021, 10000, 'Green', 1),
('Survan', 'Transporter', 'Family van', '/images/vehicles/survan.jpg', '/images/vehicles/survan-tn.jpg', 25000.00, 2018, 35000, 'Silver', 1),
('GM', 'Hummer', 'Great off-road vehicle with a huge interior', '/images/vehicles/hummer.jpg', '/images/vehicles/hummer-tn.jpg', 32000.00, 2015, 65000, 'Black', 1),

('Ford', 'F-150', 'Reliable work truck', '/images/vehicles/ford-f150.jpg', '/images/vehicles/ford-f150-tn.jpg', 28000.00, 2018, 45000, 'Red', 2),
('Monster', 'Truck', 'Massive power and size', '/images/vehicles/monster-truck.jpg', '/images/vehicles/monster-truck-tn.jpg', 90000.00, 2020, 10000, 'Orange', 2),
('Fire', 'Truck', 'Emergency vehicle', '/images/vehicles/fire-truck.jpg', '/images/vehicles/fire-truck-tn.jpg', 150000.00, 2010, 35000, 'Red', 2),
('Mechanic', 'Truck', 'Utility repair vehicle', '/images/vehicles/mechanic.jpg', '/images/vehicles/mechanic-tn.jpg', 40000.00, 2015, 75000, 'White', 2),

('Chevy', 'Corvette', 'Fast and stylish', '/images/vehicles/corvette.jpg', '/images/vehicles/corvette-tn.jpg', 50000.00, 2020, 15000, 'Yellow', 3),
('Lamborghini', 'Aventador', 'Supercar performance', '/images/vehicles/adventador.jpg', '/images/vehicles/adventador-tn.jpg', 300000.00, 2021, 2000, 'Silver', 3),

('Delorean', 'Time Machine', 'Iconic time-travel car', '/images/vehicles/delorean.jpg', '/images/vehicles/delorean-tn.jpg', 85000.00, 1985, 120000, 'Grey', 4),
('Mystery', 'Van', 'Scooby-Doo vehicle', '/images/vehicles/mystery-van.jpg', '/images/vehicles/mystery-van-tn.jpg', 12000.00, 1970, 90000, 'Blue', 4),
('Dog', 'Car', 'Mutt Cutts van replica', '/images/vehicles/dog-car.jpg', '/images/vehicles/dog-car-tn.jpg', 10000.00, 1995, 99000, 'Tan', 4),
('Aerocar', 'Flying Car', 'Vintage aviation car', '/images/vehicles/aerocar.jpg', '/images/vehicles/aerocar-tn.jpg', 600000.00, 1950, 3000, 'Sky Blue', 4),
('Batmobile', 'Tumbler', 'Crime-fighting vehicle', '/images/vehicles/batmobile.jpg', '/images/vehicles/batmobile-tn.jpg', 1500000.00, 2008, 5000, 'Black', 4),

('Crown', 'Victoria', 'Retired police sedan', '/images/vehicles/crwn-vic.jpg', '/images/vehicles/crwn-vic-tn.jpg', 6000.00, 2011, 80000, 'White', 5),
('Chevy', 'Camaro', 'Modern muscle car', '/images/vehicles/camaro.jpg', '/images/vehicles/camaro-tn.jpg', 33000.00, 2020, 30000, 'Red', 5),
('T', 'Model', 'Early Ford model', '/images/vehicles/model-t.jpg', '/images/vehicles/model-t-tn.jpg', 8000.00, 1925, 250000, 'Black', 5);

-- Sample Accounts (with bcrypt hashed passwords)
INSERT INTO account (
  account_firstname, account_lastname, account_email, account_password, account_type
) VALUES
('John', 'Sibanda', 'johnsibanda@gmail.com', 'hashed_password_123', 'Client'),
('Jane', 'Smith', 'janesmith@gmail.com', 'hashed_password_456', 'Admin'),

('Basic', 'Client', 'basic@340.edu', '$2b$10$b6UkmKz1AeMCQb350rIH8.zoucxYjG0wQ27W73Zk45XTjbfVrh9VG', 'Client'),
('Happy', 'Employee', 'happy@340.edu', '$2b$10$69YDAyJ7vvOQDZzbPcSX7.Ix7U7kZNiW7NglWaaDgdx9bfWf8hw1S', 'Employee'),
('Manager', 'User', 'manager@340.edu', '$2b$10$OP0Xdb/ThQ7wnXKhGnJBbucsf3xZ9HDh4o2lJFyPF3w48Poki3fry', 'Admin');
