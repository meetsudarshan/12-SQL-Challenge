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
async function viewAllRoles() {
  try {
    const roles = await Role.findAll({ include: Department });
    console.log('Roles:');
    roles.forEach((role) => {
      console.log(`- ${role.title} (${role.Department.name}) - Salary: ${role.salary}`);
    });
  } catch (error) {
    console.error('Error retrieving roles:', error);
  }
}

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
const viewAllEmployees = async () => {
  try {
    const employees = await Employee.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'createdAt',
        'updatedAt',
        'roleId',
        'managerId',
      ],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: [
            'id',
            'title',
            'salary',
            'DepartmentId',
          ],
          include: {
            model: Department,
            as: 'Department', // Specify the alias as 'Department'
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
            'createdAt',
            'updatedAt',
            'roleId',
            'managerId',
          ],
        },
      ],
    });

    // Rest of the code...
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

    const roleChoices = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const departmentChoices = departments.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    // Rest of the code...
  } catch (error) {
    console.log('Error adding employee:', error);
  }
};


// Function to update an employee's role
async function updateEmployeeRole() {
  try {
    const employees = await Employee.findAll();
    const employeeChoices = employees.map((employee) => ({
      name: `${employee.firstName} ${employee.lastName} (${employee.role.title}, ${employee.Department.name})`,
      value: employee.id,
    }));

    const roles = await Role.findAll();
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

    console.log(`Employee role updated successfully.`);
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
          { name: 'Update an employee role', value: 'updateEmployeeRole' },
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
