const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

module.exports = router;

router.get('/', (req, res, next) => {
  User.findAll()
    .then(users => res.render('users', { users: users }))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  const userPromise = User.findById(req.params.id);
  const pagesPromise = Page.findAll({
    where: {
      authorId: req.params.id
    }
  });

  Promise.all([userPromise, pagesPromise])
    .then(values => {
      const user = values[0];
      const pages = values[1];
      res.render('user', { user: user, pages: pages });
    })
    .catch(next);
});
