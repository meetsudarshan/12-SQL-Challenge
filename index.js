const inquirer = require('inquirer');
const Department = require('./models/department');
const Role = require('./models/role');
const Employee = require('./models/employee');

// Function to view all departments
async function viewAllDepartments() {
  try {
    const departments = await Department.findAll();
    console.log('Departments:');
    departments.forEach((department) => {
      console.log(`- ${department.name}`);
    });
  } catch (error) {
    console.error('Error retrieving departments:', error);
  }
}

// Function to view all roles
const viewAllRoles = async () => {
  try {
    const roles = await Role.findAll({
      include: {
        model: Department,
        as: 'Department', // Specify the alias as 'Department'
      },
    });
    console.log('Roles:');
    roles.forEach((role) => {
      const departmentName = role.Department ? role.Department.name : 'No department';
      console.log(`- ${role.title} (${departmentName}) - Salary: ${role.salary}`);
    });
  } catch (error) {
    console.error('Error retrieving roles:', error);
  }
};




// };

//Function to view all employees
const viewAllEmployees = async () => {
  try {
    const employees = await Employee.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: [
            'id',
            'title',
            'salary',
          ],
          include: {
            model: Department,
            as: 'Department',
            attributes: ['id', 'name'],
          },
        },
        {
          model: Employee,
          as: 'manager',
          attributes: [
            'id',
            'firstName',
            'lastName',
          ],
        },
      ],
    });

    employees.forEach((employee) => {
      console.log(`ID: ${employee.id}`);
      console.log(`Name: ${employee.firstName} ${employee.lastName}`);
      console.log(`Role: ${employee.role.title}`);
      console.log(`Salary: ${employee.role.salary}`);
      console.log(`Department: ${employee.role.Department.name}`);
      if (employee.manager) {
        console.log(`Manager: ${employee.manager.firstName} ${employee.manager.lastName}`);
      }
      console.log('----------------------');
    });

    // startApp();
  } catch (error) {
    console.log('Error retrieving employees:', error);
  }
};




// Function to add a department
async function addDepartment() {
  try {
    const departmentData = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
        validate: (input) => (input ? true : 'Department name cannot be empty'),
      },
    ]);

    const newDepartment = await Department.create(departmentData);
    console.log(`New department '${newDepartment.name}' added successfully.`);
  } catch (error) {
    console.error('Error adding department:', error);
  }
}

// Function to add a role
async function addRole() {
  try {
    const departments = await Department.findAll();
    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const roleData = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
        validate: (input) => (input ? true : 'Role title cannot be empty'),
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Enter the salary for the role:',
        validate: (input) => (input > 0 ? true : 'Salary must be a positive number'),
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for the role:',
        choices: departmentChoices,
      },
    ]);

    const newRole = await Role.create(roleData);
    console.log(`New role '${newRole.title}' added successfully.`);
  } catch (error) {
    console.error('Error adding role:', error);
  }
}

