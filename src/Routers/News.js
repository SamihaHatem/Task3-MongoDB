const express=require('express')
const router=express.Router()
const News=require('../Models/News')
const auth=require('../middleware/auth')
const multer=require('multer')
const { findOne } = require('../Models/News')


//  1 -->  add news  *********************************************************************************
router.post('/news/add',auth,async(req,res)=>{
    try{
        const news=News({...req.body,owner:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//  2 -->  get news by id *********************************************************************************
router.get('/news/getbyID/:id',auth,async(req,res)=>{
try{
    const _id=req.params.id
    const news=await News.findOne({_id,owner:req.reporter._id})
    if(!news) return res.status(404).send('Cannot find news !')
    res.status(200).send(news)
}
catch(error){
    res.status(400).send(error.message)
}
})

//  3 -->  get all news *********************************************************************************
router.get('/news/getAll',auth,async(req,res)=>{
    try{
        await req.reporter.populate('News')
        res.status(200).send(req.reporter.News)
    }
    catch(error){
        res.status(400).send("error"+error.message)
    }
})
 
// 4 --> delete by ID *********************************************************************************
router.delete('/news/deletebyID/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const news=await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news) return res.status(404).send('Cannot find news !')
        res.status(200).send(news.title+" --> is Deleted Successfulyy :)")
    }
    catch(error){
        res.status(400).send(error.message)
    }
})

//  5 --> return news owner *********************************************************************************
router.get('/news/owner/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const news=await News.findOne({_id,owner:req.reporter._id})
        if(!news) return res.status(404).send('Cannot find news !')
        await news.populate('owner')
        res.status(200).send(news.owner)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})

// image function
const upload=multer({
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jif)$/))
          return cb( new Error('please enter img with extension => (jpg|jpeg|png|jif)'))
        cb(null,true)
    },
    limits:{
        fileSize:2000000
    }
})

//  6 --> add image to reporter ***********************************************************************
router.post('/news/img/:id',auth,upload.single('image'),async(req,res)=>{
    try{
        const _id=req.params.id
        const news=await News.findOne({_id,owner:req.reporter._id})
        if(!req.file) return res.status(400).send('please add image!')
        if(!news) return res.status(404).send('Cannot find news!')
        news.image=req.file.buffer
        news.save()
        res.status(200).send("Image uplaoded successfully :) ")

      /*      await req.reporter.populate('News')
        const allnews=req.reporter.News
        const _id=req.params.id
        if(!req.file) return res.status(400).send('please add image!')
        allnews.forEach(news=>{
            if(news._id==_id) {
                news.image=req.file.buffer
                console.log('doneeee')
                news.save()
                return res.status(200).send("Image uplaoded successfully :) ")
            }
        })
        return res.status(404).send("Cannot find news ")
        */
        //if(!news) return res.status(404).send('Cannot find news !')
        /* news.image=req.file.buffer
        await news.save()
        res.status(200).send("Image uplaoded successfully :) ") */
    }
    catch(error){
        res.status(400).send(error.message)
    }

})

// 7 --> delete image ******************************************************************************************
router.delete('/news/img/:id',auth,upload.single('image'),async(req,res)=>{
    try{
        const _id=req.params.id
        const news=await News.findOne({_id,owner:req.reporter._id})
        if(!news) return res.status(404).send('Cannot find news!')
        news.image=null
        news.save()
        res.status(200).send("Image deleted successfully :) ")
    }
    catch(error){
        res.status(400).send(error.message)
    }

})


// 8 --> update news by id   ***************************************************************************
router.patch('/news/update/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const updates=Object.keys(req.body)
        const news=await News.findOne({_id,owner:req.reporter._id})
        if(!news) return res.status(404).send('Cannot find news !')
        updates.forEach(update=>{
            news[update]=req.body[update]
        })
        news.save()
        res.status(200).send(news)
    }
    catch(error){
        res.status(400).send(error.message)
    }
})


module.exports=router