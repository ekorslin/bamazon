var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM products", function (err, result) {
     if (err) throw err;
        var resultArray = JSON.stringify(result);
        console.table(result);
    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "Which item would you like to purchase?"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many units of this item would you like to buy?"
        },

    ]).then(function(input) {
        
        var item = input.choice;
        var requestedQTY = input.quantity;
        var queryStr = 'SELECT * FROM products WHERE ?';
		connection.query(queryStr, {ID: item}, function(err, data) {
            var chosenData = data[0];
            var currentStock = chosenData.stock_quantity;
            var utPrice = chosenData.price;
            currentSales = chosenData.product_sales;
            var sales = parseInt(requestedQTY) * parseInt(utPrice);
            if (err) throw err;
            if (requestedQTY <= currentStock) {
                var updateSales = 'UPDATE products SET product_sales = ' + (parseInt(sales) + parseInt(currentSales)) + ' WHERE ID = ' + item
                connection.query(updateSales, function(err, data) {
                    if (err) throw err;
                var updateQTY = 'UPDATE products SET stock_quantity = ' + (chosenData.stock_quantity - requestedQTY) + ' WHERE ID = ' + item
                connection.query(updateQTY, function(err, data) {
                    if (err) throw err;
                    console.log("Good news.  We have sufficient stock to cover your order.  The total cost today will be: $" + sales);
                })})} else {
                console.log("I do apologize.  We currently do not have enough stock to fill your order.");
            }
    })})})});