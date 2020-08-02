const mongoose=require('mongoose');

require('mongoose-currency').loadType(mongoose);
const Currency=mongoose.Types.Currency;

const Schema=mongoose.Schema;


const leaderSchema= new Schema({
    name:{
        type: String,
        required: true,//This is required 
        unique: true//name should be unique
    },
    designation:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    abbr:{
        type: String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default: false
    }
},
{
    timestamps: true
        });


var Leaders=mongoose.model("Leaders",leaderSchema);

module.exports=Leaders;