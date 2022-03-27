const jwt=require('jsonwebtoken')
const Reporter=require('../Models/Reporter')


const auth=async (req,res,next)=>{
   try{
    const token=req.header('Authorization').replace('Bearer ','')
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    const reporter=await Reporter.findOne({_id:decode._id,tokens:token})
   
    if(!reporter)
       throw new Error('NOT AUTHORIZED !!')
    req.reporter=reporter
    req.token=token
    next()
   }
   catch(e){
       res.status(401).send("Please Authenticate !")
   }
}

module.exports=auth