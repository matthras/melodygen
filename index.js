const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Yay, melodygen is working!')
});

app.listen(2222, () => {
	console.log("MelodyGen listening on Port 2222")
})