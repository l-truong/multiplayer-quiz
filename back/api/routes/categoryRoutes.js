const express = require('express');
const router = express.Router();
const Category = require('../models/category');

/********/
/* GET */
/********/

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one category
router.get('/:id', async (req, res, next) => {
    let category;
    try {
        category = await Category.findById(req.params.id);
        if (category === null) {
            return res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.category = category;
    next();
}, (req, res) => {
    res.json(res.category);
});


/********/
/* POST */
/********/

// Create a new category
router.post('/', async (req, res) => {
    // Check for missing parameters
    const missingParams = [];
    const requiredParams = ['name', 'description', 'language'];

    requiredParams.forEach(param => {        
        if (req.body[param] === undefined) {
            missingParams.push(param);
        }
    });

    if (missingParams.length > 0) {
        return res.status(400).json({
            message: 'Missing parameters',
            missing: missingParams
        });
    }

    // Check if parameters are strings and valid
    const invalidParams = {};
    if (typeof req.body.name !== 'string') {
        invalidParams.name = req.body.name;
    }
    if (typeof req.body.description !== 'string') {
        invalidParams.description = req.body.description;
    }
    if (typeof req.body.language !== 'string') {
        invalidParams.language = req.body.language;
    }

    if (Object.keys(invalidParams).length > 0) {
        return res.status(400).json({
            message: 'Parameters must be strings',
            invalidParams
        });
    }
    
    // Check if there is invalid language parameter
    if (!Category.schema.path('language').enumValues.includes(req.body.language)) {
        return res.status(400).json({
            message: 'Language must be part of [' + Category.schema.path('language').enumValues + ']',
            invalidParams:  req.body.language
        });
    }

    const category = new Category({
        name: req.body.name,
        description: req.body.description
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Create a list of categories
router.post('/bulk', async (req, res) => {
    const categories = req.body.categories;

    // Check if the request body is a non-empty array
    if (!Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({
            message: 'Category must be a non-empty array'
        });
    }
    
    const errors = [];
    const createdCategories = [];
    
    // Start a session for the transaction
    const session = await Category.startSession(); 
    session.startTransaction();

    try {
        for (const categoryData of categories) {
            // Validation logic (same as before)

            // Check for missing parameters
            const missingParams = [];
            const requiredParams = ['name', 'description', 'language'];

            requiredParams.forEach(param => {
                if (categoryData[param] === undefined) {
                    missingParams.push(param);
                }
            });

            if (missingParams.length > 0) {
                errors.push({
                    category: categoryData,
                    error: 'Missing parameters',
                    missing: missingParams
                });

                if (missingParams.includes('language')) {
                    continue;
                }
            }

            // Check if parameters are strings and valid
            const invalidParams = {};
            if (typeof categoryData.name !== 'string') {
                invalidParams.name = categoryData.name;
            }
            if (typeof categoryData.description !== 'string') {
                invalidParams.description = categoryData.description;
            }
            if (typeof categoryData.language !== 'string') {
                invalidParams.language = categoryData.language;
            }

            if (Object.keys(invalidParams).length > 0) {
                errors.push({
                    category: categoryData,
                    error: 'Parameters must be strings',
                    invalidParams
                });

                // Check if there is invalid language parameter
                if (!Category.schema.path('language').enumValues.includes(categoryData.language)) {
                    errors.push({
                        category: categoryData,
                        error: 'Language must be part of [' + Category.schema.path('language').enumValues + "]",                    
                        invalidParams:  categoryData.language
                    });          
                }                      
                continue;
            }     

            const category = new Category({
                name: categoryData.name,
                description: categoryData.description,
                language: categoryData.language
            });

            const newCategory = await category.save({ session });
            createdCategories.push(newCategory);
        }

        if (errors.length > 0) {
            await session.abortTransaction(); // Rollback if there are errors
            return res.status(400).json({ message: 'Some categories could not be processed', length: errors.length, errors: errors });
        }

        await session.commitTransaction(); // Commit if all went well
        res.status(201).json({ message: 'Categories created successfully', categories: createdCategories });

    } catch (err) {
        await session.abortTransaction(); // Rollback on error
        res.status(500).json({ message: 'An error occurred', error: err.message });
    } finally {
        session.endSession(); // End the session
    }
});

// Create a list of categories from csv
router.post('/csv', async (req, res) => {
    // todo
})


/********/
/* UPDATE */
/********/

// Update category
router.patch('/:id', async (req, res, next) => {
    let category;
    try {
        category = await Category.findById(req.params.id);
        if (category === null) {
            return res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.category = category;
    next();
}, async (req, res) => {
    let updated = false;

    // Check if parameters are strings and valid
    const invalidParams = {};
    if (req.body.name !== undefined && typeof req.body.name !== 'string') {
        invalidParams.name = req.body.name;
    }
    if (req.body.description !== undefined && typeof req.body.description !== 'string') {
        invalidParams.description = req.body.description;
    }
    if (req.body.language !== undefined && typeof req.body.language !== 'string') {
        invalidParams.language = req.body.language;
    }

    // If there are invalid parameters, return an error response
    if (Object.keys(invalidParams).length > 0) {
        return res.status(400).json({
            message: 'Parameters must be strings',
            invalidParams
        });
    }    
    if (req.body.language !== undefined && !Category.schema.path('language').enumValues.includes(req.body.language)) {
        return res.status(400).json({
            message: 'Language must be part of [' + Category.schema.path('language').enumValues + "]",
            invalidParams:  req.body.language
        });
    }

    if (req.body.name !== null && req.body.name !== res.category.name) {        
        res.category.name = req.body.name;
        updated = true;        
    }
    if (req.body.description !== null && req.body.description !== res.category.description) {
        res.category.description = req.body.description;
        updated = true;
    }
    if (req.body.language !== null && req.body.language !== res.category.language) {
        res.category.language = req.body.language;
        updated = true;
    }

    // Check if any field was updated
    if (!updated) {
        return res.status(200).json({ message: 'No fields were updated' });
    }

    // Update the updatedAt field to the current time
    res.category.updatedAt = new Date();

    try {
        const updatedCategory = await res.category.save();
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message }); 
    }
});


/********/
/* DELETE */
/********/

// Delete category
router.delete('/:id', async (req, res, next) => {
    let category;
    try {
        category = await Category.findById(req.params.id);
        if (category === null) {
            return res.status(404).json({ message: 'Category not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.category = category;
    next();
}, async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({
            message: 'Category deleted',
            deletedCategory: {
                _id: deletedCategory._id,
                categoryId: deletedCategory.categoryId,
                name: deletedCategory.name,
                description: deletedCategory.description,
                language: deletedCategory.language,
                createdAt: deletedCategory.createdAt,
                updatedAt: deletedCategory.updatedAt,
                __v: deletedCategory.__v,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;