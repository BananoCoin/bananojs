
const util = require('util')
const Error = require('./error.js');
exports.log = (...arg) => {
	return (function() { return console.log(...arguments)}).apply(console, arg);
};
exports.trace = (...arg) => {
	let str = util.format(...arg), i = 0;
	while (str[i]) {
		let n = Math.floor(Math.random() * 6) + 91;
		process.stdout.write(`\x1b[${n}m${str[i++]}\x1b[0m`);
	}
};
