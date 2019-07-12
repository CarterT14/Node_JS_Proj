const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!!!')
;});

app.get('/api/courses', (req,res) => {
    res.send([1, 2, 3]);
});


app.listen(3000, () => console.log('Listenning on port 3000....'));