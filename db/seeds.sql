-- Insert sample departments
INSERT INTO departments (name) VALUES ('Sales');
INSERT INTO departments (name) VALUES ('Marketing');
INSERT INTO departments (name) VALUES ('Finance');

-- Insert sample roles
INSERT INTO roles (title, salary, department_id) VALUES ('Salesperson', 50000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Marketing Coordinator', 45000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Accountant', 60000, 3);

-- Insert sample employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Mike', 'Johnson', 3, 1);
