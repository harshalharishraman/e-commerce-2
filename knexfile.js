require("dotenv").config();
module.exports={
  client:'pg',

  connection:{
    host: 'db-backend.cpcwkiaoyii5.ap-south-1.rds.amazonaws.com',
    user: 'postgres',
    password: 'harshal27B',
    database: 'postgres',

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