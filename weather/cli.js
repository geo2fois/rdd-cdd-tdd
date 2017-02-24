#!/usr/bin/env node
'use strict';

// Declaration of the requirements
const meow = require('meow');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
const weather = require('./');

// Creation of the default value
const cli = meow({
	help: [
		'Usage',
		'  $ weather <input>',
		'',
		'Options',
		'  city [Default: Dhaka]',
		'  country [Default: Bangladesh]',
		'  scale (C/F) [Default: Celcius]',
		'',
		'Examples',
		'  $ weather London UK C',
		'  London, UK',
		'  Condition: Partly Cloudy',
		'  Temperature: 32C'
	]
});

// Function to convert temperature from Fahrenheit to Celcius
function _toCelcius(temp) {
	return Math.round(((temp - 32) * 5) / 9);
}

// Check actual package
updateNotifier({ pkg}).notify();

weather(cli.input, (err, result) => {
	if (err) {
		console.log(chalk.bold.red(err));
		process.exit(1);
	}

    // data assignation to variables
	let condition = result.query.results.channel.item.condition.text;
	let temperature;

    // IF statement to now the temperature data type
	if (cli.input[2] && cli.input[2] === 'C') {     // If seeking for a temperature in Celcius
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	} else if (cli.input[2] && cli.input[2] === 'F') {     // If seeking for a temperature in Fahrenheit
		temperature = result.query.results.channel.item.condition.temp + 'F';
	} else { // In other case convert to Celcius
		temperature = _toCelcius(result.query.results.channel.item.condition.temp) + 'C';
	}

    // Assignation of the default value to their variable
	let city = cli.input[0] ? cli.input[0] : 'Dhaka';
	let country = cli.input[1] ? cli.input[1] : 'Bangladesh';

    // Display of the datas in the console
	console.log(chalk.red(city + ', ' + country));
	console.log(chalk.cyan('Condition: ' + chalk.yellow(condition)));
	console.log(chalk.cyan('Temperature: ' + chalk.yellow(temperature)));
	process.exit();
});
