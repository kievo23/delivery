const Sequelize = require("sequelize");
// DB connection
const connection = new Sequelize('delivery','root','kev@50',{
    host:'localhost',
    dialect:'mysql',
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
