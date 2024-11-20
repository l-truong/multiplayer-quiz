const { mockSession } = require('../mocks/mockSession');
const { enumLanguage, mockCategories } = require('../mocks/mockCategories');
const { mockQuestions } = require('../mocks/mockQuestions');

const Category = require('../../api/models/category');
const Question = require('../../api/models/question');

const setupCategorieMocks = () => {
    // Mock the Category model methods
    Category.find.mockResolvedValue(mockCategories);
    Category.schema = { path: () => ({ enumValues: enumLanguage }) };
    Category.startSession.mockResolvedValue(mockSession);     
};

const setupQuestionsMocks = () => {
    // Mock the Question model methods
    Category.find.mockResolvedValue(mockCategories);
    Question.find.mockResolvedValue(mockQuestions);
    Question.startSession.mockResolvedValue(mockSession);
};

const resetMocks = () => {
    jest.clearAllMocks(); // Clear mocks after each test
    jest.resetAllMocks();
};

module.exports = { setupCategorieMocks, setupQuestionsMocks, resetMocks };