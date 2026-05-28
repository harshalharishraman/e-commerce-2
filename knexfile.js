require("dotenv").config();
module.exports={
  client:'pg',

  connection:{
    host: process.env.aws_rds_host,
    user: process.env.aws_rds_user,
    password: process.env.aws_rds_prd,
    database:process.env.aws_rds_db,

    ssl: {
      rejectUnauthorized: false
    }
  },

  pool: {
    min: 2,
    max: 10
  },

  acquireConnectionTimeout: 30000,

  migrations: {
    tableName: 'ecom2_knex_migs',
    directory: './mig',
  },
};

// npx knex migrate:make create_users_table