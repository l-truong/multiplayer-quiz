const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer();
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
        res.status(500).json({ 
            message: 'An error occurred', 
            error: err.message 
        });
    }
});

// Get random array of questions of length size
router.get('/random/:random?', async (req, res) => {    
    // Check for missing parameters random
    const { random } = req.params;
    if (random === undefined) {
        return res.status(404).json({ 
            message: 'An error occurred', 
            error: 'Parameter is required' 
        });
    }

    // Check if random parameter is a number and positif
    const length = parseInt(random, 10);
    if (isNaN(length) || length < 1) {
        return res.status(404).json({ 
            message: 'An error occurred', 
            error: 'Parameter must be a positive number' 
        });
    }

    try {
        const questions = await Question.find();
        const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffledQuestions.slice(0, length);
        res.json(selectedQuestions);
    } catch (err) {
        return res.status(500).json({ 
            message: 'An error occurred', 
            error: err.message 
        });
    } 
});

// Get one question
router.get('/:id', async (req, res, next) => {
    let question;
    try {
        question = await Question.findById(req.params.id);
        if (question === null) {
            return res.status(404).json({ 
                message: 'An error occurred', 
                error: 'Question not found' 
            });
        }
    } catch (err) {
        return res.status(500).json({ 
            message: 'An error occurred', 
            error: err.message 
        });
    }
    res.question = question;
    next();
}, (req, res) => {
    res.json(res.question); 
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
        if (req.body[param] === undefined || req.body[param] === null || req.body[param] === '') {
            missingParams.push(param);
        }
    });

    if (missingParams.length > 0) {
        return res.status(400).json({
            message: 'An error occurred', 
            error: 'Missing parameters',
            missing: missingParams
        });
    }

    // Check if options parameter is an array and has exactly 4 elements
    if (!Array.isArray(req.body.options) || req.body.options.length !== 4) {
        return res.status(400).json({
            message: 'An error occurred',
            error: 'Options must be an array of exactly 4 elements',
            invalidParams: {
                options: req.body.options
            }
        });
    }

    // Check for null or empty elements in options parameter
    const hasInvalidOptions = req.body.options.some(option => option === null || option === '');
    if (hasInvalidOptions) {
        return res.status(400).json({
            message: 'An error occurred',
            error: 'Options cannot contain null or empty elements',
            invalidParams: {
                options: req.body.options
            }
        });
    }

    // Check for unique options
    const uniqueOptions = new Set(req.body.options);
    if (uniqueOptions.size !== req.body.options.length) {
        return res.status(400).json({
            message: 'An error occurred',
            error: 'Options must be unique',
            invalidParams: {
                options: req.body.options
            }
        });
    }

    // Check if correctAnswer parameter is included in options parameter
    if (!req.body.options.includes(req.body.correctAnswer)) {
        return res.status(400).json({
            message: 'An error occurred', 
            error: 'Correct answer must be one of the options',
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
            message: 'An error occurred', 
            error: 'Parameters must be strings',
            invalidParams
        });
    }
    
    try {
        // Check if categoryId parameters exists in the Category collection
        const categoryExists = await Category.findOne({ categoryId: req.body.categoryId });
        if (!categoryExists) {
            return res.status(400).json({
                message: 'An error occurred',
                error: 'Invalid categoryId. Category does not exist',
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
        res.status(500).json({ 
            message: 'An error occurred', 
            error: err.message 
        });
    }
});

// Create a list of questions
router.post('/bulk', async (req, res) => {  
    const questions = req.body.questions;

    // Check if the request body is a non-empty array
    if (!Array.isArray(questions)  || questions.length === 0) {
        return res.status(400).json({
            message: 'An error occurred', 
            error: 'Categories must be a non-empty array'
        });
    }

    // Start a session for the transaction
    const session = await Category.startSession(); 
    session.startTransaction();

    try {
        const errors = [];

        for (const questionData of questions) {
            // Check for missing parameters
            const missingParams = [];
            const requiredParams = ['questionText', 'options', 'correctAnswer', 'categoryId'];   

            requiredParams.forEach(param => {
                if (questionData[param] === undefined  || questionData[param] === null || questionData[param] === '') {
                    missingParams.push(param);
                }
            });

            if (missingParams.length > 0) {
                errors.push({                    
                    error: 'Missing parameters',                    
                    missing: missingParams,
                    question: questionData
                });
            }

            if (!missingParams.includes("options") && (!Array.isArray(questionData.options) || questionData.options.length !== 4)) {
                errors.push({                    
                    error: 'Options must be an array of exactly 4 elements',
                    question: questionData,
                    invalidParams: {
                        options: questionData.options
                    }
                });
            }

            if(!missingParams.includes("options")) {
                const hasInvalidOptions = questionData.options.some(option => option === null || option === '');
                if (hasInvalidOptions) {
                    errors.push({                    
                        error: 'Options cannot contain null or empty elements',
                        question: questionData,
                        invalidParams: {
                            options: questionData.options
                        }
                    });
                }
            }

            if(!missingParams.includes("options")) {
                const uniqueOptions = new Set(questionData.options);
                if (uniqueOptions.size !== questionData.options.length) {
                    errors.push({     
                        message: 'An error occurred',
                        error: 'Options must be unique',
                        invalidParams: {
                            options: questionData.options
                        }
                    });
                }
            }

            if (!missingParams.includes("options") && !questionData.options.includes(questionData.correctAnswer)) {
                errors.push({                    
                    error: 'Correct answer must be one of the options',
                    question: questionData,
                    invalidParams: {
                        correctAnswer: questionData.correctAnswer
                    }
                });
            }

            const invalidParams = {};
            if (!missingParams.includes("questionText") && typeof questionData.questionText !== 'string') {
                invalidParams.questionText = questionData.questionText;
            }
            if (!missingParams.includes("correctAnswer") && typeof questionData.correctAnswer !== 'string') {
                invalidParams.correctAnswer = questionData.correctAnswer;
            }
            if (!missingParams.includes("explanation") && typeof questionData.explanation !== 'string') {
                invalidParams.explanation = questionData.explanation;
            }
            if (!missingParams.includes("categoryId") && typeof questionData.categoryId !== 'string') {
                invalidParams.categoryId = questionData.categoryId;
            }

            if (Object.keys(invalidParams).length > 0) {
                errors.push({                    
                    error: 'Parameters must be strings',
                    question: questionData,
                    invalidParams
                });
            }

            if (!missingParams.includes("categoryId")) {
                const categoryExists = await Category.findOne({ categoryId: questionData.categoryId }).session(session);                
                if (!categoryExists) {
                    errors.push({
                        question: questionData,
                        error: 'Invalid categoryId. Category does not exist',
                        invalidParams: {
                            categoryId: questionData.categoryId
                        }
                    });
                }
            }           
        }

        if (errors.length > 0) {
            await session.abortTransaction(); // Rollback if there are errors
            return res.status(400).json({ 
                message: 'Some categories could not be processed', 
                length: errors.length, 
                errors: errors
            });
        }

        const createdQuestions = [];
        for (const questionData of questions) {
            const question = new Question({
                questionText: questionData.questionText,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer,
                explanation: questionData.explanation,
                categoryId: questionData.categoryId
            });

            const newQuestion = await question.save({ session });
            createdQuestions.push(newQuestion);
        }

        await session.commitTransaction(); // Commit if all went well
        res.status(201).json({ 
            message: 'Questions created successfully', 
            questions: createdQuestions
        });
    } catch (err) {
        await session.abortTransaction(); // Rollback on error
        res.status(500).json({ 
            message: 'An error occurred',
            error: err.message 
        });
    } finally {
        session.endSession(); // End the session
    }
});

// Create a list of questions from csv
router.post('/csv', upload.single('questions'), async (req, res) => {
    // todo
})


/********/
/* UPDATE */
/********/

// Update question
router.patch('/:id', async (req, res, next) => {
    let question;
    try {
        question = await Question.findById(req.params.id);
        if (question === null) {
            return res.status(404).json({ 
                message: 'An error occurred',
                error: 'Question not found'
            });
        }
    } catch (err) {
        return res.status(500).json({ 
            message: 'An error occurred',
            error: err.message 
        });
    }
    console.log(question)
    res.question = question;
    next();
}, async (req, res) => {
    let updated = false;

    // Check options parameter if provided
    if (req.body.options !== undefined && req.body.options !== null) {
        // Check if options parameters is an array and has exactly 4 elements
        if (!Array.isArray(req.body.options) || req.body.options.length !== 4) {
            return res.status(400).json({
                message: 'An error occurred',
                error: 'Options must be an array of exactly 4 elements',
                invalidParams: {
                    options: req.body.options
                }
            });
        }

        // Check for null or empty elements in options parameters
        const hasInvalidOptions = req.body.options.some(option => option === null || option === '');
        if (hasInvalidOptions) {
            return res.status(400).json({
                message: 'An error occurred',
                error: 'Options cannot contain null or empty elements',
                invalidParams: {
                    options: req.body.options
                }
            });
        }  

        // Check if correctAnswer parameters is included in options
        if (!req.body.options.includes(req.body.correctAnswer)) {
            return res.status(400).json({
                message: 'An error occurred',
                error: 'Correct answer must be one of the options',                
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

    // Check if rest of parameter are strings
    const invalidParams = {};

    // Check categoryId parameter if provided
    if (req.body.categoryId !== undefined && req.body.categoryId !== null && req.body.categoryId !== '' && typeof req.body.categoryId !== 'string') {
        if (typeof req.body.categoryId !== 'string') {
            invalidParams.categoryId = req.body.categoryId;
        }
        else {
            // Check if categoryId parameter exists
            try {
                const categoryExists = await Category.findOne({ categoryId: req.body.categoryId });                            
                if (!categoryExists) {
                    return res.status(400).json({
                        message: 'An error occurred',
                        error: 'Invalid categoryId. Category does not exist',
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
                res.status(500).json({
                    message: 'An error occurred',
                    error: err.message,
                });
            }
        }        
    }
    
    // Check if rest of parameters are strings    
    if (req.body.questionText !== undefined && req.body.questionText !== null && req.body.questionText !== '' && typeof req.body.questionText !== 'string') {
        invalidParams.questionText = req.body.questionText;
    }
    if (req.body.correctAnswer !== undefined && req.body.correctAnswer !== null && req.body.correctAnswer !== '' && typeof req.body.correctAnswer !== 'string') {
        invalidParams.correctAnswer = req.body.correctAnswer;
    }
    if (req.body.explanation !== undefined && req.body.explanation !== null && req.body.explanation !== '' && typeof req.body.explanation !== 'string') {
        invalidParams.explanation = req.body.explanation;
    }

    // If there are invalid parameters, return an error response
    if (Object.keys(invalidParams).length > 0) {
        return res.status(400).json({
            message: 'An error occurred',
            error: 'Parameters must be strings',
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
        return res.status(200).json({
            message: 'No fields were updated' 
        });
    }

    // Update the updatedAt field to the current time
    res.question.updatedAt = new Date();

    console.log(req.body)
    console.log(res.question)
    try {
        const updatedQuestion = await res.question.save();
        res.json(updatedQuestion);
    } catch (err) {
        res.status(400).json({ 
            message: 'An error occurred',
            error: err.message
        }); 
    }
});


// Change toutes les id d'une categorie à une autre
router.patch('/categories', async (req, res, next) => {
    // todo
})


/********/
/* DELETE */
/********/

// Delete all questions
router.delete('/all', async (req, res) => {       
    try {
        const result = await Question.deleteMany({});

        res.json({
            message: 'All questions deleted',
            deletedCount: result.deletedCount,
        });
    } catch (err) {
        res.status(500).json({
            message: 'An error occurred',
            error: err.message,
        });
    }
});

// Delete question
router.delete('/:id', async (req, res, next) => {
    let question;
    try {
        question = await Question.findById(req.params.id);
        if (question === null) {
            return res.status(404).json({                 
                message: 'An error occurred',
                error: 'Question not found' 
            });
        }
    } catch (err) {
        return res.status(500).json({ 
            message: 'An error occurred',
            error: err.message
        });
    }
    res.question = question;
    next();
}, async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        
        if (!deletedQuestion) {
            return res.status(404).json({ 
                message: 'An error occurred',
                error: 'Question not found'
            });
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
                createdAt: deletedQuestion.createdAt,
                updatedAt: deletedQuestion.updatedAt,
                __v: deletedQuestion.__v
            }
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'An error occurred',
            error: err.message 
        });
    }
});

module.exports = router;