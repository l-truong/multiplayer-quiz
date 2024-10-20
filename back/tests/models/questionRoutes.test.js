const request = require('supertest'); // Import supertest for HTTP testing
const express = require('express'); // Import express
const router = require('../../api/routes/questionRoutes'); // Import question routes
const Question = require('../../api/models/question'); // Import Question model
jest.mock('../../api/models/question'); // Mock the Question model methods

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use('/questions', router); // Use question routes

let mockQuestion; // Mock question object
beforeEach(() => {
    mockQuestion = {
        _id: "6702a8418357fa576c95ea44",
        questionId: "6702a8418357fa576c95ea43",
        name: "Test Question name",
        description: "Test Question description",
        createdAt: "2024-10-06T15:09:53.744Z",
        updatedAt: "2024-10-06T15:09:53.744Z",
        __v: 0
    };
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
        Question.find.mockResolvedValue([mockQuestion]);
        const res = await request(app).get('/questions');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockQuestion]);
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
    // TODO
    /*it('should return 404 error if length is not a number', async () => {
        const res = await request(app).get('/length/abc');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Length must be a number');
    });

    it('should return 500 error if fetching questions fails', async () => {
        Question.find = jest.fn().mockRejectedValue(new Error('Database error'));

        const res = await request(app).get('/length/2');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });*/
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