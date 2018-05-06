

document.addEventListener("DOMContentLoaded", function(event) {
	require('../scripts/inlined.js')
	const main = require('../scripts/main.js')

	console.log("initalied");
	main.initialize({screenName: 'Testington' });
});
