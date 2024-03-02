const express = require('express');
const router = express.Router();
const {Category} = require('../app/models')



router.post('/create',async (req,res,next)=>{
    const CategoryName = req.body.name;
    console.log(CategoryName);
    try{
        await Category.create({
            CategoryName:CategoryName,
        });
        res.send({message:"category Created"});
    }catch(error){
        res.send(error);
    }
});

router.get('/',async (req,res,next)=>{
    try{
        const categories =await Category.findAll();
        res.send(categories);
    }catch(error){
        res.send(error);
    }
});
router.post('/update/:id',async (req,res,next)=>{
    const id = req.params.id;
    const CategoryName = req.body.name;
    console.log(CategoryName);
    console.log(id);
    try{
        const category =await Category.findByPk(id);
        console.log(category);
        if(category ){
            category.CategoryName = CategoryName;
            await category.save();
            res.send({message:"Category Updated SuccessFully"});
        }else{
            res.send({message:"Category Not Found"});
        }

        
    }catch(error){
        res.send(error);
    }
});
router.post('/delete/:id',async (req,res,next)=>{
    const id = req.params.id;
    try{
        const category = await Category.findByPk(id);
        if(category ){
            category.destroy();
            res.send({message:"Category Deleted SuccessFully"});
        }else{
            res.send({message:"Category Not Found"});
        }

        
    }catch(error){
        res.send(error);
    }
});
module.exports = router;