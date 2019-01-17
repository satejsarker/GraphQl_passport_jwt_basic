const mongoose=require('mongoose');

mongoose.connect('mongodb://satej:satej11@ds147974.mlab.com:47974/event', { useNewUrlParser: true });
mongoose.connection.once('open',()=>{
    console.log('connnect to MongoDB')
});

var UserSchema = new mongoose.Schema({
    email: {type:String,unique:true,
        required : true, dropDups: true },
    passowrd:String
  }, {timestamps: false});
 
  let satej={
      email:"satej@gmail.com",
      passowrd:'satej'
  }


var  User=mongoose.model('user', UserSchema);
let newUswe=new User(satej)
// newUswe.save().then((data)=>{
//     console.log(data);
// }).catch(err=>console.log(err))
  module.exports =User;