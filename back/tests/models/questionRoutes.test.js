const request = require('supertest'); // Import supertest for HTTP testing
const express = require('express'); // Import express
const router = require('../../api/routes/questionRoutes'); // Import question routes
const Question = require('../../api/models/question'); // Import Question model
jest.mock('../../api/models/question'); // Mock the Question model methods

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use('/questions', router); // Use question routes

let mockQuestions;
let mockQuestion;
let session;

const initializeMocks = () => {
    mockQuestions = [ {
        _id: "6702afae2acce6212ee86085",
        questionId: "6702afae2acce6212ee86084",
        questionText: "Which country has the largest land area?",
        options: [
            "Canada",
            "United States",
            "China",
            "Russia"
        ],
        correctAnswer: "Russia",
        explanation: "Russia is the largest country in the world by land area, covering over 17 million square kilometers.",
        categoryId: "6702a8838357fa576c95ea46",
        flags: [],
        createdAt: "2024-10-06T15:41:34.691Z",
        updatedAt: "2024-10-06T15:41:34.691Z",
        __v: 0
    },
    {
        _id: "6702af9f2acce6212ee8607f",
        questionId: "6702af9f2acce6212ee8607e",
        questionText: "What is the largest species of shark?",
        options: [
            "Great White Shark",
            "Whale Shark",
            "Hammerhead Shark",
            "Tiger Shark"
        ],
        correctAnswer: "Whale Shark",
        explanation: "The whale shark is the largest shark species, reaching lengths of up to 40 feet or more.",
        categoryId: "6702a8418357fa576c95ea43",
        flags: [],
        createdAt: "2024-10-06T15:41:19.223Z",
        updatedAt: "2024-10-06T15:41:19.223Z",
        __v: 0
    },
    {
        _id: "6702af982acce6212ee8607c",
        questionId: "6702af982acce6212ee8607b",
        questionText: "Which mammal is known to lay eggs?",
        options: [
            "Platypus",
            "Kangaroo",
            "Dolphin",
            "Bat"
        ],
        correctAnswer: "Platypus",
        explanation: "The platypus is one of the few monotremes, a group of egg-laying mammals.",
        categoryId: "6702a8418357fa576c95ea43",
        flags: [],
        createdAt: "2024-10-06T15:41:12.558Z",
        updatedAt: "2024-10-06T15:41:12.558Z",
        __v: 0
    }];   
    mockQuestion = mockQuestions[0];
    Question.find.mockResolvedValue(mockQuestions);

    // Set up session
    session = {
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        abortTransaction: jest.fn(),
        endSession: jest.fn(),
    };
    Question.startSession.mockResolvedValue(session);
};

beforeEach(() => {
    initializeMocks();
});

afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
});


/********/
/* GET */
/********/

