const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

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

init();

function init() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Employee', 'Add Department', 'Add Role', 'Update Employee Role', 'Quit'],
            name: 'toDo'
        }
    ]).then( (answer) => {
        let choice = answer.toDo;
        switch (choice) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'View All Employees':
                viewDepartments();
                break;
            case 'View All Employees':
                viewRoles();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Quit':
                db.end();
                break;           
        }
    })
}

function viewEmployees() {
    db.query('SELECT * FROM employees', (err, results) => {
        console.log('');
        console.log('');
        console.table(results);
        init();
    });     
}

function viewDepartments() {
    db.query('SELECT * FROM departments', (err, results) => {
        console.log('');
        console.log('');
        console.table(results);
        init();
    }); 
}

function viewRoles() {
    db.query('SELECT * FROM roles', (err, results) => {
        console.log('');
        console.log('');
        console.table(results);
        init();
    }); 
}

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the employees first name.',
            name: 'firstName'
        },
        {
            type: 'input',
            message: 'Please enter the employees last name.',
            name: 'lastName'
        }
    ]).then( answer => {
        let newFirstName = answer.firstName;
        let newLastName = answer.lastName;

        db.query('INSERT INTO employees (employee_firstName, employee_lastName) VALUES(?,?)',
            [
                newFirstName,
                newLastName
            ], err => {
                viewEmployees();
            }
        )
    })
}

function addDepartment() {
    
}

function addRole() {

}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });