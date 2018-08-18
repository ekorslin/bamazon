const cTable = require('console.table');
var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazonDB"
});

// Declaring 'welcome' function prompting management for desired task

// function welcome() {
inquirer.prompt([
  {
    type: "list",
    name: "supervisorOptions",
    message: "Hello, manager.  What would you like to do today?",
    choices: ['View Product Sales by Department' , 'Create New Department'],
  }
   ]).then(function(answer){
    var choice = answer.supervisorOptions;
    if (choice == 'View Product Sales by Department') {
    connection.connect(function(err) {
        if (err) throw err;
        connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS total_sales, (SUM(products.product_sales) - departments.over_head_costs) AS total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id, departments.department_name ORDER BY departments.department_id", function (err, result) {
          

            if (err) throw err;
          console.table(result)})});
     
            
    } else if (choice == 'Create New Department') {
            inquirer.prompt([
                {
                  type: "input",
                  name: "department_name",
                  message: "What is the name of your new department?",
                },
                {
                    type: "input",
                    name: "over_head",
                    message: "What are the overhead costs associated with this department?",
                  }
                 ]).then(function(answer){
                    connection.query(
                        "INSERT INTO departments SET ?",
                        
                          {
                            department_name: answer.department_name,
                            over_head_costs: answer.over_head
                          },
                          function(err) {
                            if (err) throw err;
                            console.log("The Department has been added to the database!");
                          })})}});
        