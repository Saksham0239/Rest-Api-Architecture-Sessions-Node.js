const mongoose=require('mongoose');

require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const Schema=mongoose.Schema;


const promotionSchema= new Schema({
    name:{
        type: String,
        required: true,//This is required 
        unique: true//name should be unique
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:''
    },
    price:{
        type:Currency,
        required:true,
        min:0
    },
    featured:{
        type:Boolean,
        default: false
    }
},
{
    timestamps: true
        });


var promotions=mongoose.model("Promotions",promotionSchema);

module.exports=promotions;