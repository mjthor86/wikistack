const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const path = require('path');
const models = require('./models/index');
const chalk = require('chalk');

const app = express();

const env = nunjucks.configure('views', { noCache: true });
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

models.db.sync({})
.then(() => {
  app.listen(3000, () => {
    chalk.green('LISTEN ON 3000');
  });
})
.catch(console.error);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.render('index.html');
});
