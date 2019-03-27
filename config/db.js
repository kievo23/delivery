const Sequelize = require("sequelize");
// DB connection
const connection = new Sequelize('dabl94o1t3kqtm','aqowuqifwhbrls','fae3a17714f1ad1bf3458e32bb6c30f84fd3c8c5480d3dda6607b5663b71301d',{
    host:'ec2-75-101-131-79.compute-1.amazonaws.com',
    dialect:'postgres',
    operatorsAliases:false,
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
});

connection.authenticate()
    .then(()=>{
        console.log('success : db connection established')
    })
    .catch(err=>{
        console.log('fail : Unable to connect to db\n',err)
    })

connection.sync({
  //force:true
});

module.exports = connection;
