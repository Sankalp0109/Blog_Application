const express = require('express');
const router = express.Router();
const { Category } = require('../app/models')


router.get('/', async (req, res, next) => {
    const format = req.query.format;
    try {
        const categories = await Category.findAll();
        if (format === 'json') {
            res.send(categories);
        } else {
            res.render('Category', { categories: categories });
        }
    } catch (error) {
        res.send(error);
    }
});
router.post('/create', async (req, res, next) => {
    const CategoryName = req.body.name;
    console.log(req.body);
    try {
        await Category.create({
            CategoryName: CategoryName,
        });
        res.redirect('/category/');
    } catch (error) {
        res.send(error);
    }
});


router.get('/update/:id', async (req, res, next) => {
    const id = req.params.id;
    const CategoryName = req.query.cat;
    console.log(CategoryName);
    console.log(id);
    try {
        const category = await Category.findByPk(id);
        console.log(category);
        if (category) {
            category.CategoryName = CategoryName;
            await category.save();
            res.redirect('/category/');
        } else {
            res.send({ message: "Category Not Found" });
        }


    } catch (error) {
        res.send(error);
    }
});
router.get('/delete/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const category = await Category.findByPk(id);
        if (category) {
            category.destroy();
            res.redirect('/category/');
        } else {
            res.send({ message: "Category Not Found" });
        }


    } catch (error) {
        res.send(error);
    }
});
module.exports = router;