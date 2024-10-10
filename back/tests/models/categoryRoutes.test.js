const request = require('supertest'); // Import supertest for HTTP testing
const express = require('express'); // Import express
const router = require('../../api/routes/categoryRoutes'); // Import category routes
const Category = require('../../api/models/category'); // Import Category model
jest.mock('../../api/models/category'); // Mock the Category model methods

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use('/categories', router); // Use category routes

let mockCategory; // Mock category object
beforeEach(() => {
    mockCategory = {
        _id: "6702a8418357fa576c95ea44",
        categoryId: "6702a8418357fa576c95ea43",
        name: "Test Category",
        description: "Test Category Description",
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

// GET /categories
describe('GET /categories', () => {
    it('should return all categories', async () => {
        Category.find.mockResolvedValue([mockCategory]);
        const res = await request(app).get('/categories');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockCategory]);
    });

    it('should return a 500 error on server failure', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get('/categories');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});

// GET /categories/:id
describe('GET /categories/:id', () => {
    it('should return a 404 if category not found', async () => {
        Category.findById.mockResolvedValue(null);
        const res = await request(app).get(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Cannot find category');
    });

    it('should return a category by ID', async () => {
        Category.findById.mockResolvedValue(mockCategory);
        const res = await request(app).get(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockCategory);
    });

    it('should return a 500 error if findById fails', async () => {
        Category.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});


/********/
/* POST */
/********/

// POST /categories
describe('POST /categories', () => {       
    it('should return 400 if missing parameter description', async () => {
        const res = await request(app).post('/categories').send({ name: 'Only Name' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Missing parameters');
        expect(res.body.missing).toEqual(['description']);
    });

    it('should return 400 if missing parameter name', async () => {
        const res = await request(app).post('/categories').send({ description: 'Only Description' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Missing parameters');
        expect(res.body.missing).toEqual(['name']);
    });

    it('should return 400 if missing both parameters', async () => {
        const res = await request(app).post('/categories').send();
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Missing parameters');
        expect(res.body.missing).toEqual(['name', 'description']);
    });

    it('should return 400 if parameter name is not string', async () => {
        const res = await request(app).post('/categories').send({ name: 0, description: 'New Description' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Parameters must be strings');
        expect(res.body.invalidParams).toEqual({"name": 0});
    });

    it('should return 400 if parameter description is not string', async () => {
        const res = await request(app).post('/categories').send({ name: 'New Name', description: 1 });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Parameters must be strings');
        expect(res.body.invalidParams).toEqual({"description": 1});
    });

    it('should return 400 if both parameters are not string', async () => {
        const res = await request(app).post('/categories').send({ name: 0, description: 1 });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Parameters must be strings');
        expect(res.body.invalidParams).toEqual({ name: 0, description: 1 });
    });

    it('should create a new category', async () => {
        Category.prototype.save.mockResolvedValue(mockCategory);
        const res = await request(app).post('/categories').send({ name: 'New Category', description: 'New Description' });
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockCategory);
    });

    it('should return a 400 error if save fails', async () => {
        Category.prototype.save.mockRejectedValue(new Error('Validation error'));
        const res = await request(app).post('/categories').send({ name: 'New Category', description: 'New Description' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Validation error');
    });
});


/********/
/* UPDATE */
/********/

// PATCH /categories/:id
describe('PATCH /categories/:id', () => {
    it('should update a category', async () => {
        const categoryToUpdate = { ...mockCategory, save: jest.fn().mockResolvedValue(mockCategory) };
        Category.findById.mockResolvedValue(categoryToUpdate);
        const res = await request(app).patch(`/categories/${mockCategory._id}`).send({ name: 'Updated Name' });
        expect(res.status).toBe(200);
        expect(categoryToUpdate.name).toBe('Updated Name');
    });

    it('should return 404 if category not found', async () => {
        Category.findById.mockResolvedValue(null);
        const res = await request(app).patch(`/categories/${mockCategory._id}`).send({ name: 'Updated Name' });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Cannot find category');
    });

    it('should return a 400 error if save fails', async () => {
        const categoryToUpdate = { ...mockCategory, save: jest.fn().mockRejectedValue(new Error('Save failed')) };
        Category.findById.mockResolvedValue(categoryToUpdate);
        const res = await request(app).patch(`/categories/${mockCategory._id}`).send({ name: 'Updated Name' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Save failed');
    });
});


/********/
/* DELETE */
/********/

// DELETE /categories/:id
describe('DELETE /categories/:id', () => {
    it('should delete a category by ID', async () => {
        Category.findByIdAndDelete.mockResolvedValue(mockCategory);
        const res = await request(app).delete(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Category deleted');
    });

    it('should return 404 if category not found', async () => {
        Category.findByIdAndDelete.mockResolvedValue(null);
        const res = await request(app).delete(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Category not found');
    });

    it('should return a 500 error if delete fails', async () => {
        Category.findByIdAndDelete.mockRejectedValue(new Error('Database error'));
        const res = await request(app).delete(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});