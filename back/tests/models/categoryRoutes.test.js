const request = require('supertest'); // Import supertest for HTTP testing
const express = require('express'); // Import express
const router = require('../../api/routes/categoryRoutes'); // Import category routes
const Category = require('../../api/models/category'); // Import Category model
jest.mock('../../api/models/category'); // Mock the Category model methods

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use('/categories', router); // Use category routes

let enumLanguage = ['eng', 'fr'];
let mockCategories; // Mock caterogies list object
let mockCategory;
beforeEach(() => {
    mockCategories = [ {
        _id: "6702a8418357fa576c95ea44",
        categoryId: "6702a8418357fa576c95ea43",
        name: "Test Category name",
        description: "Test Category description",
        language: "eng",
        createdAt: "2024-10-06T15:09:53.744Z",
        updatedAt: "2024-10-06T15:09:53.744Z",
        __v: 0
    }];

    mockCategory = mockCategories[0];
    Category.find.mockResolvedValue(mockCategories);

    Category.schema = { path: () => ({ enumValues: enumLanguage }) };
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
        const res = await request(app).get('/categories');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockCategory]);
    });

    it('should return 500 error on server failure', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get('/categories');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});

// GET /categories/:id
describe('GET /categories/:id', () => {
    it('should return 404 error if category not found', async () => {
        Category.findById.mockResolvedValue(null);
        const res = await request(app).get(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Category not found');
    });

    it('should return 500 error if findById fails', async () => {
        Category.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });

    it('should return a category by ID', async () => {
        Category.findById.mockResolvedValue(mockCategory);
        const res = await request(app).get(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockCategory);
    });
});


/********/
/* POST */
/********/

// POST /categories
describe('POST /categories', () => {       
    it('should return 400 error if missing parameters', async () => {
        Category.prototype.save.mockResolvedValue(mockCategory);
        const resOnlyName = await request(app).post('/categories').send({ name: 'Only Name' });
        expect(resOnlyName.status).toBe(400);
        expect(resOnlyName.body.message).toBe('Missing parameters');
        expect(resOnlyName.body.missing).toEqual(['description', 'language']);
        
        const resOnlyDescription = await request(app).post('/categories').send({ description: 'Only Description' });
        expect(resOnlyDescription.status).toBe(400);
        expect(resOnlyDescription.body.message).toBe('Missing parameters');
        expect(resOnlyDescription.body.missing).toEqual(['name', 'language']);
    
        const resOnlyLanguage = await request(app).post('/categories').send({ language: 'Only Language' });
        expect(resOnlyLanguage.status).toBe(400);
        expect(resOnlyLanguage.body.message).toBe('Missing parameters');
        expect(resOnlyLanguage.body.missing).toEqual(['name', 'description']);

        const resMissingAllParameters = await request(app).post('/categories').send();
        expect(resMissingAllParameters.status).toBe(400);
        expect(resMissingAllParameters.body.message).toBe('Missing parameters');
        expect(resMissingAllParameters.body.missing).toEqual(['name', 'description', 'language']);
    });

    it('should return 400 error if parameters not string', async () => {
        Category.prototype.save.mockResolvedValue(mockCategory);
        const resNameNotString = await request(app).post('/categories').send({ name: 0, description: 'New Description', language: 'eng' });
        expect(resNameNotString.status).toBe(400);
        expect(resNameNotString.body.message).toBe('Parameters must be strings');
        expect(resNameNotString.body.invalidParams).toEqual({ name : 0 });

        const resDescriptionNotString = await request(app).post('/categories').send({ name: 'New Name', description: 1, language: 'eng' });
        expect(resDescriptionNotString.status).toBe(400);
        expect(resDescriptionNotString.body.message).toBe('Parameters must be strings');
        expect(resDescriptionNotString.body.invalidParams).toEqual({ description : 1 });

        const resLanguageNotString = await request(app).post('/categories').send({ name: 'New Name', description: 'New Description', language: 2 });
        expect(resLanguageNotString.status).toBe(400);
        expect(resLanguageNotString.body.message).toBe('Parameters must be strings');
        expect(resLanguageNotString.body.invalidParams).toEqual({ language : 2 });

        const resAllParametersNotString = await request(app).post('/categories').send({ name: 0, description: 1, language: 2 });
        expect(resAllParametersNotString.status).toBe(400);
        expect(resAllParametersNotString.body.message).toBe('Parameters must be strings');
        expect(resAllParametersNotString.body.invalidParams).toEqual({ name: 0, description: 1, language: 2 });
    });

    it('should return 400 error if parameter language incorrect', async () => {
        Category.prototype.save.mockResolvedValue(mockCategory);
        const res = await request(app).post('/categories').send({ name: 'New Category', description: 'New Description', language: 'Not a language' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.invalidParams).toEqual('Not a language');
    });

    it('should create a new category', async () => {
        Category.prototype.save.mockResolvedValue(mockCategory);
        const res = await request(app).post('/categories').send({ name: 'New Category', description: 'New Description', language: 'eng' });
        expect(res.status).toBe(201);
        expect(res.body).toEqual(mockCategory);
    });

    it('should return 400 error if save fails', async () => {
        Category.prototype.save.mockRejectedValue(new Error('Validation error'));
        const res = await request(app).post('/categories').send({ name: 'New Category', description: 'New Description', language: 'eng' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Validation error');
    });
});

describe('POST /categories/bulk', () => {
    it('should return 400 error if missing categories parameter', async () => {

    })

    it('should return 400 error if missing parameters', async () => {

    })

    it('should return 400 error if parameters not string', async () => {

    })

    it('should return 400 res if parameter language incorrect', async () => {

    })

    it('should return 400 res if multiple error', async () => {

    })

    it('should create a new categories', async () => {

    })

    it('should return 400 error if save fails', async () => {
        Category.prototype.save.mockRejectedValue(new Error('Validation error'));
        const res = await request(app).post('/categories').send(
            {
                "categories": [
                    {
                        "name": "0",
                        "description": "1",
                        "language":"eng"
                    }                
                ]
            });
         console.log("res", res)
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Validation error');        
    })
});

describe('POST /categories/csv', () => {       
});


/********/
/* UPDATE */
/********/

// PATCH /categories/:id
describe('PATCH /categories/:id', () => {
    it('should return 404 if category not found', async () => {
        Category.findById.mockResolvedValue(null);
        const res = await request(app).patch(`/categories/${mockCategory._id}`).send({ name: 'Updated Name' });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Category not found');
    });

    it('should return 500 error if findById fails', async () => {
        const categoryToUpdate = { ...mockCategory, save: jest.fn().mockResolvedValue(mockCategory) };       
        Category.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).patch(`/categories/${mockCategory._id}`).send({ name: 'Updated Name' });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });  

    it('should return 400 error if parameter name is not a string', async () => {
        const categoryToUpdate = { ...mockCategory, save: jest.fn().mockResolvedValue(mockCategory) };        
        Category.findById.mockResolvedValue(categoryToUpdate);   

        const resNameNotString = await request(app).patch(`/categories/${mockCategory._id}`).send({ name: 0 });
        expect(resNameNotString.status).toBe(400);
        expect(resNameNotString.body.message).toBe('Parameters must be strings');
        expect(resNameNotString.body.invalidParams).toEqual({ name: 0 });
            
        const resDescriptionNotString = await request(app).patch(`/categories/${mockCategory._id}`).send({ description: 1 });
        expect(resDescriptionNotString.status).toBe(400);
        expect(resDescriptionNotString.body.message).toBe('Parameters must be strings');
        expect(resDescriptionNotString.body.invalidParams).toEqual({ description: 1 });
        
        const resLanguageNotString = await request(app).patch(`/categories/${mockCategory._id}`).send({ language: 2 });
        expect(resLanguageNotString.status).toBe(400);
        expect(resLanguageNotString.body.message).toBe('Parameters must be strings');
        expect(resLanguageNotString.body.invalidParams).toEqual({ language: 2 });
             
        const resAllParametersNotString = await request(app).patch(`/categories/${mockCategory._id}`).send({ name: 0, description: 1, language: 2 });
        expect(resAllParametersNotString.status).toBe(400);
        expect(resAllParametersNotString.body.message).toBe('Parameters must be strings');
        expect(resAllParametersNotString.body.invalidParams).toEqual({ name: 0, description: 1, language: 2 });
    });   

    it('should return 400 res if parameter language incorrect', async () => {     
        const categoryToUpdate = { ...mockCategory, save: jest.fn().mockResolvedValue(mockCategory) };        
        Category.findById.mockResolvedValue(categoryToUpdate);        
        const res = await request(app).patch(`/categories/${mockCategory._id}`).send({ language: 'Not a language' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.invalidParams).toEqual('Not a language');
    });

    it('should return 200 res if no fields were updated', async () => {        
        const categoryToUpdate = { ...mockCategory, save: jest.fn().mockResolvedValue(mockCategory) };
        Category.findById.mockResolvedValue(categoryToUpdate);        
        const res = await request(app).patch(`/categories/${mockCategory._id}`).send({ name: 'Test Category name', description: 'Test Category description', language: 'eng' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('No fields were updated');
    }); 

    it('should update a category', async () => {        
        const categoryToUpdate = { ...mockCategory, save: jest.fn().mockResolvedValue(mockCategory) };        
        Category.findById.mockResolvedValue(categoryToUpdate);        
        const res = await request(app).patch(`/categories/${mockCategory._id}`).send({ name: 'Updated Category name' });
        expect(res.status).toBe(200);
        expect(categoryToUpdate.name).toBe('Updated Category name');
    });

    it('should return 400 error if save fails', async () => {        
        const categoryToUpdate = { ...mockCategory, save: jest.fn().mockRejectedValue(new Error('Save failed')) };
        Category.findById.mockResolvedValue(categoryToUpdate);
        const res = await request(app).patch(`/categories/${mockCategory._id}`).send({ name: 'Updated Category Name' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Save failed');
    });
});


/********/
/* DELETE */
/********/

// DELETE /categories/:id
describe('DELETE /categories/:id', () => {
    it('should return 404 error if category not found', async () => {
        Category.findById.mockResolvedValue(null);
        const res = await request(app).delete(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Category not found');
    });

    it('should return a 500 error if finding category fails', async () => {
        Category.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).delete(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });

    it('should return 404 if category not found during delete', async () => {
        Category.findById.mockResolvedValue(mockCategory);
        Category.findByIdAndDelete.mockResolvedValue(null);
        const res = await request(app).delete(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Category not found');
    });

    it('should delete a category by ID', async () => {
        Category.findById.mockResolvedValue(mockCategory);
        Category.findByIdAndDelete.mockResolvedValue(mockCategory);
        const res = await request(app).delete(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Category deleted');
    });  

    it('should return a 500 error if delete fails', async () => {
        Category.findById.mockResolvedValue(mockCategory);
        Category.findByIdAndDelete.mockRejectedValue(new Error('Database error'));
        const res = await request(app).delete(`/categories/${mockCategory._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Database error');
    });
});