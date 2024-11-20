const mongoose = require('mongoose');
const request = require('supertest'); // Import supertest for HTTP testing
const express = require('express'); // Import express
const router = require('../../api/routes/questionRoutes'); // Import question routes
const Question = require('../../api/models/question'); // Import Question model
const Category = require('../../api/models/category'); // Import Category model
jest.mock('../../api/models/question'); // Mock the Question model methods
jest.mock('../../api/models/category'); // Mock the Category model methods

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use('/questions', router); // Use question routes

const { mockCategories } = require('../mocks/mockCategories');
const { headersQuestions, mockQuestions, mockValue } = require('../mocks/mockQuestions');
const { mockSession } = require('../mocks/mockSession');
const { setupQuestionsMocks, resetMocks } = require('../utils/setupMocks');
const { convertObjectIdsToStrings, convertObjectIdsToStringsInObject, convertObjectIdToString, arrayToCustomCsvBuffer } = require('../utils/convertFunctions');

beforeEach(() => {      
    setupQuestionsMocks();
});

afterEach(() => {
    resetMocks();
});


/********/
/* GET */
/********/

// GET /questions
describe('GET /questions', () => {
    it('should return all questions', async () => {
        const res = await request(app).get('/questions');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(convertObjectIdsToStrings(mockQuestions));

        const categoriesNull  = { categories: null };
        const resWithCategoriesNull = await request(app).get('/questions').send(categoriesNull);;
        expect(resWithCategoriesNull.status).toBe(500);
        expect(resWithCategoriesNull.body.message).toBe('An error occurred');
        expect(resWithCategoriesNull.body.error).toBe('Parameter categories should be an array and not contain null or empty values');

        const categoriesBadValues  = { categories: ['6702a8418357fa576c95ea43', '', null] };
        const resWithCategoriesBadValues = await request(app).get('/questions').send(categoriesBadValues);;
        expect(resWithCategoriesBadValues.status).toBe(500);
        expect(resWithCategoriesBadValues.body.message).toBe('An error occurred');
        expect(resWithCategoriesBadValues.body.error).toBe('Parameter categories should be an array and not contain null or empty values');

        const categories  = { categories: ['6702a8418357fa576c95ea43'] };
        const resWithCategories = await request(app).get('/questions').send(categories);      
        expect(resWithCategories.status).toBe(200);         
        expect(resWithCategories.body).toEqual(convertObjectIdsToStrings(mockQuestions.filter(question => categories.categories.includes(question.categoryId.toString()))));
    });

    it('should return 500 error on server failure', async () => {
        Question.find.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get('/questions');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });
});

