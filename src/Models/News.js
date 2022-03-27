const mongoose=require('mongoose')
const opts = {
    timestamps: { currentTime: () => (Date.now()+ (2*60*60*1000)) },
  };
const newsSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'Reporter'
    },
    image:{
        type:Buffer
    }
},
opts
)

const News=mongoose.model('News',newsSchema)
module.exports=News