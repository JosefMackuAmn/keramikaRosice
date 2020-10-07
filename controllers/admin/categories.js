const mongoose = require('mongoose');

const Category = require('../../models/category');
const Subcategory = require('../../models/subcategory');
const Product = require('../../models/product');

//////////////////////
///// Categories
exports.getCategories = async (req, res, next) => {
    const allCategories = await Category.find({});
    const allSubcategories = await Subcategory.find({});

    res.render('admin/categories', {
        title: 'Categories',
        categories: allCategories,
        subcategories: allSubcategories
    })
}

// Posting new categories and subcategories
exports.postCategories = async (req, res, next) => {
    const categoryId = req.body.categoryId || false;
    const name = req.body.categoryName.toLowerCase();

    // If categoryId has been passed, subcategory will be created
    if (categoryId) {
        // Check validity of categoryId string
        const isValidId = mongoose.Types.ObjectId.isValid(categoryId);
        if (!isValidId) {
            return res.status(422).json({
                msg: "categoryId is not a valid ID string"
            });
        }
        // Try to find category by its ID      
        const category = await Category.findById(categoryId);
        if (category) {
            // Create and save new subcategory
            const newSubcategory = new Subcategory({
                name: name,
                categoryId: category._id
            })
            await newSubcategory.save();
            return res.status(201).json({
                msg: "Subcategory created",
                subcategory: newSubcategory
            })
        }
        return res.status(422).json({
            msg: "Category does not exist"
        })
    }

    // If categoryId hasn't been passed, category will be created
    const newCategory = new Category({
        name: name
    });
    await newCategory.save();
    return res.status(201).json({
        msg: "Category created",
        category: newCategory
    })
}

// Delete category
exports.deleteCategory = async (req, res, next) => {
    const categoryId = req.params.categoryId;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(422).json({
            msg: "categoryId is not a valid ID string"
        })
    }

    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (deletedCategory) {
        await Subcategory.deleteMany({ categoryId: categoryId });
        await Product.update({ categoryId: categoryId }, { $set: { categoryId: null }}, { multi: true });

        return res.status(200).json({
            msg: "Category deleted successfully with all of its subcategories, related products are now uncategorized",
            category: deletedCategory
        })
    }
    return res.status(202).json({
        msg: "Category not found"
    })
}

// Update category
exports.putCategory = async (req, res, next) => {
    const categoryId = req.body.categoryId;
    const newName = req.body.newCategoryName.toLowerCase();

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(422).json({
            msg: "categoryId is not a valid ID string"
        })
    }

    const updatedCategory = await Category.update({ _id: categoryId }, {name: newName });
    
    return res.status(200).json({
        msg: "Category successfully updated",
        category: updatedCategory
    })
}

// Delete subcategory
exports.deleteSubcategory = async (req, res, next) => {
    const subcategoryId = req.params.subcategoryId;

    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(422).json({
            msg: "subcategoryId is not a valid ID string"
        })
    }

    const deletedSubcategory = await Subcategory.findByIdAndDelete(subcategoryId);
    if (deletedSubcategory) {
        await Product.update({ subcategoryId: subcategoryId }, { $set: { subcategoryId: null }}, { multi: true });

        return res.status(200).json({
            msg: "Subcategory deleted successfully, related products are now unsubcategorized",
            category: deletedSubcategory
        })
    }
    return res.status(202).json({
        msg: "Subcategory not found"
    })
}

// Update subcategory
exports.putSubcategory = async (req, res, next) => {
    const subcategoryId = req.body.subcategoryId;
    const newName = req.body.newCategoryName.toLowerCase();

    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(422).json({
            msg: "subcategoryId is not a valid ID string"
        })
    }

    await Subcategory.updateOne({ _id: subcategoryId }, { name: newName });
    
    return res.status(200).json({
        msg: "Category successfully updated"
    })
}