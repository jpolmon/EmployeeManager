const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let db;

console.log(`,------------------------------------------------------.`);
console.log(`|                                                      |`);
console.log(`|    ______                 _                          |`);
console.log(`|   |  ____|_ __ ___  _ __ | | ___  _   _  ___  ___    |`);
console.log(`|   |   _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\   |`);
console.log(`|   |  |___| | | | | | |_) | | (_) | |_| |  __/  __/   |`);
console.log(`|   |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|   |`);
console.log(`|                    |_|            |___/              |`);
console.log(`|    __  __                                            |`);
console.log(`|   |  \\/  | __ _ _ __   __ _  __ _  ___ _ __          |`);
console.log(`|   | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|         |`);
console.log(`|   | |  | | (_| | | | | (_| | (_| |  __/ |            |`);
console.log(`|   |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|            |`);
console.log(`|                             |___/                    |`);
console.log(`|                                                      |`);
console.log(`\`------------------------------------------------------'`);

initDB();
init();

async function initDB() {
    db = await mysql.createConnection(
        {
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'employees_db'
        },
        console.log(`Connected to the employees_db database.`)
    );
}

async function init() {
    
    let answer = await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'View All Departments', 'Add Department', 'View All Roles', 'Add Role', 'Quit'],
            name: 'toDo'
        }
    ])
    let choice = answer.toDo;
    switch (choice) {
        case 'View All Employees':
            viewEmployees();
            break;        
        case 'Add Employee':
            addEmployee();
            break;
        case 'Remove Employee':
            removeEmployee();
            break;
        case 'Update Employee Role':
            updateRole();
            break;
        case 'View All Departments':
            viewDepartments();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'Quit':
            process.exit();      
    }    
}

async function viewEmployees() {
    const [employees] = await db.query(`SELECT employee.id, employee.first_name, employee.last_name, 
                                        roles.title, departments.department, roles.salary, 
                                        CONCAT(managerName.first_name," ",managerName.last_name) AS manager 
                                        FROM employees employee 
                                        LEFT JOIN employees managerName ON employee.manager_id = managerName.id
                                        LEFT JOIN roles                 ON employee.role_id = roles.id 
                                        LEFT JOIN departments           ON roles.department_id = departments.id;`)
    console.log('');
    console.log('');
    console.table(employees);
    init();     
}

async function viewDepartments() {
    const [departments] = await db.query('SELECT * FROM departments')
    console.log('');
    console.log('');
    console.table(departments);
    init(); 
}

async function viewRoles() {
    const [roles] = await db.query('SELECT roles.id, roles.title, roles.salary, departments.department FROM roles LEFT JOIN departments ON roles.department_id = departments.id;')
    console.log('');
    console.log('');
    console.table(roles);
    init();
}

async function addEmployee() {
    const [employees] = await db.query('SELECT first_name, last_name, id FROM employees')
    const [roles] = await db.query('SELECT title, id FROM roles')
    const noManager = [{name: 'None', value: ''}]

    let newEmployee = await inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the employee\'s first name.',
            name: 'firstName'
        },
        {
            type: 'input',
            message: 'Please enter the employee\'s last name.',
            name: 'lastName'
        },
        {
            type: 'list',
            message: 'Please select the employee\'s role',
            name: 'role',
            choices: roles.map((role) => ({name: role.title, value: role}))
        },
        {
            type: 'list',
            message: 'Please enter the employee\'s manager',
            name: 'manager',
            choices: noManager.concat(employees.map((employee) => ({name: `${employee.first_name} ${employee.last_name}`, value: employee})))
        }
    ])

    let newFirstName = newEmployee.firstName;
    let newLastName = newEmployee.lastName;
    let role = newEmployee.role.id;
    let manager = newEmployee.manager.id;

    db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)',
        [
            newFirstName,
            newLastName,
            role,
            manager
        ]
    )
    console.log('');
    console.log('');
    console.log(`${newFirstName} ${newLastName} was added to the database.`)
    viewEmployees();    
}

async function removeEmployee() {
    const [employees] = await db.query('SELECT first_name, last_name, id FROM employees')
    const {employeeToRemove} = await inquirer.prompt({
        name: 'employeeToRemove',
        type: 'list',
        message: 'Which employee would you like to remove?',
        choices: employees.map((employee) => ({name: `${employee.first_name} ${employee.last_name}`, value: employee}))
    })
    db.query('DELETE FROM employees WHERE id = ?', employeeToRemove.id);
    console.log('');
    console.log('');
    console.log(`${employeeToRemove.first_name} ${employeeToRemove.last_name} was deleted from the database.`);
    viewEmployees();
}

async function updateRole() {
    const [employees] = await db.query('SELECT * FROM employees');
    const [roles] = await db.query('SELECT * FROM roles');

    const updateEmployee = await inquirer.prompt([
        {
        name: 'employee',
        type: 'list',
        message: 'Which employee would would you like to update?',
        choices: employees.map((employee) => ({name: `${employee.first_name} ${employee.last_name}`, value: employee}))
        },
        {
        name: 'role',
        type: 'list',
        message: 'Which role would you like to assign to them?',
        choices: roles.map((role) => ({name: role.title, value: role}))   
        }
    ]);
    
    let employeeUpdate = updateEmployee.employee.id;
    let roleUpdate = updateEmployee.role.id;

    db.query(`UPDATE employees SET role_id = ${roleUpdate} WHERE id = ${employeeUpdate}`);
    console.log('');
    console.log('');
    console.log(`${updateEmployee.employee.first_name} ${updateEmployee.employee.last_name} has been assigned the role ${updateEmployee.role.title}.`)
    console.log('');
    console.log('');
    init();
}

async function addDepartment() {
    let newDepartment = await inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the name of the department',
            name: 'name'
        },
    ])

    let newDepartmentName = newDepartment.name;

    db.query('INSERT INTO departments (department) VALUES (?)', newDepartmentName);
    console.log('');
    console.log('');
    console.log(`Added ${newDepartmentName} to the database.`);
    init();
}

async function addRole() {
    const [departments] = await db.query('SELECT * FROM departments')
    
    const newRole = await inquirer.prompt([
        {
            type: 'input',
            message: 'Please input the name of the role.',
            name: 'name'
        },
        {
            type: 'number',
            message: 'Please enter the role\'s salary.',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Which department does the role fall under?',
            name: 'department',
            choices: departments.map((department) => ({name: department.department, value: department}))
        }
    ]);

    let newRoleName = newRole.name;
    let newRoleSalary = newRole.salary;
    let newRoleDepartment = newRole.department.id;

    db.query('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)',
        [
            newRoleName,
            newRoleSalary,
            newRoleDepartment
        ]
    )
    console.log('');
    console.log('');
    console.log(`Added ${newRoleName} to the database.`);
    init();
}