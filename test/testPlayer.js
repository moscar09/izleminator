document.addEventListener("DOMContentLoaded", function(event) {
	require('../src/inlined.js')
	const main = require('../src/main.js')

	main.initialize({screenName: 'Testington' });
});
