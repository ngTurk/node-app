const http = require('http');

http.createServer((req, res) => {
	res.write('Hi!');
	res.end();
}).listen(3000);


console.log('Server is running on 3000!');