// GET /questions
describe('GET /questions', () => {
    it('should return all questions', async () => {
        const res = await request(app).get('/questions');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockQuestions);
    });

    it('should return 500 error on server failure', async () => {
        Question.find.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get('/questions');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});

// GET /questions/random/:random
describe('GET /questions/random/:random', () => {
    it('should return 400 if the random parameter is missing', async () => {
        const res = await request(app).get('/questions/random/');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Parameter is required');
    });

    it('should return 400 if the random parameter is not a positive number', async () => {
        const res = await request(app).get('/questions/random/0');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Parameter must be a positive number');

        const resNegative = await request(app).get('/questions/random/-5');
        expect(resNegative.status).toBe(400);
        expect(resNegative.body.message).toBe('Parameter must be a positive number');

        const resNaN = await request(app).get('/questions/random/abc');
        expect(resNaN.status).toBe(400);
        expect(resNaN.body.message).toBe('Parameter must be a positive number');
    });

    it('should return a list of questions when the random parameter is valid', async () => {       
        const length = 2;
        const res = await request(app).get(`/questions/random/${length}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(length);
        expect(res.body.every(question => 
            mockQuestions.some(mockQuestion => mockQuestion._id === question._id)
        )).toBe(true);
    });

    it('should return 500 error on server failure', async () => {
        const length = 2;
        Question.find.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get(`/questions/random/${length}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});

// GET /questions/:id
describe('GET /questions/:id', () => {
    it('should return 404 error if question not found', async () => {
        Question.findById.mockResolvedValue(null);
        const res = await request(app).get(`/questions/${mockQuestion._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Question not found');
    });

    it('should return 500 error if findById fails', async () => {
        Question.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get(`/questions/${mockQuestion._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });

    it('should return a question by ID', async () => {
        Question.findById.mockResolvedValue(mockQuestion);
        const res = await request(app).get(`/questions/${mockQuestion._id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockQuestion);
    });
});


/********/
/* POST */
/********/

// POST /questions
describe('POST /questions', () => {       
    it('should return 400 error if missing parameters', async () => {
        const resOnlyQuestionText = await request(app).post('/questions').send({ questionText: 'Only question text' });
        expect(resOnlyQuestionText.status).toBe(400);
        expect(resOnlyQuestionText.body.message).toBe('Missing parameters');
        expect(resOnlyQuestionText.body.missing).toEqual(['options', 'correctAnswer', 'categoryId']);
        
        const resOnlyOptions = await request(app).post('/questions').send({ options: ['answer 1', 'answer 2', 'answer 3', 'answer 4'] });
        expect(resOnlyOptions.status).toBe(400);
        expect(resOnlyOptions.body.message).toBe('Missing parameters');
        expect(resOnlyOptions.body.missing).toEqual(['questionText', 'correctAnswer', 'categoryId']);

        const resOnlyCorrectAnswer = await request(app).post('/questions').send({ correctAnswer: 'answer 2' });
        expect(resOnlyCorrectAnswer.status).toBe(400);
        expect(resOnlyCorrectAnswer.body.message).toBe('Missing parameters');
        expect(resOnlyCorrectAnswer.body.missing).toEqual(['questionText', 'options', 'categoryId']);
    
        const resOnlyCategoryId = await request(app).post('/questions').send({ categoryId: 'categoryId'});
        expect(resOnlyCategoryId.status).toBe(400);
        expect(resOnlyCategoryId.body.message).toBe('Missing parameters');
        expect(resOnlyCategoryId.body.missing).toEqual(['questionText', 'options', 'correctAnswer']);
    
        const resMissingAll = await request(app).post('/questions').send({});
        expect(resMissingAll.status).toBe(400);
        expect(resMissingAll.body.message).toBe('Missing parameters');
        expect(resMissingAll.body.missing).toEqual(['questionText', 'options', 'correctAnswer', 'categoryId']);
    });

    // Check if options parameter is an array and has exactly 4 elements

    // Check for null or empty elements in options parameter

    // Check if correctAnswer parameter is included in options parameter

    // Check if rest of parameters are strings (questionText, correctAnswer, explanation, category Id)

    // Check if categoryId parameters exists in the Category collection > link to categoryRoutes.test > check if general mock database test possible
                
    //create question

    // general error
});

describe('POST /questions/bulk', () => {   
    //todo    
});


/********/
/* UPDATE */
/********/

// PATCH /questions/:id
describe('PATCH /questions/:id', () => {
    //todo
});

// PATCH /questions/categories
describe('PATCH /questions/categories', () => {
    //todo
});

/********/
/* DELETE */
/********/

describe('DELETE /questions/:id', () => {
    it('should return 404 error if question not found', async () => {
        Question.findById.mockResolvedValue(null);
        const res = await request(app).delete(`/questions/${mockQuestion._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Question not found');
    });

    it('should return a 500 error if finding question fails', async () => {
        Question.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).delete(`/questions/${mockQuestion._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });

    it('should return 404 if question not found during delete', async () => {
        Question.findById.mockResolvedValue(mockQuestion);
        Question.findByIdAndDelete.mockResolvedValue(null);
        const res = await request(app).delete(`/questions/${mockQuestion._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Question not found');
    });

    it('should delete a question by ID', async () => {
        Question.findById.mockResolvedValue(mockQuestion);
        Question.findByIdAndDelete.mockResolvedValue(mockQuestion);
        const res = await request(app).delete(`/questions/${mockQuestion._id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Question deleted');
    });  

    it('should return a 500 error if delete fails', async () => {
        Question.findById.mockResolvedValue(mockQuestion);
        Question.findByIdAndDelete.mockRejectedValue(new Error('Database error'));
        const res = await request(app).delete(`/questions/${mockQuestion._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});