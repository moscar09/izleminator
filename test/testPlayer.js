document.addEventListener("DOMContentLoaded", function(event) {
	require('../src/inlined.js')
	const main = require('../src/main.js')

	console.log("initialized26");
	main.initialize({screenName: 'Testington' });
});