// GET /questions/eng
describe('GET /questions/eng', () => {  
    it('should return 500 if parameter categories not an array or contain null or empty value', async () => {        
        const resNotArray = await request(app).get('/questions/eng').send({ categories : 0 });           
        expect(resNotArray.status).toBe(500);
        expect(resNotArray.body.message).toBe('An error occurred');
        expect(resNotArray.body.error).toBe('Parameter categories should be an array and not contain null or empty values');

        const resEmpty = await request(app).get('/questions/eng').send({ categories : [] });           
        expect(resEmpty.status).toBe(500);
        expect(resEmpty.body.message).toBe('An error occurred');
        expect(resEmpty.body.error).toBe('Parameter categories should be an array and not contain null or empty values');

        const resNullValue = await request(app).get('/questions/eng').send({ categories : ['6702a8418357fa576c95ea43', null] });           
        expect(resNullValue.status).toBe(500);
        expect(resNullValue.body.message).toBe('An error occurred');
        expect(resNullValue.body.error).toBe('Parameter categories should be an array and not contain null or empty values');
    });

    it('should return all questions in eng', async () => {        
        const res = await request(app).get('/questions/eng');           
        const categoryIds = mockCategories.filter(category => category.language === 'eng').map(item => item.categoryId.toString());
        expect(res.status).toBe(200);        
        expect(res.body).toEqual(convertObjectIdsToStrings(mockQuestions.filter(item => categoryIds.includes(item.categoryId.toString()))));

        const categoriesList = ['6702a8418357fa576c95ea43'];
        const resWithCategories = await request(app).get('/questions/eng').send({ categories : categoriesList });         
        const categoryIdsWithCategories = mockCategories.filter(category => category.language === 'eng' && categoriesList.includes(category.categoryId.toString())).map(item => item.categoryId.toString());       
        expect(resWithCategories.status).toBe(200);        
        expect(resWithCategories.body).toEqual(convertObjectIdsToStrings(mockQuestions.filter(item => categoryIdsWithCategories.includes(item.categoryId.toString()))));
    });

    it('should return 404 error if Category not found', async () => {
        Category.find.mockResolvedValue(null);
        const res = await request(app).get('/questions/eng');
        expect(res.status).toBe(404);        
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should return 500 error if Category not found', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get('/questions/eng');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 500 error on server failure', async () => {
        Question.find.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get('/questions/eng');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });
});

// GET /questions/fr
describe('GET /questions/fr', () => {  
    it('should return 500 if parameter categories not an array or contain null or empty value', async () => {        
        const resNotArray = await request(app).get('/questions/fr').send({ categories : 0 });           
        expect(resNotArray.status).toBe(500);
        expect(resNotArray.body.message).toBe('An error occurred');
        expect(resNotArray.body.error).toBe('Parameter categories should be an array and not contain null or empty values');

        const resEmpty = await request(app).get('/questions/fr').send({ categories : [] });           
        expect(resEmpty.status).toBe(500);
        expect(resEmpty.body.message).toBe('An error occurred');
        expect(resEmpty.body.error).toBe('Parameter categories should be an array and not contain null or empty values');

        const resNullValue = await request(app).get('/questions/fr').send({ categories : ['6702a8418357fa576c95ea43', null] });           
        expect(resNullValue.status).toBe(500);
        expect(resNullValue.body.message).toBe('An error occurred');
        expect(resNullValue.body.error).toBe('Parameter categories should be an array and not contain null or empty values');
    });

    it('should return all questions in fr', async () => {        
        const res = await request(app).get('/questions/fr');           
        const categoryIds = mockCategories.filter(category => category.language === 'fr').map(item => item.categoryId.toString());
        expect(res.status).toBe(200);        
        expect(res.body).toEqual(convertObjectIdsToStrings(mockQuestions.filter(item => categoryIds.includes(item.categoryId.toString()))));

        const categoriesList = ['672d0698004c7514fcd799af'];
        const resWithCategories = await request(app).get('/questions/fr').send({ categories : categoriesList });         
        const categoryIdsWithCategories = mockCategories.filter(category => category.language === 'fr' && categoriesList.includes(category.categoryId.toString())).map(item => item.categoryId.toString());       
        expect(resWithCategories.status).toBe(200);        
        expect(resWithCategories.body).toEqual(convertObjectIdsToStrings(mockQuestions.filter(item => categoryIdsWithCategories.includes(item.categoryId.toString()))));
    });

    it('should return 404 error if Category not found', async () => {
        Category.find.mockResolvedValue(null);
        const res = await request(app).get('/questions/fr');
        expect(res.status).toBe(404);        
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should return 500 error if Category not found', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get('/questions/fr');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 500 error on server failure', async () => {
        Question.find.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get('/questions/fr');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });
});

// GET /questions/random/:random
describe('GET /questions/random/:random', () => {
    it('should return 500 if parameter categories not an array or contain null or empty value', async () => {          
        const length = 2;    
        const resNotArray = await request(app).get(`/questions/random/${length}`).send({ categories : 0 });           
        expect(resNotArray.status).toBe(500);
        expect(resNotArray.body.message).toBe('An error occurred');
        expect(resNotArray.body.error).toBe('Parameter categories should be an array and not contain null or empty values');

        const resEmpty = await request(app).get(`/questions/random/${length}`).send({ categories : [] });           
        expect(resEmpty.status).toBe(500);
        expect(resEmpty.body.message).toBe('An error occurred');
        expect(resEmpty.body.error).toBe('Parameter categories should be an array and not contain null or empty values');

        const resNullValue = await request(app).get(`/questions/random/${length}`).send({ categories : ['6702a8418357fa576c95ea43', null] });           
        expect(resNullValue.status).toBe(500);
        expect(resNullValue.body.message).toBe('An error occurred');
        expect(resNullValue.body.error).toBe('Parameter categories should be an array and not contain null or empty values');
    });

    it('should return 404 if the random parameter is missing', async () => {
        const res = await request(app).get('/questions/random/');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Parameter is required');
    });

    it('should return 404 if the random parameter is not a positive number', async () => {
        const res = await request(app).get('/questions/random/0');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Parameter must be a positive number');

        const resNegative = await request(app).get('/questions/random/-5');
        expect(resNegative.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Parameter must be a positive number');

        const resNaN = await request(app).get('/questions/random/abc');
        expect(resNaN.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Parameter must be a positive number');
    });

    it('should return a list of questions when the random parameter is valid', async () => {       
        const length = 2;
        const res = await request(app).get(`/questions/random/${length}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(length);
        expect(res.body.every(question => 
            mockQuestions.some(mockQuestion => convertObjectIdToString(mockQuestion._id) === question._id)
        )).toBe(true);

        const categoriesList = ['672d0698004c7514fcd799af'];
        const resWithCategories = await request(app).get(`/questions/random/${length}`).send({ categories : categoriesList });         
        const categoryIdsWithCategories = mockCategories.filter(category => category.language === 'fr' && categoriesList.includes(category.categoryId.toString())).map(item => item.categoryId.toString());
        const mockQuestionsWithCategories = mockQuestions.filter(item => categoryIdsWithCategories.includes(item.categoryId.toString()));
        expect(resWithCategories.status).toBe(200);     
        expect(resWithCategories.body).toHaveLength(length);
        expect(resWithCategories.body.every(question => 
            mockQuestionsWithCategories.some(mockQuestion => convertObjectIdToString(mockQuestion._id) === question._id)
        )).toBe(true);
    });

    it('should return 500 error on server failure', async () => {
        Question.find.mockRejectedValue(new Error('Database error'));
        const length = 2;
        const res = await request(app).get(`/questions/random/${length}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });
});

// GET /stats/:lang?
describe('GET /stats/:lang?', () => {
    it('should return 404 error if Category not found', async () => {
        Category.find.mockResolvedValue(null);

        const res = await request(app).get('/questions/stats');
        expect(res.status).toBe(404);        
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');

        const resEnglish = await request(app).get('/questions/stats/eng');
        expect(resEnglish.status).toBe(404);        
        expect(resEnglish.body.message).toBe('An error occurred');
        expect(resEnglish.body.error).toBe('Category not found');

        const resFrench = await request(app).get('/questions/stats/fr');
        expect(resFrench.status).toBe(404);        
        expect(resFrench.body.message).toBe('An error occurred');
        expect(resFrench.body.error).toBe('Category not found');
    });

    it('should return 500 error if Category not found', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));

        const res = await request(app).get('/questions/stats');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');

        const resEnglish = await request(app).get('/questions/stats/eng');
        expect(resEnglish.status).toBe(500);
        expect(resEnglish.body.message).toBe('An error occurred');
        expect(resEnglish.body.error).toBe('Database error');

        const resFrench = await request(app).get('/questions/stats/fr');
        expect(resFrench.status).toBe(500);
        expect(resFrench.body.message).toBe('An error occurred');
        expect(resFrench.body.error).toBe('Database error');
    });

    it('should return 500 error on server failure', async () => {
        Question.find.mockRejectedValue(new Error('Database error'));

        const res = await request(app).get('/questions/stats');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');

        const resEnglish = await request(app).get('/questions/stats/eng');
        expect(resEnglish.status).toBe(500);
        expect(resEnglish.body.message).toBe('An error occurred');
        expect(resEnglish.body.error).toBe('Database error');

        const resFrench = await request(app).get('/questions/stats/fr');
        expect(resFrench.status).toBe(500);
        expect(resFrench.body.message).toBe('An error occurred');
        expect(resFrench.body.error).toBe('Database error');
    });

    it('should return stats', async () => {       
        const res = await request(app).get('/questions/stats');        
        const categoryIdsWithCategories = mockCategories.map(item => item.categoryId.toString());
        const mockQuestionsCategories = convertObjectIdsToStrings(mockQuestions.filter(item => categoryIdsWithCategories.includes(item.categoryId.toString())));
        const categoryCount = {};
        mockQuestionsCategories.forEach(item => { const categoryId = item.categoryId; categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1; });
        let result = Object.keys(categoryCount).map(categoryId => ({ categoryId: categoryId, occurence: categoryCount[categoryId] }));
        const categoryMap = {};
        mockCategories.forEach(item => { categoryMap[item.categoryId.toString()] = item.name; });
        result = result.map(item => ({ ...item, name: categoryMap[item.categoryId] }));
        expect(res.status).toBe(200);
        expect(res.body).toEqual(result);

        const resEnglish = await request(app).get('/questions/stats/eng');        
        const mockCategoriesEnglish = mockCategories.filter(category => category.language === 'eng');
        const categoryIdsWithCategoriesInEnglish = mockCategoriesEnglish.map(item => item.categoryId.toString());
        const mockQuestionsCategoriesInEnglish = convertObjectIdsToStrings(mockQuestions.filter(item => categoryIdsWithCategoriesInEnglish.includes(item.categoryId.toString())));
        const categoryCountEnglish = {};
        mockQuestionsCategoriesInEnglish.forEach(item => { const categoryId = item.categoryId; categoryCountEnglish[categoryId] = (categoryCountEnglish[categoryId] || 0) + 1; });
        let resultInEnglish = Object.keys(categoryCountEnglish).map(categoryId => ({ categoryId: categoryId, occurence: categoryCountEnglish[categoryId] }));
        const categoryMapEnglish = {};
        mockCategoriesEnglish.forEach(item => { categoryMapEnglish[item.categoryId.toString()] = item.name; });
        resultInEnglish = resultInEnglish.map(item => ({ ...item, name: categoryMapEnglish[item.categoryId] }));
        expect(resEnglish.status).toBe(200);
        expect(resEnglish.body).toEqual(resultInEnglish);

        const mockCategoriesFrench = mockCategories.filter(category => category.language === 'fr');
        const categoryIdsWithCategoriesInFrench = mockCategoriesFrench.map(item => item.categoryId.toString());
        const mockQuestionsCategoriesInFrench = convertObjectIdsToStrings(mockQuestions.filter(item => categoryIdsWithCategoriesInFrench.includes(item.categoryId.toString())));
        const categoryCountFrench = {};
        mockQuestionsCategoriesInFrench.forEach(item => { const categoryId = item.categoryId; categoryCountFrench[categoryId] = (categoryCountFrench[categoryId] || 0) + 1; });
        let resultInFrench = Object.keys(categoryCountFrench).map(categoryId => ({ categoryId: categoryId, occurence: categoryCountFrench[categoryId] }));
        const categoryMapFrench = {};
        mockCategoriesFrench.forEach(item => { categoryMapFrench[item.categoryId.toString()] = item.name; });
        resultInFrench = resultInFrench.map(item => ({ ...item, name: categoryMapFrench[item.categoryId] }));
        const resFrench = await request(app).get('/questions/stats/fr');
        expect(resFrench.status).toBe(200);
        expect(resFrench.body).toEqual(resultInFrench);
    });

    it('should return 404 parameter lang not a valid parameter', async () => {  
        const resJapanese = await request(app).get('/questions/stats/jap');
        expect(resJapanese.status).toBe(404);
        expect(resJapanese.body.message).toBe('An error occurred');
        expect(resJapanese.body.error).toBe('Parameter lang is not a valid parameter');
        expect(resJapanese.body.invalidParams.language).toBe('jap');
    });
});

// GET /questions/:id
describe('GET /questions/:id', () => {
    it('should return 404 error if question not found', async () => {
        Question.findById.mockResolvedValue(null);
        const res = await request(app).get(`/questions/${mockValue._id.toString()}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Question not found');
    });

    it('should return 500 error if findById fails', async () => {
        Question.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get(`/questions/${mockValue._id.toString()}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return a question by ID', async () => {
        Question.findById.mockResolvedValue(mockValue);
        const res = await request(app).get(`/questions/${mockValue._id.toString()}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(convertObjectIdsToStringsInObject(mockValue));
    });
});


/********/
/* POST */
/********/

// POST /questions
describe('POST /questions', () => {       
    it('should return 400 error if missing parameters', async () => {
        const newOnlyQuestionTest  = { questionText: 'Only question text' };
        Question.prototype.save.mockResolvedValue(newOnlyQuestionTest);
        const resOnlyQuestionText = await request(app).post('/questions').send(newOnlyQuestionTest);
        expect(resOnlyQuestionText.status).toBe(400);
        expect(resOnlyQuestionText.body.message).toBe('An error occurred');
        expect(resOnlyQuestionText.body.error).toBe('Missing parameters');
        expect(resOnlyQuestionText.body.missing).toEqual(['options', 'correctAnswer', 'categoryId']);
        
        const newOnlyOptions  = { options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'] };
        Question.prototype.save.mockResolvedValue(newOnlyOptions);
        const resOnlyOptions = await request(app).post('/questions').send(newOnlyOptions);
        expect(resOnlyOptions.status).toBe(400);
        expect(resOnlyOptions.body.message).toBe('An error occurred');
        expect(resOnlyOptions.body.error).toBe('Missing parameters');
        expect(resOnlyOptions.body.missing).toEqual(['questionText', 'correctAnswer', 'categoryId']);

        const newOnlyCorrectAnswer  = { correctAnswer: 'answer 2' };
        Question.prototype.save.mockResolvedValue(newOnlyCorrectAnswer);
        const resOnlyCorrectAnswer = await request(app).post('/questions').send(newOnlyCorrectAnswer);
        expect(resOnlyCorrectAnswer.status).toBe(400);
        expect(resOnlyCorrectAnswer.body.message).toBe('An error occurred');
        expect(resOnlyCorrectAnswer.body.error).toBe('Missing parameters');
        expect(resOnlyCorrectAnswer.body.missing).toEqual(['questionText', 'options', 'categoryId']);
    
        const newOnlyCategoryId  = { categoryId: 'categoryId'};
        Question.prototype.save.mockResolvedValue(newOnlyCategoryId);
        const resOnlyCategoryId = await request(app).post('/questions').send(newOnlyCategoryId);
        expect(resOnlyCategoryId.status).toBe(400);
        expect(resOnlyCategoryId.body.message).toBe('An error occurred');
        expect(resOnlyCategoryId.body.error).toBe('Missing parameters');
        expect(resOnlyCategoryId.body.missing).toEqual(['questionText', 'options', 'correctAnswer']);
    
        const newMissingAll  = {};
        Question.prototype.save.mockResolvedValue(newMissingAll);
        const resMissingAll = await request(app).post('/questions').send(newMissingAll);
        expect(resMissingAll.status).toBe(400);
        expect(resMissingAll.body.message).toBe('An error occurred');
        expect(resMissingAll.body.error).toBe('Missing parameters');
        expect(resMissingAll.body.missing).toEqual(['questionText', 'options', 'correctAnswer', 'categoryId']);
    });

    it('should return 400 error if options parameter is not 4 elements', async () => {
        const newInvalidOptions = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2'],
            correctAnswer: 'answer 1',
            categoryId: '6702a8418357fa576c95ea43'
        };
        const res = await request(app).post('/questions').send(newInvalidOptions);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Options must be an array of exactly 4 elements');
        expect(res.body.invalidParams.options).toEqual(['answer 1', 'answer 2']);
    });

    it('should return 400 error if null or empty elements in options parameter', async () => {
        const newEmptyOptions = {
            questionText: 'Question text',
            options: ['answer 1', '', 'answer 3', null],
            correctAnswer: 'answer 1',
            categoryId: '6702a8418357fa576c95ea43'
        };
        const res = await request(app).post('/questions').send(newEmptyOptions);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Options cannot contain null or empty elements');
        expect(res.body.invalidParams.options).toEqual(['answer 1', '', 'answer 3', null]);
    });

    it('should return 400 error if duplicates in options parameter', async () => {
        const newDuplicateOptions = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 3'],
            correctAnswer: 'answer 1',
            categoryId: '6702a8418357fa576c95ea43'
        };
        const res = await request(app).post('/questions').send(newDuplicateOptions);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Options must be unique');
        expect(res.body.invalidParams.options).toEqual(['answer 1', 'answer 2', 'answer 3', 'answer 3']);
    });

    it('should return 400 error if rest of parameters not string', async () => {             
        const newInvalidQuestionText = {
            questionText: 456,
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: 'answer 1',
            explanation: 'explanation',
            categoryId: '6702a8418357fa576c95ea43'
        };
        let resInvalidQuestionText = await request(app).post('/questions').send(newInvalidQuestionText);
        expect(resInvalidQuestionText.status).toBe(400);
        expect(resInvalidQuestionText.body.message).toBe('An error occurred');
        expect(resInvalidQuestionText.body.error).toBe('Parameters must be strings');
        expect(resInvalidQuestionText.body.invalidParams).toEqual({ questionText: 456 })

        const newInvalidCorrectAnswer = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: {},
            explanation: 'explanation',
            categoryId: '6702a8418357fa576c95ea43'
        };
        let resInvalidCorrectAnswer = await request(app).post('/questions').send(newInvalidCorrectAnswer);
        expect(resInvalidCorrectAnswer.status).toBe(400);
        expect(resInvalidCorrectAnswer.body.message).toBe('An error occurred');
        expect(resInvalidCorrectAnswer.body.error).toBe('Parameters must be strings');
        expect(resInvalidCorrectAnswer.body.invalidParams).toEqual({ correctAnswer: {} })

        const newInvalidExplanation = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: 'answer 1',
            explanation: 123,
            categoryId: '6702a8418357fa576c95ea43'
        };
        let resInvalidExplanation = await request(app).post('/questions').send(newInvalidExplanation);
        expect(resInvalidExplanation.status).toBe(400);
        expect(resInvalidExplanation.body.message).toBe('An error occurred');
        expect(resInvalidExplanation.body.error).toBe('Parameters must be strings');
        expect(resInvalidExplanation.body.invalidParams).toEqual({ explanation: 123 })

        const newInvalidCategoryId = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: 'Paris',
            explanation: 'explanation',
            categoryId: []
        };
        let resInvalidCategoryId = await request(app).post('/questions').send(newInvalidCategoryId);
        expect(resInvalidCategoryId.status).toBe(400);
        expect(resInvalidCategoryId.body.message).toBe('An error occurred');
        expect(resInvalidCategoryId.body.error).toBe('Parameters must be strings');
        expect(resInvalidCategoryId.body.invalidParams).toEqual({ categoryId: [] })

        const newInvalidAllParameters = {
            questionText: 123,
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: 456,
            explanation: 789,
            categoryId: 101
        };
        let resInvalidAllParameters = await request(app).post('/questions').send(newInvalidAllParameters);
        expect(resInvalidAllParameters.status).toBe(400);
        expect(resInvalidAllParameters.body.message).toBe('An error occurred');
        expect(resInvalidAllParameters.body.error).toBe('Parameters must be strings');
        expect(resInvalidAllParameters.body.invalidParams).toEqual({
            questionText: 123,
            correctAnswer: 456,
            explanation: 789,
            categoryId: 101
        });
    });

    it('should return 400 error if correctAnswer parameter is not included in options parameter', async () => {
        const newInvalidCorrectAnswer = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: 'answer 0',            
            explanation: 'explanation',
            categoryId: '6702a8418357fa576c95ea43'
        };
        const res = await request(app).post('/questions').send(newInvalidCorrectAnswer);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Correct answer must be one of the options');
        expect(res.body.invalidParams.correctAnswer).toBe('answer 0');
    });

    it('should return 400 if categoryId does not exist in the Category collection', async () => {
        const newQuestion = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: 'answer 1',
            explanation: 'explanation',
            categoryId: '6702a8418357fa576c95ea49'
        };
        const res = await request(app).post('/questions').send(newQuestion);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Invalid categoryId. Category does not exist');
        expect(res.body.invalidParams.categoryId).toBe(newQuestion.categoryId);
    });

    it('should create a new question', async () => {
        const newQuestion = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: 'answer 1',
            explanation: 'explanation',
            categoryId: '6702a8418357fa576c95ea43'
        };
        Question.prototype.save.mockResolvedValue(newQuestion);
        const res = await request(app).post('/questions').send(newQuestion);
        expect(res.status).toBe(201);
        expect(res.body).toEqual(newQuestion);
    });

    it('should return 404 error if Category not found', async () => {
        Category.find.mockResolvedValue(null);
        const newQuestion = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: 'answer 1',
            explanation: 'explanation',
            categoryId: '6702a8418357fa576c95ea43'
        };
        Question.prototype.save.mockResolvedValue(newQuestion);
        const res = await request(app).post('/questions').send(newQuestion);expect(res.status).toBe(404);        
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should return 500 error if Category not found', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));
        const newQuestion = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: 'answer 1',
            explanation: 'explanation',
            categoryId: '6702a8418357fa576c95ea43'
        };
        Question.prototype.save.mockResolvedValue(newQuestion);
        const res = await request(app).post('/questions').send(newQuestion);expect(res.status).toBe(500);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 500 error if save fails', async () => {
        const newQuestion = {
            questionText: 'Question text',
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
            correctAnswer: 'answer 1',
            explanation: 'explanation',
            categoryId: '6702a8418357fa576c95ea43'
        };
        Question.prototype.save.mockRejectedValue(new Error('Database error'));
        const res = await request(app).post('/questions').send(newQuestion);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });
});

describe('POST /questions/bulk', () => {   
    it('should return 400 error if missing questions parameter or empty', async () => {
        const newMissing = {};
        Question.prototype.save.mockResolvedValue(newMissing);
        const resMissing = await request(app).post('/questions/bulk').send(newMissing);
        expect(resMissing.status).toBe(400);
        expect(resMissing.body.message).toBe('An error occurred');
        expect(resMissing.body.error).toBe('Questions must be a non-empty array');
        
        const newEmpty = [];
        Question.prototype.save.mockResolvedValue(newEmpty);
        const resEmpty = await request(app).post('/questions/bulk').send({ 'questions': newEmpty});
        expect(resEmpty.status).toBe(400);
        expect(resEmpty.body.message).toBe('An error occurred');
        expect(resEmpty.body.error).toBe('Questions must be a non-empty array');
    });

    it('should return 400 error if missing questions', async () => {
        const newQuestions = [
            { options: ['answer 11', 'answer 12', 'answer 13', 'answer 14'], correctAnswer: 'answer 11', categoryId: '6702a8418357fa576c95ea43' },
            { questionText: 'Question text 2', correctAnswer: 'answer 22', categoryId: '6702a8418357fa576c95ea43' },
            { questionText: 'Question text 3', options: ['answer 31', 'answer 32', 'answer 33', 'answer 34'], categoryId: '6702a8418357fa576c95ea43' },
            { questionText: 'Question text 4', options: ['answer 41', 'answer 42', 'answer 43', 'answer 44'], correctAnswer: 'answer 44' },
            { questionText: 'Question text 5', explanation: 'explanation' },
            {}
        ];
        Question.prototype.save.mockResolvedValue(newQuestions);
        
        const res = await request(app).post('/questions/bulk').send({questions: newQuestions});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.length).toBe(newQuestions.length);
        expect(res.body.errors.length).toBe(newQuestions.length);
        expect(res.body.errors[0].error).toBe('Missing parameters');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].missing).toEqual([ 'questionText' ]);
        expect(res.body.errors[1].error).toBe('Missing parameters');
        expect(res.body.errors[1].question).toMatchObject(newQuestions[1]);
        expect(res.body.errors[1].missing).toEqual([ 'options' ]);
        expect(res.body.errors[2].error).toBe('Missing parameters');
        expect(res.body.errors[2].question).toMatchObject(newQuestions[2]);
        expect(res.body.errors[2].missing).toEqual([ 'correctAnswer' ]);
        expect(res.body.errors[3].error).toBe('Missing parameters');
        expect(res.body.errors[3].question).toMatchObject(newQuestions[3]);
        expect(res.body.errors[3].missing).toEqual([ 'categoryId' ]);
        expect(res.body.errors[4].error).toBe('Missing parameters');
        expect(res.body.errors[4].question).toMatchObject(newQuestions[4]);
        expect(res.body.errors[4].missing).toEqual([ 'options', 'correctAnswer', 'categoryId' ]);
        expect(res.body.errors[5].error).toBe('Missing parameters');
        expect(res.body.errors[5].question).toMatchObject(newQuestions[5]);
        expect(res.body.errors[5].missing).toEqual([ 'questionText', 'options', 'correctAnswer', 'categoryId' ]);
    
        expect(Question.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should return 400 error if parameters are not strings', async () => {
        const newQuestions = [
            { questionText: 0, options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], correctAnswer: 'answer 1', explanation: 'explanation', categoryId: '6702a8418357fa576c95ea43' },
            { questionText: 'Question text 2', options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], correctAnswer: 1, explanation: 'explanation', categoryId: '6702a8418357fa576c95ea43' },
            { questionText: 'Question text 3', options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], correctAnswer: 'answer 1', explanation: 2, categoryId: '6702a8418357fa576c95ea43' },            
            { questionText: 'Question text 3', options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], correctAnswer: 'answer 1', explanation: 'explanation', categoryId: 3 },
            { questionText: 4, options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], correctAnswer: 5, explanation: 6, categoryId: 7 },
        ];
        Question.prototype.save.mockResolvedValue(newQuestions);

        const res = await request(app).post('/questions/bulk').send({questions: newQuestions});
        
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.length).toBe(newQuestions.length);
        expect(res.body.errors.length).toBe(newQuestions.length);
        expect(res.body.errors[0].error).toBe('Parameters must be strings');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams).toEqual({ questionText : 0 });
        expect(res.body.errors[1].error).toBe('Parameters must be strings');
        expect(res.body.errors[1].question).toMatchObject(newQuestions[1]);
        expect(res.body.errors[1].invalidParams).toEqual({ correctAnswer : 1 });
        expect(res.body.errors[2].error).toBe('Parameters must be strings');
        expect(res.body.errors[2].question).toMatchObject(newQuestions[2]);
        expect(res.body.errors[2].invalidParams).toEqual({ explanation: 2 });
        expect(res.body.errors[3].error).toBe('Parameters must be strings');
        expect(res.body.errors[3].question).toMatchObject(newQuestions[3]);
        expect(res.body.errors[3].invalidParams).toEqual({ categoryId: 3 });
        expect(res.body.errors[4].error).toBe('Parameters must be strings');
        expect(res.body.errors[4].question).toMatchObject(newQuestions[4]);
        expect(res.body.errors[4].invalidParams).toEqual({ questionText: 4, correctAnswer: 5, explanation: 6, categoryId: 7 });

        expect(Question.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should return 400 error if options parameter is not 4 elements', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2'],
                correctAnswer: 'answer 1',
                categoryId: '605c72c1e4b0a62d24356473'
            }
        ];                
        Question.prototype.save.mockResolvedValue(newQuestions);

        const res = await request(app).post('/questions/bulk').send({ questions: newQuestions });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.errors[0].error).toBe('Options must be an array of exactly 4 elements');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams.options).toEqual(['answer 1', 'answer 2']);
    });

    it('should return 400 error if null or empty elements in options parameter', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', '', 'answer 3', null],
                correctAnswer: 'answer 1',
                categoryId: '605c72c1e4b0a62d24356473'
            }
        ];        
        Question.prototype.save.mockResolvedValue(newQuestions);

        const res = await request(app).post('/questions/bulk').send({ questions: newQuestions });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.errors[0].error).toBe('Options cannot contain null or empty elements');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams.options).toEqual(['answer 1', '', 'answer 3', null]);
    });

    it('should return 400 error if duplicates in options parameter', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 3'],
                correctAnswer: 'answer 1',
                categoryId: '605c72c1e4b0a62d24356473'
            }
        ];
        Question.prototype.save.mockResolvedValue(newQuestions);

        const res = await request(app).post('/questions/bulk').send({ questions: newQuestions });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.errors[0].error).toBe('Options must be unique');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams.options).toEqual(['answer 1', 'answer 2', 'answer 3', 'answer 3']);
    });

    it('should return 400 error if correctAnswer is not included in options', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 0',
                categoryId: '605c72c1e4b0a62d24356473'
            }
        ];
        Question.prototype.save.mockResolvedValue(newQuestions);

        const res = await request(app).post('/questions/bulk').send({ questions: newQuestions });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.errors[0].error).toBe('Correct answer must be one of the options');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams.correctAnswer).toBe('answer 0');
    });

    it('should return 400 if categoryId does not exist in the Category collection', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea44'
            }
        ];        
        Category.findById.mockResolvedValue(null); 

        const res = await request(app).post('/questions/bulk').send({ questions: newQuestions });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.errors[0].error).toBe('Invalid categoryId. Category does not exist');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams.categoryId).toBe(newQuestions[0].categoryId);
    });

    it('should create questions successfully', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];
        Question.prototype.save.mockResolvedValue(newQuestions[0]);

        const res = await request(app).post('/questions/bulk').send({ questions: newQuestions });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Questions created successfully');
        expect(res.body.questions).toEqual(expect.arrayContaining([newQuestions[0]]));
    });

    it('should return 404 error if Category not found', async () => {
        Category.find.mockResolvedValue(null);
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];
        Question.prototype.save.mockResolvedValue(newQuestions[0]);
        const res = await request(app).post('/questions/bulk').send({ questions: newQuestions });
        expect(res.status).toBe(404);        
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should return 500 error if Category not found', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];
        Question.prototype.save.mockResolvedValue(newQuestions[0]);
        const res = await request(app).post('/questions/bulk').send({ questions: newQuestions });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 500 error if save fails', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];
        Question.prototype.save.mockRejectedValue(new Error('Database error'));

        const res = await request(app).post('/questions/bulk').send({ questions: newQuestions });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });
});

describe('POST /questions/csv', () => {
    it('should return 400 error if missing questions parameter or empty', async () => {
        const csvBufferMissing = Buffer.from('');
        const resMissing = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, csvBufferMissing), 'questions.csv');       
        expect(resMissing.status).toBe(400);
        expect(resMissing.body.message).toBe('An error occurred');
        expect(resMissing.body.error).toBe('Questions must be a non-empty array');
        
        const csvBufferEmpty = Buffer.from('questionId,questionText,options,correctAnswer,explanation,categoryId\n');
        const resEmpty = await request(app).post('/questions/csv').attach('questions', csvBufferEmpty, 'questions.csv');                   
        expect(resEmpty.status).toBe(400);
        expect(resEmpty.body.message).toBe('An error occurred');
        expect(resEmpty.body.error).toBe('Questions must be a non-empty array');
    });

    it('should return 400 error if missing parameters', async () => {
        const newQuestions = [
            { options: ['answer 11', 'answer 12', 'answer 13', 'answer 14'], correctAnswer: 'answer 11', categoryId: '6702a8418357fa576c95ea43' },
            { questionText: 'Question text 2', correctAnswer: 'answer 22', categoryId: '6702a8418357fa576c95ea43' },
            { questionText: 'Question text 3', options: ['answer 31', 'answer 32', 'answer 33', 'answer 34'], categoryId: '6702a8418357fa576c95ea43' },
            { questionText: 'Question text 4', options: ['answer 41', 'answer 42', 'answer 43', 'answer 44'], correctAnswer: 'answer 44' },
            { questionText: 'Question text 5', explanation: 'explanation' },
            {}          
        ];
        Question.prototype.save.mockResolvedValue(newQuestions);
        
        const res = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, newQuestions) , 'questions.csv');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.length).toBe(newQuestions.length);
        expect(res.body.errors.length).toBe(newQuestions.length);
        expect(res.body.errors[0].error).toBe('Missing parameters');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].missing).toEqual([ 'questionText' ]);
        expect(res.body.errors[1].error).toBe('Missing parameters');
        expect(res.body.errors[1].question).toMatchObject(newQuestions[1]);
        expect(res.body.errors[1].missing).toEqual([ 'options' ]);
        expect(res.body.errors[2].error).toBe('Missing parameters');
        expect(res.body.errors[2].question).toMatchObject(newQuestions[2]);
        expect(res.body.errors[2].missing).toEqual([ 'correctAnswer' ]);
        expect(res.body.errors[3].error).toBe('Missing parameters');
        expect(res.body.errors[3].question).toMatchObject(newQuestions[3]);
        expect(res.body.errors[3].missing).toEqual([ 'categoryId' ]);
        expect(res.body.errors[4].error).toBe('Missing parameters');
        expect(res.body.errors[4].question).toMatchObject(newQuestions[4]);
        expect(res.body.errors[4].missing).toEqual([ 'correctAnswer', 'categoryId', 'options']);
        expect(res.body.errors[5].error).toBe('Missing parameters');
        expect(res.body.errors[5].question).toMatchObject(newQuestions[5]);
        expect(res.body.errors[5].missing).toEqual([ 'questionText', 'correctAnswer', 'categoryId', 'options' ]);
       
        expect(Question.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should return 400 error if options parameter is not 4 elements', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];                
        Question.prototype.save.mockResolvedValue(newQuestions);

        const res = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, newQuestions) , 'questions.csv');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.errors[0].error).toBe('Options must be an array of exactly 4 elements');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams.options).toEqual(['answer 1', 'answer 2']);
    });

    it('should return 400 error if null or empty elements in options parameter', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', '', 'answer 3', ''],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];        
        Question.prototype.save.mockResolvedValue(newQuestions);

        const res = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, newQuestions) , 'questions.csv');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.errors[0].error).toBe('Options cannot contain null or empty elements');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams.options).toEqual(['answer 1', '', 'answer 3', '']);
    });

    it('should return 400 error if duplicates in options parameter', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 3'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];
        Question.prototype.save.mockResolvedValue(newQuestions);

        const res = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, newQuestions) , 'questions.csv');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.errors[0].error).toBe('Options must be unique');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams.options).toEqual(['answer 1', 'answer 2', 'answer 3', 'answer 3']);
    });

    it('should return 400 error if correctAnswer is not included in options', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 0',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];
        Question.prototype.save.mockResolvedValue(newQuestions);

        const res = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, newQuestions) , 'questions.csv');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.errors[0].error).toBe('Correct answer must be one of the options');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams.correctAnswer).toBe('answer 0');
    });

    it('should return 400 if categoryId does not exist in the Category collection', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea44'
            }
        ];        
        Category.findById.mockResolvedValue(null); 

        const res = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, newQuestions) , 'questions.csv');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some questions could not be processed');
        expect(res.body.errors[0].error).toBe('Invalid categoryId. Category does not exist');
        expect(res.body.errors[0].question).toMatchObject(newQuestions[0]);
        expect(res.body.errors[0].invalidParams.categoryId).toBe('6702a8418357fa576c95ea44');
    });

    it('should create questions successfully', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];
        Question.prototype.save.mockResolvedValue(newQuestions[0]);

        const res = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, newQuestions) , 'questions.csv');
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Questions created successfully');        
        expect(res.body.questions).toEqual(expect.arrayContaining([newQuestions[0]]));
    });

    it('should return 404 error if Category not found', async () => {
        Category.find.mockResolvedValue(null);
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];
        Question.prototype.save.mockResolvedValue(newQuestions[0]);

        const res = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, newQuestions) , 'questions.csv');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should return 500 error if Category not found', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];
        Question.prototype.save.mockResolvedValue(newQuestions[0]);

        const res = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, newQuestions) , 'questions.csv');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 500 error if save fails', async () => {
        const newQuestions = [
            {
                questionText: 'Question text',
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'],
                correctAnswer: 'answer 1',
                categoryId: '6702a8418357fa576c95ea43'
            }
        ];
        Question.prototype.save.mockRejectedValue(new Error('Database error'));

        const res = await request(app).post('/questions/csv').attach('questions', arrayToCustomCsvBuffer(headersQuestions, newQuestions) , 'questions.csv');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 500 and error message for failed CSV processing', async () => {
        const res = await request(app).post('/questions/csv').attach('questions', null, 'questions.csv');
        expect(res.status).toBe(500);        
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Failed to process CSV');
    });
})


/********/
/* UPDATE */
/********/

// PATCH /questions/:id
describe('PATCH /questions/:id', () => {
    it('should return 404 if question not found', async () => {
        Question.findById.mockResolvedValue(null);
        const res = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ questionText: 'Updated Question Text' });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Question not found');
    });

    it('should return 500 error if findById fails', async () => {
        Question.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ questionText: 'Updated Question Text' });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 400 error if options parameter is not 4 elements', async () => {
        const questionToUpdate = { ...mockValue, save: jest.fn().mockResolvedValue(mockValue) };
        Question.findById.mockResolvedValue(questionToUpdate);

        const resEmpty = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ options: [] });                                    
        expect(resEmpty.status).toBe(400);
        expect(resEmpty.body.message).toBe('An error occurred');
        expect(resEmpty.body.error).toBe('Options must be an array of exactly 4 elements');

        const resLessThanFour = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ options: ['answer 1', 'answer 2'] });                                    
        expect(resLessThanFour.status).toBe(400);
        expect(resLessThanFour.body.message).toBe('An error occurred');
        expect(resLessThanFour.body.error).toBe('Options must be an array of exactly 4 elements');
        expect(resLessThanFour.body.invalidParams.options).toEqual(['answer 1', 'answer 2']);
    });

    it('should return 400 error if null or empty elements in options parameter', async () => {
        const questionToUpdate = { ...mockValue, save: jest.fn().mockResolvedValue(mockValue) };
        Question.findById.mockResolvedValue(questionToUpdate);
        const res = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ options: ['answer 1', '', 'answer 3', null] });                                    
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Options cannot contain null or empty elements');
        expect(res.body.invalidParams.options).toEqual(['answer 1', '', 'answer 3', null]);
    });

    it('should return 400 error if duplicates in options parameter', async () => {
        const questionToUpdate = { ...mockValue, save: jest.fn().mockResolvedValue(mockValue) };
        Question.findById.mockResolvedValue(questionToUpdate);
        const res = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ options: ['answer 1', 'answer 2', 'answer 3', 'answer 3'] });                                    
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Options must be unique');
        expect(res.body.invalidParams.options).toEqual(['answer 1', 'answer 2', 'answer 3', 'answer 3']);
    });

    it('should return 400 error if correctAnswer parameter is not included in options parameter', async () => {
        const questionToUpdate = { ...mockValue, save: jest.fn().mockResolvedValue(mockValue) };
        Question.findById.mockResolvedValue(questionToUpdate);

        const resOnlyOptions = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ options: ['answer a', 'answer b', 'answer c', 'answer d'] });             
        expect(resOnlyOptions.status).toBe(400);
        expect(resOnlyOptions.body.message).toBe('An error occurred');
        expect(resOnlyOptions.body.error).toBe('Correct answer must be one of the options');
        expect(resOnlyOptions.body.invalidParams.options).toEqual(['answer a', 'answer b', 'answer c', 'answer d']);
        expect(resOnlyOptions.body.invalidParams.correctAnswer).toEqual(mockValue.correctAnswer);
        
        const resOnlyCorrectAnswer = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ correctAnswer: 'notCorrect' });                     
        expect(resOnlyCorrectAnswer.status).toBe(400);
        expect(resOnlyCorrectAnswer.body.message).toBe('An error occurred');
        expect(resOnlyCorrectAnswer.body.error).toBe('Correct answer must be one of the options');
        expect(resOnlyCorrectAnswer.body.invalidParams.options).toEqual(mockValue.options);
        expect(resOnlyCorrectAnswer.body.invalidParams.correctAnswer).toEqual('notCorrect');

        const resBothParameters = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ options: ['answer a', 'answer b', 'answer c', 'answer d'], correctAnswer: 'notCorrect' });             
        expect(resBothParameters.status).toBe(400);
        expect(resBothParameters.body.message).toBe('An error occurred');
        expect(resBothParameters.body.error).toBe('Correct answer must be one of the options');
        expect(resBothParameters.body.invalidParams.options).toEqual(['answer a', 'answer b', 'answer c', 'answer d']);
        expect(resBothParameters.body.invalidParams.correctAnswer).toEqual('notCorrect');
    });

    it('should return 400 error if parameters are not a string', async () => {
        const questionToUpdate = { ...mockValue, save: jest.fn().mockResolvedValue(mockValue) };
        Question.findById.mockResolvedValue(questionToUpdate);

        const resQuestionTextNotString = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ questionText: 0 });
        expect(resQuestionTextNotString.status).toBe(400);
        expect(resQuestionTextNotString.body.message).toBe('An error occurred');
        expect(resQuestionTextNotString.body.error).toBe('Parameters must be strings');
        expect(resQuestionTextNotString.body.invalidParams).toEqual({ questionText: 0 });

        const resCorrectAnswerNotString = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ correctAnswer: 1 });
        expect(resCorrectAnswerNotString.status).toBe(400);
        expect(resCorrectAnswerNotString.body.message).toBe('An error occurred');
        expect(resCorrectAnswerNotString.body.error).toBe('Parameters must be strings');
        expect(resCorrectAnswerNotString.body.invalidParams).toEqual({ correctAnswer: 1 });

        const resExplanationNotString = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ explanation: 2 });
        expect(resExplanationNotString.status).toBe(400);
        expect(resExplanationNotString.body.message).toBe('An error occurred');
        expect(resExplanationNotString.body.error).toBe('Parameters must be strings');
        expect(resExplanationNotString.body.invalidParams).toEqual({ explanation: 2 });

        const resCategoryIdNotString = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ categoryId: 3 });
        expect(resCategoryIdNotString.status).toBe(400);
        expect(resCategoryIdNotString.body.message).toBe('An error occurred');
        expect(resCategoryIdNotString.body.error).toBe('Parameters must be strings');
        expect(resCategoryIdNotString.body.invalidParams).toEqual({ categoryId: 3 });

        const resAllParametersNotString = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ questionText: 0, correctAnswer: 1, explanation: 2, categoryId: 3 });
        expect(resAllParametersNotString.status).toBe(400);
        expect(resAllParametersNotString.body.message).toBe('An error occurred');
        expect(resAllParametersNotString.body.error).toBe('Parameters must be strings');
        expect(resAllParametersNotString.body.invalidParams).toEqual({ questionText: 0, correctAnswer: 1, explanation: 2, categoryId: 3 });
    });

    it('should return 400 if categoryId does not exist in the Category collection', async () => {               
        Category.findById.mockResolvedValue(null);
        const questionToUpdate = { ...mockValue, save: jest.fn().mockResolvedValue(mockValue) };
        Question.findById.mockResolvedValue(questionToUpdate);

        const res = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ categoryId: '6702a8418357fa576c95ea44' });
        expect(res.status).toBe(400);        
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Invalid categoryId. Category does not exist');
        expect(res.body.invalidParams.categoryId).toBe('6702a8418357fa576c95ea44');
    });
    
    it('should return 200 res if no fields were updated', async () => {                  
        const questionToUpdate = { ...mockValue, save: jest.fn().mockResolvedValue(mockValue) };          
        Question.findById.mockResolvedValue(questionToUpdate);  
        const res = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ 
            questionText: mockValue.questionText,
            options: mockValue.options,
            correctAnswer: mockValue.correctAnswer,
            explanation:  mockValue.explanation,
            categoryId: mockValue.categoryId.toString()            
        });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('No fields were updated');
    });

    it('should update a question', async () => {    
        const updatedQuestionText = { 
            ...mockValue, 
            save: jest.fn().mockResolvedValue({ ...mockValue, questionText: 'Updated Question Text'})
        };     
        Question.findById.mockResolvedValue(updatedQuestionText);
        const resUpdateQuestionText = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ questionText: 'Updated Question Text' });
        expect(resUpdateQuestionText.status).toBe(200);
        expect(resUpdateQuestionText.body.questionText).toBe('Updated Question Text');
        expect(updatedQuestionText.save).toHaveBeenCalled();
        
        const updatedCorrectAnswer = { 
            ...mockValue, 
            save: jest.fn().mockResolvedValue({ ...mockValue, correctAnswer: mockValue.options[3]})
        };
        Question.findById.mockResolvedValue(updatedCorrectAnswer);   
        const resUpdateCorrectAnswer = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ correctAnswer: mockValue.options[3] });  
        expect(resUpdateCorrectAnswer.status).toBe(200); 
        expect(resUpdateCorrectAnswer.body.correctAnswer).toBe(mockValue.options[3]);
        expect(updatedCorrectAnswer.save).toHaveBeenCalled();

        const updatedExplanation = { 
            ...mockValue,  
            save: jest.fn().mockResolvedValue({ ...mockValue, explanation: 'explanation'})
        };
        Question.findById.mockResolvedValue(updatedExplanation);        
        const resExplanation = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ explanation: 'explanation' });        
        expect(resExplanation.status).toBe(200);        
        expect(resExplanation.body.explanation).toBe('explanation');
        expect(updatedExplanation.save).toHaveBeenCalled();

        const updatedCategoryId = { 
            ...mockValue, 
            save: jest.fn().mockResolvedValue({ ...mockValue, categoryId: '671e6e7393cee089f87f1f3d'})
        };
        Question.findById.mockResolvedValue(updatedCategoryId);        
        const resCategoryId = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ categoryId: '671e6e7393cee089f87f1f3d' });        
        expect(resCategoryId.status).toBe(200);      
        expect(resCategoryId.body.categoryId).toBe('671e6e7393cee089f87f1f3d');
        expect(updatedCategoryId.save).toHaveBeenCalled();
    
        const updatedQuestionAll = { 
            ...mockValue,  
            save: jest.fn().mockResolvedValue({ ...mockValue, 
                questionText: 'Updated Question Text', 
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], 
                correctAnswer: 'answer 1', 
                explanation: 'explanation',
                categoryId: '671e6e7393cee089f87f1f3d'
            })
        };
        Question.findById.mockResolvedValue(updatedQuestionAll);
        const resUpdateAll = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ 
            questionText: 'Updated Question Text', 
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], 
            correctAnswer: 'answer 1', 
            explanation: 'explanation',
            categoryId: '671e6e7393cee089f87f1f3d'
        });
        expect(resUpdateAll.status).toBe(200);        
        expect(resUpdateAll.body.questionText).toBe('Updated Question Text');
        expect(resUpdateAll.body.options).toEqual(['answer 1', 'answer 2', 'answer 3', 'answer 4']);        
        expect(resUpdateAll.body.correctAnswer).toBe('answer 1');
        expect(resUpdateAll.body.explanation).toBe('explanation');
        expect(resUpdateAll.body.categoryId).toBe('671e6e7393cee089f87f1f3d');
        expect(updatedQuestionAll.save).toHaveBeenCalled();
    });

    it('should return 404 error if Category not found', async () => {
        Category.find.mockResolvedValue(null);
        const updatedQuestionAll = { 
            ...mockValue,  
            save: jest.fn().mockResolvedValue({ ...mockValue, 
                questionText: 'Updated Question Text', 
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], 
                correctAnswer: 'answer 1', 
                explanation: 'explanation',
                categoryId: '671e6e7393cee089f87f1f3d'
            })
        };
        Question.findById.mockResolvedValue(updatedQuestionAll);
        const res = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ 
            questionText: 'Updated Question Text', 
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], 
            correctAnswer: 'answer 1', 
            explanation: 'explanation',
            categoryId: '671e6e7393cee089f87f1f3d'
        });
        expect(res.status).toBe(404); 
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should return 500 error if Category not found', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));
        const updatedQuestionAll = { 
            ...mockValue,  
            save: jest.fn().mockResolvedValue({ ...mockValue, 
                questionText: 'Updated Question Text', 
                options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], 
                correctAnswer: 'answer 1', 
                explanation: 'explanation',
                categoryId: '671e6e7393cee089f87f1f3d'
            })
        };
        Question.findById.mockResolvedValue(updatedQuestionAll);
        const res = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ 
            questionText: 'Updated Question Text', 
            options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'], 
            correctAnswer: 'answer 1', 
            explanation: 'explanation',
            categoryId: '671e6e7393cee089f87f1f3d'
        });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 500 error if save fails', async () => {
        const questionToUpdate = { ...mockValue, save: jest.fn().mockRejectedValue(new Error('Save failed'))};
        Question.findById.mockResolvedValue(questionToUpdate);        
        const res = await request(app).patch(`/questions/${mockValue._id.toString()}`).send({ questionText: 'Updated Question Text' });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Save failed');
    });
});

// PATCH /questions/categories
describe('PATCH /categories/:oldCategoryId/:newCategoryId', () => {
    it('should return 400 if oldCategoryId or newCategoryId are missing', async () => {
        const resOldCategoryIdMissing = await request(app).patch('/questions/categories//newCategoryId');       
        expect(resOldCategoryIdMissing.status).toBe(400);
        expect(resOldCategoryIdMissing.body.message).toBe('An error occurred');
        expect(resOldCategoryIdMissing.body.error).toEqual('Both oldCategoryId and newCategoryId are required');
        
        const resNewCategoryIdMissing = await request(app).patch('/questions/categories/oldCategoryId');       
        expect(resNewCategoryIdMissing.status).toBe(400);
        expect(resNewCategoryIdMissing.body.message).toBe('An error occurred');
        expect(resNewCategoryIdMissing.body.error).toEqual('Both oldCategoryId and newCategoryId are required');
    
        const resBothCategoriesIdMissing = await request(app).patch('/questions/categories//');                
        expect(resBothCategoriesIdMissing.status).toBe(400);        
        expect(resBothCategoriesIdMissing.body.message).toBe('An error occurred');
        expect(resBothCategoriesIdMissing.body.error).toBe('Both oldCategoryId and newCategoryId are required');
    });

    it('should return 400 if oldCategoryId or newCategoryId has invalid ObjectId format', async () => {
        const resInvalidOldId = await request(app).patch('/questions/categories/invalidId/671e6e7393cee089f87f1f3d');
        expect(resInvalidOldId.status).toBe(400);
        expect(resInvalidOldId.body.message).toBe('An error occurred');
        expect(resInvalidOldId.body.error).toBe('Invalid ObjectId format');
        expect(resInvalidOldId.body.invalidParams).toEqual({ oldCategoryId: 'invalidId' });

        const resInvalidNewId = await request(app).patch('/questions/categories/6702a8418357fa576c95ea43/newValidId');
        expect(resInvalidNewId.status).toBe(400);
        expect(resInvalidNewId.body.message).toBe('An error occurred');
        expect(resInvalidNewId.body.error).toBe('Invalid ObjectId format');
        expect(resInvalidNewId.body.invalidParams).toEqual({ newCategoryId: 'newValidId' });

        const resInvalidBothId = await request(app).patch('/questions/categories/invalidId/newValidId');
        expect(resInvalidBothId.status).toBe(400);
        expect(resInvalidBothId.body.message).toBe('An error occurred');
        expect(resInvalidBothId.body.error).toBe('Invalid ObjectId format');
        expect(resInvalidBothId.body.invalidParams).toEqual({ oldCategoryId: 'invalidId', newCategoryId: 'newValidId'});
    });

    it('should return 200 if oldCategoryId and newCategoryId are the same', async () => {
        const res = await request(app).patch('/questions/categories/671e6e7393cee089f87f1f3d/671e6e7393cee089f87f1f3d');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('No change occured;oldCategoryId and newCategoryId are the same');
    });

    it('should return 400 if oldCategoryId does not exist in any questions', async () => {        
        const res = await request(app).patch('/questions/categories/6702a8418357fa576c95ea44/671e6e7393cee089f87f1f3d');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('oldCategoryId does not exist in any questions');
    });

    it('should return 400 if newCategoryId does not exist in Categories', async () => {        
        Category.findById.mockResolvedValue(null);
        const res = await request(app).patch('/questions/categories/6702a8418357fa576c95ea43/671e6e7393cee089f87f1f37');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Invalid categoryId. Category does not exist');
        expect(res.body.invalidParams).toEqual({ categoryId: '671e6e7393cee089f87f1f37' });
    });

    it('should update categoryId for questions and return updated questions', async () => {
        const updatedQuestions = [
            {
                ...mockValue,
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockValue, categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            },
            {
                ...mockQuestions[1],
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockQuestions[1], categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            },
            {
                ...mockQuestions[2],
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockQuestions[2], categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            }
        ];
        const res = await request(app).patch('/questions/categories/6702a8418357fa576c95ea43/671e6e7393cee089f87f1f3d');                  
        Question.find.mockResolvedValue(updatedQuestions);        
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('CategoryId updated successfully');   
    });

    it('should return 404 error if Question not found', async () => {
        Question.find.mockResolvedValue(null);
        const updatedQuestions = [
            {
                ...mockValue,
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockValue, categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            },
            {
                ...mockQuestions[1],
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockQuestions[1], categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            },
            {
                ...mockQuestions[2],
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockQuestions[2], categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            }
        ];
        const res = await request(app).patch('/questions/categories/6702a8418357fa576c95ea43/671e6e7393cee089f87f1f3d');                                 
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Questions not found');
    });


    it('should return 404 error if Category not found', async () => {
        Category.find.mockResolvedValue(null);
        const updatedQuestions = [
            {
                ...mockValue,
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockValue, categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            },
            {
                ...mockQuestions[1],
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockQuestions[1], categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            },
            {
                ...mockQuestions[2],
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockQuestions[2], categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            }
        ];
        const res = await request(app).patch('/questions/categories/6702a8418357fa576c95ea43/671e6e7393cee089f87f1f3d');                  
        Question.find.mockResolvedValue(updatedQuestions);        
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should return 500 error if Category not found', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));
        const updatedQuestions = [
            {
                ...mockValue,
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockValue, categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            },
            {
                ...mockQuestions[1],
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockQuestions[1], categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            },
            {
                ...mockQuestions[2],
                categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d'),
                save: jest.fn().mockResolvedValue({ ...mockQuestions[2], categoryId: new mongoose.Types.ObjectId('671e6e7393cee089f87f1f3d') })
            }
        ];
        const res = await request(app).patch('/questions/categories/6702a8418357fa576c95ea43/671e6e7393cee089f87f1f3d');                  
        Question.find.mockResolvedValue(updatedQuestions);   
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 500 error if updating categories fails', async () => {
        Question.updateMany.mockRejectedValue(new Error('Update failed'));
        const res = await request(app).patch('/questions/categories/6702a8418357fa576c95ea43/671e6e7393cee089f87f1f3d');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred while updating CategoryId');
        expect(res.body.error).toBe('Update failed');
    });
});

/********/
/* DELETE */
/********/

// Delete all categories
describe('DELETE /questions/all', () => {
    it('should delete all questions', async () => {
        Question.deleteMany.mockResolvedValue({ deletedCount: 3 });
        const res = await request(app).delete('/questions/all');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('All questions deleted');
        expect(res.body.deletedCount).toBe(3);

        // Verify deleteMany was called correctly
        expect(Question.deleteMany).toHaveBeenCalledWith({});
    });

    it('should return a 500 error if delete fails', async () => {
        Question.deleteMany.mockRejectedValue(new Error('Deletion failed'));
        const res = await request(app).delete('/questions/all');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Deletion failed');
    });
});

describe('DELETE /questions/:id', () => {
    it('should return 404 error if question not found', async () => {
        Question.findById.mockResolvedValue(null);
        const res = await request(app).delete(`/questions/${mockValue._id.toString()}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Question not found');
    });

    it('should return a 500 error if finding question fails', async () => {
        Question.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).delete(`/questions/${mockValue._id.toString()}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 404 if question not found during delete', async () => {
        Question.findById.mockResolvedValue(mockValue);
        Question.findByIdAndDelete.mockResolvedValue(null);
        const res = await request(app).delete(`/questions/${mockValue._id.toString()}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Question not found');
    });

    it('should delete a question by ID', async () => {
        Question.findById.mockResolvedValue(mockValue);
        Question.findByIdAndDelete.mockResolvedValue(mockValue);
        const res = await request(app).delete(`/questions/${mockValue._id.toString()}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Question deleted');
    });

    it('should return a 500 error if delete fails', async () => {
        Question.findById.mockResolvedValue(mockValue);
        Question.findByIdAndDelete.mockRejectedValue(new Error('Database error'));
        const res = await request(app).delete(`/questions/${mockValue._id.toString()}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });
});