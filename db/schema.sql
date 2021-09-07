DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    employee_firstName VARCHAR(30) NOT NULL,
    employee_lastName VARCHAR(30) NOT NULL
    -- FOREIGN KEY (employee_id)
    -- REFERENCES employee(id),
    -- FOREIGN KEY (role_id)
    -- REFERENCES roles(id),
);

-- CREATE TABLE departments (
--     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     department_name VARCHAR(30) NOT NULL
-- );

-- CREATE TABLE roles (
--     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     role_title VARCHAR(30) NOT NULL,
--     role_salary DECIMAL,
--     FOREIGN KEY (department_id)
--     REFERENCES departments(id)
-- );