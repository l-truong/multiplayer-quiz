const request = require('supertest'); // Import supertest for HTTP testing
const express = require('express'); // Import express
const router = require('../../api/routes/questionRoutes'); // Import question routes
const Question = require('../../api/models/question'); // Import Question model
jest.mock('../../api/models/question'); // Mock the Question model methods

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use('/questions', router); // Use question routes

let mockQuestions; // Mock questions list object
let mockQuestion;
beforeEach(() => {
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
    Question.find.mockResolvedValue(mockQuestions);

    mockQuestion = mockQuestions[0];
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

/********/
/* UPDATE */
/********/

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