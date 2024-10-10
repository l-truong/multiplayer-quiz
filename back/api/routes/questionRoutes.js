const express = require('express');
const router = express.Router();
const Question = require('../models/question');
const Category = require('../models/category');


/********/
/* GET */
/********/

// Get all questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get one question
router.get('/:id', async (req, res, next) => {
    let question;
    try {
        question = await Question.findById(req.params.id);
        if (question === null) {
            return res.status(404).json({ message: 'Cannot find question' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.question = question;
    next();
}, (req, res) => {
    res.json(res.question);
});

// Get random array of questions of length size
router.get('/length/:length', async (req, res) => {
    const length = parseInt(req.params.length);
    if (isNaN(length)) {
        return res.status(400).json({ message: 'Length must be a number' });
    }

    try {
        const questions = await Question.find();
        const shuffledQuestions = questions.sort(() => 0.5 - Math.random());        
        const selectedQuestions = shuffledQuestions.slice(0, length);        
        res.json(selectedQuestions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


/********/
/* POST */
/********/

// Create a new question
router.post('/', async (req, res) => {
    // Check for missing parameters
    const missingParams = [];
    const requiredParams = ['questionText', 'options', 'correctAnswer', 'categoryId'];   

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

    // Check if options parameter is an array and has exactly 4 elements
    if (!Array.isArray(req.body.options) || req.body.options.length !== 4) {
        return res.status(400).json({
            message: 'Options must be an array of exactly 4 elements',
            invalidParams: {
                options: req.body.options
            }
        });
    }

    // Check for null or empty elements in options parameter
    const hasInvalidOptions = req.body.options.some(option => option === null || option === '');
    if (hasInvalidOptions) {
        return res.status(400).json({
            message: 'Options cannot contain null or empty elements',
            invalidParams: {
                options: req.body.options
            }
        });
    }

    // Check if correctAnswer parameter is included in options parameter
    if (!req.body.options.includes(req.body.correctAnswer)) {
        return res.status(400).json({
            message: 'Correct answer must be one of the options',
            invalidParams: {
                correctAnswer: req.body.correctAnswer
            }
        });
    }

    // Check if rest of parameters are strings
    const invalidParams = {};
    if (typeof req.body.questionText !== 'string') {
        invalidParams.questionText = req.body.questionText;
    }
    if (typeof req.body.correctAnswer !== 'string') {
        invalidParams.correctAnswer = req.body.correctAnswer;
    }
    if (typeof req.body.explanation !== 'string') {
        invalidParams.explanation = req.body.explanation;
    }
    if (typeof req.body.categoryId !== 'string') {
        invalidParams.categoryId = req.body.categoryId;
    }

    // If there are invalid parameters, return an error response
    if (Object.keys(invalidParams).length > 0) {
        return res.status(400).json({
            message: 'Parameters must be strings',
            invalidParams
        });
    }
    
    try {
        // Check if categoryId parameters exists in the Category collection
        const categoryExists = await Category.findById(req.body.categoryId);
        if (!categoryExists) {
            return res.status(400).json({
                message: 'Invalid categoryId. Category does not exist',
                invalidParams: {
                    categoryId: req.body.categoryId
                }
            });
        }

        const question = new Question({
            questionText: req.body.questionText,
            options: req.body.options,
            correctAnswer: req.body.correctAnswer,
            explanation: req.body.explanation,
            categoryId: req.body.categoryId
        });

        const newQuestion = await question.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


/********/
/* UPDATE */
/********/

// Update question
router.patch('/:id', async (req, res, next) => {
    let question;
    try {
        question = await Question.findById(req.params.id);
        if (question === null) {
            return res.status(404).json({ message: 'Cannot find question' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.question = question;
    next();
}, async (req, res) => {
    let updated = false;

    // Check options parameter if provided
    if (req.body.options !== undefined) {
        // Check if options parameters is an array and has exactly 4 elements
        if (!Array.isArray(req.body.options) || req.body.options.length !== 4) {
            return res.status(400).json({
                message: 'Options must be an array of exactly 4 elements',
                invalidParams: {
                    options: req.body.options
                }
            });
        }

        // Check for null or empty elements in options parameters
        const hasInvalidOptions = req.body.options.some(option => option === null || option === '');
        if (hasInvalidOptions) {
            return res.status(400).json({
                message: 'Options cannot contain null or empty elements',
                invalidParams: {
                    options: req.body.options
                }
            });
        }  

        // Check if correctAnswer parameters is included in options
        if (!req.body.options.includes(req.body.correctAnswer)) {
            return res.status(400).json({
                message: 'Correct answer must be one of the options',                
                invalidParams: {
                    correctAnswer: req.body.correctAnswer
                }
            });
        }

        // Check if option parameters was updated
        if (req.body.options !== null && JSON.stringify(req.body.options) !== JSON.stringify(res.question.options)) {
            res.question.options = req.body.options;
            updated = true;
        }
    }    

    // Check flag parameter if provided
    if (req.body.flags !== undefined) {        
        // Check if flag parameter is an array
        if (!Array.isArray(req.body.flags)) {
            return res.status(400).json({
                message: 'Flags must be an array',
                invalidParams: {
                    flags: req.body.flags
                }
            });
        }

        // Check if flags parameter was updated
        if (req.body.flags !== null && JSON.stringify(req.body.flags) !== JSON.stringify(res.question.flags)) {
            res.question.flags = req.body.flags;
            updated = true;
        }
    }

    // Check if rest of parameter are strings
    const invalidParams = {};

    // Check categoryId parameter if provided
    if (req.body.categoryId !== undefined) {
        if (typeof req.body.categoryId !== 'string') {
            invalidParams.categoryId = req.body.categoryId;
        }
        else {
            // Check if categoryId parameter exists
            try {
                const categoryExists = await Category.findById(req.body.categoryId);
                if (!categoryExists) {
                    return res.status(400).json({
                        message: 'Invalid categoryId. Category does not exist',
                        invalidParams: {
                            categoryId: req.body.categoryId
                        }
                    });
                }
                
                // Check if categoryId parameter was updated
                if (req.body.categoryId !== res.question.categoryId.toString()) {
                    res.question.categoryId = req.body.categoryId;
                    updated = true;
                }
            } catch (err) {
                console.log("err")
                return res.status(500).json({ message: err.message });
            }
        }        
    }
    
    // Check if rest of parameters are strings
    if (req.body.questionText !== undefined && typeof req.body.questionText !== 'string') {
        invalidParams.questionText = req.body.questionText;
    }
    if (req.body.correctAnswer !== undefined && typeof req.body.correctAnswer !== 'string') {
        invalidParams.correctAnswer = req.body.correctAnswer;
    }
    if (req.body.explanation !== undefined && typeof req.body.explanation !== 'string') {
        invalidParams.explanation = req.body.explanation;
    }

    // If there are invalid parameters, return an error response
    if (Object.keys(invalidParams).length > 0) {
        return res.status(400).json({
            message: 'Parameters must be strings',
            invalidParams
        });
    }

    if (req.body.questionText !== null && req.body.questionText !== res.question.questionText) {    
        res.question.questionText = req.body.questionText;
        updated = true;
    }
    if (req.body.correctAnswer !== null && req.body.correctAnswer !== res.question.correctAnswer) {       
        res.question.correctAnswer = req.body.correctAnswer;
        updated = true;
    }
    if (req.body.explanation !== null && req.body.explanation !== res.question.explanation) {        
        res.question.explanation = req.body.explanation;
        updated = true;
    }    
    
    // Check if any field was updated
    if (!updated) {
        return res.status(200).json({ message: 'No fields were updated' });
    }

    // Update the updatedAt field to the current time
    res.question.updatedAt = new Date();

    try {
        const updatedQuestion = await res.question.save();
        res.json(updatedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


/********/
/* DELETE */
/********/

// Delete question
router.delete('/:id', async (req, res, next) => {
    let question;
    try {
        question = await Question.findById(req.params.id);
        if (question === null) {
            return res.status(404).json({ message: 'Cannot find question' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.question = question;
    next();
}, async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({
            message: 'Question deleted',
            deletedQuestion: {
                _id: deletedQuestion._id,
                questionText: deletedQuestion.questionText,
                options: deletedQuestion.options,
                correctAnswer: deletedQuestion.correctAnswer,
                explanation: deletedQuestion.explanation,
                categoryId: deletedQuestion.categoryId,
                flags: deletedQuestion.flags,
                createdAt: deletedQuestion.createdAt,
                updatedAt: deletedQuestion.updatedAt,
                __v: deletedQuestion.__v
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;