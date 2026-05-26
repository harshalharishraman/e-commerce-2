require("dotenv").config();
module.exports={
  client:'pg',

  connection:{
    host: process.env.aws_rds_host,
    user: process.env.aws_rds_user,
    password: process.env.aws_rds_ped,
    database:process.env.aws_rds_db,

    ssl: {
      rejectUnauthorized: false
    }
  },

  migrations: {
    tableName: 'ecom2_knex_migs',
    directory: './mig',
  },
};

// npx knex migrate:make create_users_table