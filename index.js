const { request } = require('express');
var express = require('express');
cors = require('cors');
app = express();
bodyParser= require('body-parser');

const port= process.env.PORT || 3000;

//załadowanie routerów
kontrahenci= require('./routes/kontrahenci');
faktury= require('./routes/faktury');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

//dodanie routerów do serwera
app.use(kontrahenci);
app.use(faktury);











app.listen(port, () => console.log(`Serwer uruchomiony. Nasluchuje na porcie ${port}`));