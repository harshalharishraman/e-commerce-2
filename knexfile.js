require("dotenv").config();
module.exports={
  client:'pg',

  connection:{
    host: '127.0.0.1',
    user: 'postgres',
    password: process.env.pwd,
    database: process.env.db,
  },

  migrations: {
    tableName: 'ecom2_knex_migs',
    directory: './mig',
  },
};

// npx knex migrate:make create_users_table