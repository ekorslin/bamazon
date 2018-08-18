// Connect to Inquirer npm & mySQL
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
    name: "managerOptions",
    message: "Hello, manager.  What would you like to do today?",
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
  }
   ]).then(function(answer){
 var choice = answer.managerOptions;

//  If manager chooses the first option "View Products for Sale", the following SQL query is executed to pull prodct information from the mySQL database
 
if (choice == 'View Products for Sale') {
    connection.connect(function(err) {
        if (err) throw err;
        connection.query("SELECT * FROM products", function (err, result) {
        if (err) throw err;
        console.table(result)})})}

// The following command is executived when the "View Low Inventory" command is selected 

else if (choice == 'View Low Inventory') {
    connection.connect(function(err) {
        if (err) throw err;
        connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, result) {
        if (err) throw err;
        console.table(result)})});

// The following command is executived when the "Add to Inventory" command is selected         

    } else if (choice == 'Add to Inventory') {
        connection.connect(function(err) {
            if (err) throw err;
            connection.query("SELECT * FROM products", function (err, result) {    
            if (err) throw err;
            console.table(result);
            inquirer.prompt([
              {
                name: "idSelection",
                type: "input",
                message: "Enter the ID Number of the product to which you'd like to add inventory?",
              },
                        {
                          name: "addRequest",
                          type: "input",
                          message: "How many units of would you like to add?",
                        },
                    ]).then(function(answers) {
                        console.log("Congrats!  " + answers.addRequest + " units have been added to inventory.");
                        // console.log(answers.idSelection);
                        var chosenQTY = result[answers.idSelection - 1].stock_quantity;
                        var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (parseInt(chosenQTY) + parseInt(answers.addRequest)) + ' WHERE ID = ' + answers.idSelection;
                		connection.query(updateQueryStr, function(err, data) {
                  if (err) throw err;
                        // console.log(data)
                        })})})})

// This portion of the code allows for the user to input new product details

             } else {
    inquirer.prompt([
        {
          type: "input",
          name: "product_name",
          message: "What is the item description?",
        },
        {
            type: "input",
            name: "department_name",
            message: "What department does the item belong in?",
          },
          {
            type: "input",
            name: "price",
            message: "What is the sell price for this item?",
          },
          {
            type: "input",
            name: "stock_quantity",
            message: "What QTY of this item would you like to stock?"
          }
         ]).then(function(answer){
            connection.query(
                "INSERT INTO products SET ?",
                
                  {
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity,
                    product_sales: 0
                  },
                  function(err) {
                    if (err) throw err;
                    console.log("Your item has been added to our list of available items!");
                  })})}})
