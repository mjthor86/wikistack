const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
  logging: false
});
const chalk = require('chalk');

const generateUrlTitle = title => {
  if (title) {
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    return Math.random().toString(36).substring(2, 7);
  }
};

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
}, {
  hooks: {
    beforeValidate: (page, options) => {
      page.urlTitle = generateUrlTitle(page.title);
    }
  },
  getterMethods: {
    route() {
      return '/wiki/' + this.urlTitle;
    }
  }
});

Page.prototype.findByTag = tagsToFind => {
  Page.findAll({
    where: {
      tags: {
        $overlap: tagsToFind
      }
    }
  })
    .then(pages => pages);
};

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
}, {
  getterMethods: {
    route() {
      return '/users/' + this.id;
    }
  }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  db: db,
  Page: Page,
  User: User
};
