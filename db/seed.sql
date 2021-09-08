INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Paul', 2, 3),
       ('Garrett', 'Lockhart', 2, 3),
       ('Jessica', 'Trevino', 1, 4),
       ('Mike', 'Scott', 6, 3),
       ('Todd', 'Granger', 8, NULL);

INSERT INTO departments (department)
VALUES ('Engineering'),
       ('Sales'),
       ('Marketing'),
       ('Operations');

INSERT INTO roles (title, salary, department_id)
VALUES ('Lead Engineer', 130000, 1),
       ('Staff Engineer', 100000, 1),
       ('Lead Salesman', 120000, 2), 
       ('Staff Salesman', 90000, 2),
       ('Marketing Team Memeber', 75000, 3),
       ('Operations Manager', 140000, 4),
       ('Operator', 110000, 4),
       ('Vice President', 200000, 4);
