const mongoose=require('mongoose')
var validator = require( 'validator')
const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema({
        firstName:{
         type:String,
        required:[true,'user must have a firstname'],
        minlength:[3,"User first name must be at least 3 characters"],
        maxlength :[12, "User first name must be less than 12 characters"],
        },
        lastName:{
        type:String,
        },
    
    email:{
        type:String,
        unique:true,
        validate: [validator.isEmail, "Invalid email format"],
    },
    
    password:{
        type:String,
        unique:true,
        select:false,
        // validate: {
        //     validator: function (value) {
        //       return RegExp(
        //         /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-z]).{8,}$/
        //       ).test(value);
        //     },
        //     message:
        //       "Password must be at least 8 characters long and include at least one uppercase letter, one digit, and one special character",
        //   },
    },
    city:String,
    phone:{
        type:String,
        //unique:true,
        // validate: {
        //     validator: function (value) {
        //       return RegExp(/^01[0-2,5]{1}[0-9]{8}$/gm).test(value);
        //     },
        //     message: "Invalid phone number",
        //   },
    },
    DOB:Date,
    age:{type:Number,
        min: [16, "User must be at least 16 years old"]
    },
    gender: {
        type: String,
        enum: {
          values: ["male", "female"],
          message: "Gender must be male, female",
        },
      },
      cartId: {
        type: mongoose.Schema.ObjectId,
        ref: "Cart",
      },
      role: {type:String,
          enum: {
          values: ["admin","customer","supplier"],
          message:"Role must be admin, customer, supplier",
    },
    default: "customer"
  },
}
    ,{
        toJSON:{virtuals:true},
        toObject:{virtuals:true}

    }
    )

    userSchema.pre("save", async function (next) {
      this.password = await bcrypt.hash(this.password, 12);
    
      next();
    });

    userSchema.methods.comparePassword = async function (userPassword) {
      return await bcrypt.compare(userPassword, this.password);
    };
    // 1) Document Middleware

//   userSchema.pre("save", function (next) {
    
//    try {
//     const x=    new Date().getFullYear() - this.DOB.getFullYear();
// if(x>=16){
//   this.age =x
//   next();

// }
// else{
//   throw "error"
// }
// }
//     catch(error){
//     }
//   });
  
  
//   userSchema.post("save", function (doc, next) {
//     console.log("post save Middleware");
//     next();
//   });
  
  // 2) Query Middleware
  userSchema.pre("find", function (next) {
    this.find({ age: { $gt: 21} });
    next();
  });

// 3) Aggregation Middleware
userSchema.pre("aggregate", function (next) {
    console.log("aggregate");
    next();
  });
    
    // userSchema.virtual("fullName").get(function(){
    //      return this.firstName+" "+this.lastName
    //  })
    //  userSchema.virtual('age').get(function() {
    //       return new Date().getFullYear() - this.DOB.getFullYear();
    //   });

    const User=new mongoose.model('User',userSchema)    
    module.exports=User;