-- Insert sample departments
INSERT INTO Departments (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Marketing'),
  ('Human Resources');

-- Insert sample roles
INSERT INTO Roles (title, salary, departmentId) VALUES
  ('Sales Manager', 60000, 1),
  ('Sales Representative', 40000, 1),
  ('Software Engineer', 80000, 2),
  ('Marketing Coordinator', 45000, 3),
  ('HR Manager', 70000, 4);

-- Insert sample employees
INSERT INTO Employees (firstName, lastName, roleId, managerId) VALUES
  ('Sudarshan', 'Samaddar', 1, NULL),
  ('Sami', 'Saqib', 2, 1),
  ('Muhammad', 'Usman', 2, 1),
  ('Usman', 'Jamal', 3, 2),
  ('Ammar', 'Zaidi', 4, 3);
