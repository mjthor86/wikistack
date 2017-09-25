const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

module.exports = router;

router.post('/', (req, res, next) => {
  console.log(req.body);
  User.findOrCreate({
    where: { name: req.body.name },
    defaults: { email: req.body.email }
  })
  .then(result => {
    const user = result[0];
    const page = Page.build({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags.split(' '),
      status: req.body.status
    });

    return page.save()
      .then(newPage => { return newPage.setAuthor(user); });
  })
  .then(page => res.redirect(page.route))
  .catch(next);
});

router.get('/add', (req, res, next) => {
  res.render('addpage');
});

router.get('/search', (req, res, next) => {
  const tagArray = req.query.tag.split(' ');
  // Page.findAll({
  //   where: {
  //     tags: {
  //       $overlap: tagArray
  //     }
  //   }
  // })
  Page.findByTag(tagArray)
    .then(pages => {
      res.render('index', { pages: pages });
    });
});

router.get('/:urlTitle', (req, res, next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
    .then(foundPage => {
      foundPage.getAuthor()
        .then(user => {
          res.render('wikipage', {
            page: foundPage,
            tags: foundPage.tags.join(' '),
            user: user
          });
        });
      })
    .catch(next);
});

