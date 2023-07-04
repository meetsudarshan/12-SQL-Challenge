const connection = require('./config/connection');const inquirer = require('inquirer');
const mysql = require('mysql');
const consoleTable = require('console.table');

// Create a MySQL connection
// const connection = mysql.createConnection({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: 'your_password',
//   database: 'employee_db',
// });

// Connect to the MySQL server
// connection.connect((err) => {
//   if (err) throw err;
//   console.log('Connected to the database.');
//   startApp();
// });

// Function to display the main menu and handle user input
function startApp() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      const selectedOption = answer.action;
      switch (selectedOption) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          console.log('Disconnected from the database.');
          break;
      }
    });
}

// Function to view all departments
function viewAllDepartments() {
  const query = 'SELECT * FROM departments';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all roles
function viewAllRoles() {
  const query = 'SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles LEFT JOIN departments ON roles.department_id = departments.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all employees
function viewAllEmployees() {
  const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                 FROM employees
                 INNER JOIN roles ON employees.role_id = roles.id
                 INNER JOIN departments ON roles.department_id = departments.id
                 LEFT JOIN employees manager ON employees.manager_id = manager.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: 'departmentName',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      const query = 'INSERT INTO departments SET ?';
      connection.query(query, { name: answer.departmentName }, (err, res) => {
        if (err) throw err;
        console.log('Department added successfully!');
        startApp();
      });
    });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        name: 'roleTitle',
        type: 'input',
        message: 'Enter the title of the role:',
      },
      {
        name: 'roleSalary',
        type: 'number',
        message: 'Enter the salary for the role:',
      },
      {
        name: 'departmentId',
        type: 'number',
        message: 'Enter the department ID for the role:',
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO roles SET ?';
      connection.query(
        query,
        {
          title: answer.roleTitle,
          salary: answer.roleSalary,
          department_id: answer.departmentId,
        },
        (err, res) => {
          if (err) throw err;
          console.log('Role added successfully!');
          startApp();
        }
      );
    });
}

// Function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'Enter the first name of the employee:',
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'Enter the last name of the employee:',
      },
      {
        name: 'roleId',
        type: 'number',
        message: 'Enter the role ID for the employee:',
      },
      {
        name: 'managerId',
        type: 'number',
        message: 'Enter the manager ID for the employee (or leave blank if none):',
        default: null,
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO employees SET ?';
      connection.query(
        query,
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        (err, res) => {
          if (err) throw err;
          console.log('Employee added successfully!');
          startApp();
        }
      );
    });
}

// Function to update an employee role
function updateEmployeeRole() {
  // Get the list of employees to choose from
  const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees';
  connection.query(employeeQuery, (err, employees) => {
    if (err) throw err;
    const employeeChoices = employees.map((employee) => ({
      name: employee.name,
      value: employee.id,
    }));

    // Get the list of roles to choose from
    const roleQuery = 'SELECT id, title FROM roles';
    connection.query(roleQuery, (err, roles) => {
      if (err) throw err;
      const roleChoices = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      // Prompt the user to select an employee and a new role
      inquirer
        .prompt([
          {
            name: 'employeeId',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employeeChoices,
          },
          {
            name: 'roleId',
            type: 'list',
            message: 'Select the new role for the employee:',
            choices: roleChoices,
          },
        ])
        .then((answer) => {
          const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
          connection.query(
            query,
            [answer.roleId, answer.employeeId],
            (err, res) => {
              if (err) throw err;
              console.log('Employee role updated successfully!');
              startApp();
            }
          );
        });
    });
  });
}

// Function to view all roles
function viewAllRoles() {
    const query = 'SELECT * FROM roles';
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    });
  }
  
  // Function to view all employees
  function viewAllEmployees() {
    const query = 'SELECT * FROM employees';
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    });
  }
  
  // Function to add a department
  function addDepartment() {
    inquirer
      .prompt({
        name: 'departmentName',
        type: 'input',
        message: 'Enter the name of the department:',
      })
      .then((answer) => {
        const query = 'INSERT INTO departments (name) VALUES (?)';
        connection.query(query, [answer.departmentName], (err, res) => {
          if (err) throw err;
          console.log('Department added successfully!');
          startApp();
        });
      });
  }
  
  // Function to add a role
  function addRole() {
    inquirer
      .prompt([
        {
          name: 'roleTitle',
          type: 'input',
          message: 'Enter the title of the role:',
        },
        {
          name: 'roleSalary',
          type: 'number',
          message: 'Enter the salary for the role:',
        },
        {
          name: 'departmentId',
          type: 'number',
          message: 'Enter the department ID for the role:',
        },
      ])
      .then((answer) => {
        const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
        connection.query(
          query,
          [answer.roleTitle, answer.roleSalary, answer.departmentId],
          (err, res) => {
            if (err) throw err;
            console.log('Role added successfully!');
            startApp();
          }
        );
      });
  }
  
  // Function to add an employee
  function addEmployee() {
    inquirer
      .prompt([
        {
          name: 'firstName',
          type: 'input',
          message: 'Enter the first name of the employee:',
        },
        {
          name: 'lastName',
          type: 'input',
          message: 'Enter the last name of the employee:',
        },
        {
          name: 'roleId',
          type: 'number',
          message: 'Enter the role ID for the employee:',
        },
        {
          name: 'managerId',
          type: 'number',
          message: 'Enter the manager ID for the employee (or leave blank if none):',
          default: null,
        },
      ])
      .then((answer) => {
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        connection.query(
          query,
          [answer.firstName, answer.lastName, answer.roleId, answer.managerId],
          (err, res) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            startApp();
          }
        );
      });
  }
  
  // Function to update an employee role
  function updateEmployeeRole() {
    // Get the list of employees to choose from
    const employeeQuery = 'SELECT * FROM employees';
    connection.query(employeeQuery, (err, employees) => {
      if (err) throw err;
      const employeeChoices = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
  
      // Get the list of roles to choose from
      const roleQuery = 'SELECT * FROM roles';
      connection.query(roleQuery, (err, roles) => {
        if (err) throw err;
        const roleChoices = roles.map((role) => ({
          name: role.title,
          value: role.id,
        }));
  
        // Prompt the user to select an employee and a new role
        inquirer
          .prompt([
            {
              name: 'employeeId',
              type: 'list',
              message: 'Select the employee to update:',
              choices: employeeChoices,
            },
            {
              name: 'roleId',
              type: 'list',
              message: 'Select the new role for the employee:',
              choices: roleChoices,
            },
          ])
          .then((answer) => {
            const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
            connection.query(
              query,
              [answer.roleId, answer.employeeId],
              (err, res) => {
                if (err) throw err;
                console.log('Employee role updated successfully!');
                startApp();
              }
            );
          });
      });
    });
  }
  