// Function to add an employee
const addEmployee = async () => {
  try {
    const roles = await Role.findAll({
      attributes: ['id', 'title'],
    });

    const departments = await Department.findAll({
      attributes: ['id', 'name'],
    });

    const employees = await Employee.findAll({
      attributes: ['id', 'firstName', 'lastName'],
    });

    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.firstName} ${employee.lastName}`,
      value: employee.id,
    }));

    const employeeData = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:",
        validate: (input) => (input ? true : "First name cannot be empty"),
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:",
        validate: (input) => (input ? true : "Last name cannot be empty"),
      },
      {
        type: 'list',
        name: 'roleId',
        message: "Select the employee's role:",
        choices: roleChoices,
      },
      {
        type: 'list',
        name: 'managerId',
        message: "Select the employee's manager:",
        choices: employeeChoices,
      },
    ]);

    // Create the new employee using the retrieved data
    const newEmployee = await Employee.create(employeeData);
    console.log('New employee added successfully.');

    // Call the startApp function to display the main menu again
    // startApp();
  } catch (error) {
    console.log('Error adding employee:', error);
  }
};




// Function to update an employee's role
async function updateEmployeeRole() {
  try {
    const employees = await Employee.findAll();
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.firstName} ${employee.lastName}`,
      value: employee.id,
    }));

    const roles = await Role.findAll({
      attributes: ['id', 'title'],
      include: { model: Department, as: 'Department' },
    });

    const roleChoices = roles.map((role) => ({
      name: `${role.title} (${role.Department.name})`,
      value: role.id,
    }));

    const employeeRoleData = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to update:',
        choices: employeeChoices,
      },
      {
        type: 'list',
        name: 'roleId',
        message: 'Select the new role for the employee:',
        choices: roleChoices,
      },
    ]);

    const updatedEmployee = await Employee.findByPk(employeeRoleData.employeeId);
    await updatedEmployee.update({ roleId: employeeRoleData.roleId });

    console.log('Employee role updated successfully.');

    // Call the startApp function to display the main menu again
    // startApp();
  } catch (error) {
    console.error('Error updating employee role:', error);
  }
}



// Function to exit the application
function exitApp() {
  console.log('Exiting the application...');
  process.exit(0);
}

// Main function to prompt the user for actions
async function main() {
  try {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'View all departments', value: 'viewDepartments' },
          { name: 'View all roles', value: 'viewRoles' },
          { name: 'View all employees', value: 'viewEmployees' },
          { name: 'Add a department', value: 'addDepartment' },
          { name: 'Add a role', value: 'addRole' },
          { name: 'Add an employee', value: 'addEmployee' },
          // { name: 'Update an employee role', value: 'updateEmployeeRole' },
          { name: 'Exit', value: 'exit' },
        ],
      },
    ]);

    switch (action) {
      case 'viewDepartments':
        await viewAllDepartments();
        break;
      case 'viewRoles':
        await viewAllRoles();
        break;
      case 'viewEmployees':
        await viewAllEmployees();
        break;
      case 'addDepartment':
        await addDepartment();
        break;
      case 'addRole':
        await addRole();
        break;
      case 'addEmployee':
        await addEmployee();
        break;
      case 'updateEmployeeRole':
        await updateEmployeeRole();
        break;
      case 'exit':
        exitApp();
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the main function
main();


// Function to view all employees
// async function viewAllEmployees() {
//   try {
//     const employees = await Employee.findAll({
//       include: [
//         { model: Role, as: 'role', include: Department },
//         { model: Employee, as: 'manager' },
//       ],
//     });
//     console.log('Employees:');
//     employees.forEach((employee) => {
//       console.log(
//         `- ${employee.firstName} ${employee.lastName} (${employee.role.title}, ${employee.Department.name}) - Manager: ${
//           employee.manager ? `${employee.manager.firstName} ${employee.manager.lastName}` : 'None'
//         }`
//       );
//     });
//   } catch (error) {
//     console.error('Error retrieving employees:', error);
//   }
// }
// Function to view all employees
// const viewAllEmployees = async () => {
//   try {
//     const employees = await Employee.findAll({
//       attributes: [
//         'id',
//         'firstName',
//         'lastName',
//         'createdAt',
//         'updatedAt',
//         'roleId',
//         'managerId',
//       ],
//       include: [
//         {
//           model: Role,
//           as: 'role',
//           attributes: [
//             'id',
//             'title',
//             'salary',
//             'DepartmentId',
//           ],
//           include: {
//             model: Department,
//             as: 'Department', // Specify the alias as 'Department'
//             attributes: ['id', 'name'],
//           },
//         },
//         {
//           model: Employee,
//           as: 'manager',
//           attributes: [
//             'id',
//             'firstName',
//             'lastName',
//             'createdAt',
//             'updatedAt',
//             'roleId',
//             'managerId',
//           ],
//         },
//       ],
//     });

//     // Rest of the code...
//   } catch (error) {
//     console.log('Error retrieving employees:', error);
//   }