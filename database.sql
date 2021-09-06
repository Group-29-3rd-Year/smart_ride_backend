CREATE DATABASE smartride;

CREATE TABLE users (user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_name VARCHAR(255) NOT NULL,  phone_number VARCHAR(10) NOT NULL ,user_email VARCHAR(255) NOT NULL, user_password VARCHAR(255) NOT NULL, is_admin BOOLEAN);

INSERT INTO users (user_name, user_email, user_password) VALUES ('henry', 'henry123@gmail.com', 'henry123');


Extact both schema and data from postgres database:
  pg_dump -U postgres smartride > smartride_dump.sql
Extact schema only from postgres database:
  pg_dump -U postgres -s smartride > smartride_dump.sql
Extact data only from postgres database:
  pg_dump -U postgres -a smartride > smartride_dump.sql