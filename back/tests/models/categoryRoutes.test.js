const request = require('supertest'); // Import supertest for HTTP testing
const express = require('express'); // Import express
const router = require('../../api/routes/categoryRoutes'); // Import category routes
const Category = require('../../api/models/category'); // Import Category model
jest.mock('../../api/models/category'); // Mock the Category model methods

const app = express();
app.use(express.json()); // Middleware for JSON parsing
app.use('/categories', router); // Use category routes

const enumLanguage = ['eng', 'fr'];
const mockCategories = [{
    _id: '6702a8418357fa576c95ea44',
    categoryId: '6702a8418357fa576c95ea43',
    name: 'Test Category name',
    description: 'Test Category description',
    language: 'eng',
    createdAt: '2024-10-06T15:09:53.744Z',
    updatedAt: '2024-10-06T15:09:53.744Z',
    __v: 0,
}];
const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
};

beforeEach(() => {
    // setup Mocks
    Category.find.mockResolvedValue(mockCategories);
    Category.schema = { path: () => ({ enumValues: enumLanguage }) };
    Category.startSession.mockResolvedValue(mockSession);
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
        expect(res.body).toEqual(mockCategories);
    });

    it('should return 500 error on server failure', async () => {
        Category.find.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get('/categories');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });
});

// GET /categories/:id
describe('GET /categories/:id', () => {
    it('should return 404 error if category not found', async () => {
        Category.findById.mockResolvedValue(null);
        const res = await request(app).get(`/categories/${mockCategories[0]._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should return 500 error if findById fails', async () => {
        Category.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).get(`/categories/${mockCategories[0]._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return a category by ID', async () => {
        Category.findById.mockResolvedValue(mockCategories[0]);
        const res = await request(app).get(`/categories/${mockCategories[0]._id}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockCategories[0]);
    });
});


/********/
/* POST */
/********/

// POST /categories
describe('POST /categories', () => {
    it('should return 400 error if missing parameters', async () => {
        const newOnlyName  = { name: 'Only Name' };
        Category.prototype.save.mockResolvedValue(newOnlyName);
        const resOnlyName = await request(app).post('/categories').send(newOnlyName);
        expect(resOnlyName.status).toBe(400);
        expect(resOnlyName.body.message).toBe('An error occurred');
        expect(resOnlyName.body.error).toBe('Missing parameters');
        expect(resOnlyName.body.missing).toEqual(['description', 'language']);

        const newOnlyDescription  = { description: 'Only Description' };
        Category.prototype.save.mockResolvedValue(newOnlyDescription);
        const resOnlyDescription = await request(app).post('/categories').send(newOnlyDescription);
        expect(resOnlyDescription.status).toBe(400);
        expect(resOnlyDescription.body.message).toBe('An error occurred');
        expect(resOnlyDescription.body.error).toBe('Missing parameters');
        expect(resOnlyDescription.body.missing).toEqual(['name', 'language']);

        const newOnlyLanguage  = { language: 'Only Language' };
        Category.prototype.save.mockResolvedValue(newOnlyLanguage);
        const resOnlyLanguage = await request(app).post('/categories').send(newOnlyLanguage);
        expect(resOnlyLanguage.status).toBe(400);
        expect(resOnlyLanguage.body.message).toBe('An error occurred');
        expect(resOnlyLanguage.body.error).toBe('Missing parameters');
        expect(resOnlyLanguage.body.missing).toEqual(['name', 'description']);

        const newMissingAllParameters  = {};
        Category.prototype.save.mockResolvedValue(newMissingAllParameters);
        const resMissingAllParameters = await request(app).post('/categories').send(newMissingAllParameters);
        expect(resMissingAllParameters.status).toBe(400);
        expect(resMissingAllParameters.body.message).toBe('An error occurred');
        expect(resMissingAllParameters.body.error).toBe('Missing parameters');
        expect(resMissingAllParameters.body.missing).toEqual(['name', 'description', 'language']);
    });

    it('should return 400 error if parameters not string', async () => {
        const newNameNotString  = { name: 0, description: 'New Description', language: 'eng' };
        Category.prototype.save.mockResolvedValue(newNameNotString);
        const resNameNotString = await request(app).post('/categories').send(newNameNotString);
        expect(resNameNotString.status).toBe(400);
        expect(resNameNotString.body.message).toBe('An error occurred');
        expect(resNameNotString.body.error).toBe('Parameters must be strings');
        expect(resNameNotString.body.invalidParams).toEqual({ name : 0 });

        const newDescriptionNotString  = { name: 'New Name', description: 1, language: 'eng' };
        Category.prototype.save.mockResolvedValue(newDescriptionNotString);
        const resDescriptionNotString = await request(app).post('/categories').send(newDescriptionNotString);
        expect(resDescriptionNotString.status).toBe(400);
        expect(resDescriptionNotString.body.message).toBe('An error occurred');
        expect(resDescriptionNotString.body.error).toBe('Parameters must be strings');
        expect(resDescriptionNotString.body.invalidParams).toEqual({ description : 1 });

        const newLanguageNotString  = { name: 'New Name', description: 'New Description', language: 2 };
        Category.prototype.save.mockResolvedValue(newLanguageNotString);
        const resLanguageNotString = await request(app).post('/categories').send(newLanguageNotString);
        expect(resLanguageNotString.status).toBe(400);
        expect(resLanguageNotString.body.message).toBe('An error occurred');
        expect(resLanguageNotString.body.error).toBe('Parameters must be strings');
        expect(resLanguageNotString.body.invalidParams).toEqual({ language : 2 });

        const newCategoryAllParametersNotString = { name: 0, description: 1, language: 2 };
        Category.prototype.save.mockResolvedValue(newCategoryAllParametersNotString);        
        const resAllParametersNotString = await request(app).post('/categories').send(newCategoryAllParametersNotString);
        expect(resAllParametersNotString.status).toBe(400);
        expect(resAllParametersNotString.body.message).toBe('An error occurred');
        expect(resAllParametersNotString.body.error).toBe('Parameters must be strings');
        expect(resAllParametersNotString.body.invalidParams).toEqual({ name: 0, description: 1, language: 2 });
    });

    it('should return 400 error if parameter language incorrect', async () => {
        const newCategory = { name: 'New Category', description: 'New Description', language: 'Not a language' };
        Category.prototype.save.mockResolvedValue(newCategory);
        const res = await request(app).post('/categories').send(newCategory);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.invalidParams).toEqual('Not a language');
    });

    it('should create a new category', async () => {
        const newCategory = {name: 'New Category', description: 'New Description', language: 'eng'};
        Category.prototype.save.mockResolvedValue(newCategory);
        const res = await request(app).post('/categories').send(newCategory);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(newCategory);
    });

    it('should return 500 error if save fails', async () => {
        Category.prototype.save.mockRejectedValue(new Error('Validation error'));
        const res = await request(app).post('/categories').send({ name: 'New Category', description: 'New Description', language: 'eng' });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Validation error');
    });
});

// POST /categories/bulk
describe('POST /categories/bulk', () => {
    it('should return 400 error if missing categories parameter or empty', async () => {
        const newMissing = {};
        Category.prototype.save.mockResolvedValue(newMissing);
        const resMissing = await request(app).post('/categories/bulk').send(newMissing);
        expect(resMissing.status).toBe(400);
        expect(resMissing.body.message).toBe('An error occurred');
        expect(resMissing.body.error).toBe('Categories must be a non-empty array');
        
        const newEmpty = [];
        Category.prototype.save.mockResolvedValue(newEmpty);
        const resEmpty = await request(app).post('/categories/bulk').send({ 'categories': newEmpty});
        expect(resEmpty.status).toBe(400);
        expect(resEmpty.body.message).toBe('An error occurred');
        expect(resEmpty.body.error).toBe('Categories must be a non-empty array');
    });
 
    it('should return 400 error if missing parameters', async () => {
        const newCategories = [
            { description: 'New Description 1', language: 'eng'},
            { name: 'New Name 2', language: 'eng'},
            { name: 'New Name 3', description: 'New Description 3'},
            { name: 'New Name 4'},
            {}
        ];
        Category.prototype.save.mockResolvedValue(newCategories);
        
        const res = await request(app).post('/categories/bulk').send({categories: newCategories});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some categories could not be processed');
        expect(res.body.length).toBe(newCategories.length);
        expect(res.body.errors.length).toBe(newCategories.length);
        expect(res.body.errors[0].error).toBe('Missing parameters');
        expect(res.body.errors[0].missing).toEqual([ 'name' ]);
        expect(res.body.errors[0].category).toMatchObject(newCategories[0]);
        expect(res.body.errors[1].error).toBe('Missing parameters');
        expect(res.body.errors[1].missing).toEqual([ 'description' ]);
        expect(res.body.errors[1].category).toMatchObject(newCategories[1]);
        expect(res.body.errors[2].error).toBe('Missing parameters');
        expect(res.body.errors[2].missing).toEqual([ 'language' ]);
        expect(res.body.errors[2].category).toMatchObject(newCategories[2]);
        expect(res.body.errors[3].error).toBe('Missing parameters');
        expect(res.body.errors[3].missing).toEqual([ 'description', 'language' ]);
        expect(res.body.errors[3].category).toMatchObject(newCategories[3]);
        expect(res.body.errors[4].error).toBe('Missing parameters');
        expect(res.body.errors[4].missing).toEqual([ 'name', 'description', 'language' ]);
        expect(res.body.errors[4].category).toMatchObject(newCategories[4]);

        expect(Category.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should return 400 error if parameters are not strings', async () => {
        const newCategories = [
            { name: 0, description: 'New Description 1', language: 'eng'},
            { name: 'New Name 2', description: 1, language: 'eng'},
            { name: 2, description: 3, language: 4}
        ];
        Category.prototype.save.mockResolvedValue(newCategories);

        const res = await request(app).post('/categories/bulk').send({categories: newCategories});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some categories could not be processed');
        expect(res.body.length).toBe(newCategories.length + 1); // due to language not part of enumLanguage in { name: 2, description: 3, language: 4}
        expect(res.body.errors.length).toBe(newCategories.length + 1);
        expect(res.body.errors[0].error).toBe('Parameters must be strings');
        expect(res.body.errors[0].invalidParams).toEqual({ name: 0});
        expect(res.body.errors[0].category).toMatchObject(newCategories[0]);
        expect(res.body.errors[1].error).toBe('Parameters must be strings');
        expect(res.body.errors[1].invalidParams).toEqual({ description: 1});
        expect(res.body.errors[1].category).toMatchObject(newCategories[1]);
        expect(res.body.errors[2].error).toBe('Parameters must be strings');
        expect(res.body.errors[2].invalidParams).toEqual({ name: 2, description: 3, language: 4});
        expect(res.body.errors[2].category).toMatchObject(newCategories[2]);

        expect(Category.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should return 400 error if language not part of ' + enumLanguage, async () => {
        const newCategories = [
            { name: 'New Name 1', description: 'New Description 1', language: 'jap'},
            { name: 'New Name 2', description: 'New Description 2', language: 'spa'}
        ];
        Category.prototype.save.mockResolvedValue(newCategories);

        const res = await request(app).post('/categories/bulk').send({categories: newCategories});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some categories could not be processed');
        expect(res.body.length).toBe(newCategories.length);
        expect(res.body.errors.length).toBe(newCategories.length);
        expect(res.body.errors[0].error).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.errors[0].category).toMatchObject(newCategories[0]);
        expect(res.body.errors[0].invalidParams).toEqual({ language: 'jap'});
        expect(res.body.errors[1].error).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.errors[1].category).toMatchObject(newCategories[1]);
        expect(res.body.errors[1].invalidParams).toEqual({ language: 'spa'});
    });

    it('should return 400 error if multiple errors occur', async () => {
        const newCategories = [
            { name: 0, language: 1},
            { name: 2, description: 'New Description 2', language: 'jap'},
            { description: 'New Description 3'}
        ];
        Category.prototype.save.mockResolvedValue(newCategories);

        const res = await request(app).post('/categories/bulk').send({categories: newCategories});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some categories could not be processed');
        expect(res.body.length).toBe(6);
        expect(res.body.errors.length).toBe(6);
        expect(res.body.errors[0].error).toBe('Missing parameters');
        expect(res.body.errors[0].missing).toEqual([ 'description' ]);
        expect(res.body.errors[0].category).toEqual(newCategories[0]);
        expect(res.body.errors[1].error).toBe('Parameters must be strings');
        expect(res.body.errors[1].invalidParams).toEqual({ name: 0, language: 1});
        expect(res.body.errors[1].category).toMatchObject(newCategories[0]);
        expect(res.body.errors[2].error).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.errors[2].category).toMatchObject(newCategories[0]);
        expect(res.body.errors[2].invalidParams).toEqual({ language: 1});
        expect(res.body.errors[3].error).toBe('Parameters must be strings');
        expect(res.body.errors[3].invalidParams).toEqual({ name: 2 });
        expect(res.body.errors[3].category).toMatchObject(newCategories[1]);
        expect(res.body.errors[4].error).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.errors[4].category).toMatchObject(newCategories[1]);
        expect(res.body.errors[4].invalidParams).toEqual({ language: 'jap'});
        expect(res.body.errors[5].error).toBe('Missing parameters');
        expect(res.body.errors[5].missing).toEqual([ 'name', 'language' ]);
        expect(res.body.errors[5].category).toEqual(newCategories[2]);

        expect(Category.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should create a new category successfully', async () => {
        const newCategories = [
            { name: 'New Name 1', description: 'New Description 1', language: 'eng'},
            { name: 'New Name 2', description: 'New Description 2', language: 'eng'},
            { name: 'New Name 3', description: 'New Description 3', language: 'fr'}
        ];
        Category.prototype.save.mockResolvedValue(newCategories);

        const res = await request(app).post('/categories/bulk').send({categories: newCategories});
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Categories created successfully');
        expect(res.body.categories[0].length).toBe(newCategories.length);
        expect(res.body.categories[0][0]).toMatchObject(newCategories[0]);
        expect(res.body.categories[0][1]).toMatchObject(newCategories[1]);
        expect(res.body.categories[0][2]).toMatchObject(newCategories[2]);

        expect(Category.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
      });

    it('should return 500 error if save fails', async () => {
        Category.prototype.save.mockRejectedValue(new Error('Validation error'));
        const newCategories = [
            { name: 'New Name 1', description: 'New Description 1', language: 'eng'},
            { name: 'New Name 2', description: 'New Description 2', language: 'eng'},
            { name: 'New Name 3', description: 'New Description 3', language: 'fr'}
        ];

        const res = await request(app).post('/categories/bulk').send({categories: newCategories})
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Validation error');

        expect(Category.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });
});

function arrayToCustomCsvBuffer(data) {
    const headers = ['name', 'description', 'language'];
    const csvRows = [];

    csvRows.push(headers.join(';'));

    for (const row of data) {
        const values = headers.map(header => row[header] !== undefined ? row[header] : '');
        csvRows.push(values.join(';'));
    }

    const csvString = csvRows.join('\n') + '\n';
    return Buffer.from(csvString);
}

describe('POST /categories/csv', () => {
    it('should return 400 error if missing categories parameter or empty', async () => {
        const csvBufferMissing = Buffer.from('');
        const resMissing = await request(app).post('/categories/csv').attach('categories', arrayToCustomCsvBuffer(csvBufferMissing), 'categories.csv');
        expect(resMissing.status).toBe(400);
        expect(resMissing.body.message).toBe('An error occurred');
        expect(resMissing.body.error).toBe('Categories must be a non-empty array');

        const csvBufferEmpty = Buffer.from('name,description,language\n');
        const resEmpty = await request(app).post('/categories/csv').attach('categories', csvBufferEmpty, 'categories.csv');
        expect(resEmpty.status).toBe(400);
        expect(resEmpty.body.message).toBe('An error occurred');
        expect(resEmpty.body.error).toBe('Categories must be a non-empty array');
    });

    it('should return 400 error if missing parameters', async () => {
        const newCategories = [
            { description: 'New Description 1', language: 'eng'},
            { name: 'New Name 2', language: 'eng'},
            { name: 'New Name 3', description: 'New Description 3'},
            { name: 'New Name 4'},
            {}
        ];
        Category.prototype.save.mockResolvedValue(newCategories);

        const res = await request(app).post('/categories/csv').attach('categories', arrayToCustomCsvBuffer(newCategories), 'categories.csv');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some categories could not be processed');
        expect(res.body.length).toBe(newCategories.length);
        expect(res.body.errors.length).toBe(newCategories.length);
        expect(res.body.errors[0].error).toBe('Missing parameters');
        expect(res.body.errors[0].missing).toEqual([ 'name' ]);
        expect(res.body.errors[0].category).toMatchObject(newCategories[0]);
        expect(res.body.errors[1].error).toBe('Missing parameters');
        expect(res.body.errors[1].missing).toEqual([ 'description' ]);
        expect(res.body.errors[1].category).toMatchObject(newCategories[1]);
        expect(res.body.errors[2].error).toBe('Missing parameters');
        expect(res.body.errors[2].missing).toEqual([ 'language' ]);
        expect(res.body.errors[2].category).toMatchObject(newCategories[2]);
        expect(res.body.errors[3].error).toBe('Missing parameters');
        expect(res.body.errors[3].missing).toEqual([ 'description', 'language' ]);
        expect(res.body.errors[3].category).toMatchObject(newCategories[3]);
        expect(res.body.errors[4].error).toBe('Missing parameters');
        expect(res.body.errors[4].missing).toEqual([ 'name', 'description', 'language' ]);
        expect(res.body.errors[4].category).toMatchObject(newCategories[4]);

        expect(Category.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should return 400 error if language not part of ' + enumLanguage, async () => {
        const newCategories = [
            { name: 'New Name 1', description: 'New Description 1', language: 'jap'},
            { name: 'New Name 2', description: 'New Description 2', language: 'spa'}
        ];
        Category.prototype.save.mockResolvedValue(newCategories);

        const res = await request(app).post('/categories/csv').attach('categories', arrayToCustomCsvBuffer(newCategories), 'categories.csv');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some categories could not be processed');
        expect(res.body.length).toBe(newCategories.length);
        expect(res.body.errors.length).toBe(newCategories.length);
        expect(res.body.errors[0].error).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.errors[0].category).toMatchObject(newCategories[0]);
        expect(res.body.errors[0].invalidParams).toEqual({ language: 'jap'});
        expect(res.body.errors[1].error).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.errors[1].category).toMatchObject(newCategories[1]);
        expect(res.body.errors[1].invalidParams).toEqual({ language: 'spa'});
    });

    it('should return 400 error if multiple errors occur', async () => {
        const newCategories = [
            { name: 'New Name 1', language: 'spa'},
            { name: 'New Name 2', description: 'New Description 2', language: 'jap'},
            { description: 'New Description 3'}
        ];
        Category.prototype.save.mockResolvedValue(newCategories);

        const res = await request(app).post('/categories/csv').attach('categories', arrayToCustomCsvBuffer(newCategories), 'categories.csv');
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Some categories could not be processed');
        expect(res.body.length).toBe(4);
        expect(res.body.errors.length).toBe(4);
        expect(res.body.errors[0].error).toBe('Missing parameters');
        expect(res.body.errors[0].missing).toEqual([ 'description' ]);
        expect(res.body.errors[0].category).toMatchObject(newCategories[0]);
        expect(res.body.errors[1].error).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.errors[1].category).toMatchObject(newCategories[0]);
        expect(res.body.errors[1].invalidParams).toEqual({ language: "spa"});
        expect(res.body.errors[2].error).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.errors[2].category).toMatchObject(newCategories[1]);
        expect(res.body.errors[2].invalidParams).toEqual({ language: 'jap'});
        expect(res.body.errors[3].error).toBe('Missing parameters');
        expect(res.body.errors[3].missing).toEqual([ 'name', 'language' ]);
        expect(res.body.errors[3].category).toMatchObject(newCategories[2]);

        expect(Category.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should create a new category successfully', async () => {
        const newCategories = [
            { name: 'New Name 1', description: 'New Description 1', language: 'eng'},
            { name: 'New Name 2', description: 'New Description 2', language: 'eng'},
            { name: 'New Name 3', description: 'New Description 3', language: 'fr'}
        ];
        Category.prototype.save.mockResolvedValue(newCategories);

        const res = await request(app).post('/categories/csv').attach('categories', arrayToCustomCsvBuffer(newCategories), 'categories.csv');
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Categories created successfully');
        expect(res.body.categories[0].length).toBe(newCategories.length);
        expect(res.body.categories[0][0]).toMatchObject(newCategories[0]);
        expect(res.body.categories[0][1]).toMatchObject(newCategories[1]);
        expect(res.body.categories[0][2]).toMatchObject(newCategories[2]);

        expect(Category.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
      });

    it('should return 500 error if save fails', async () => {
        const newCategories = [
            { name: 'New Name 1', description: 'New Description 1', language: 'eng'},
            { name: 'New Name 2', description: 'New Description 2', language: 'eng'},
            { name: 'New Name 3', description: 'New Description 3', language: 'fr'}
        ];        
        Category.prototype.save.mockRejectedValue(new Error('Validation error'));
    
        const res = await request(app).post('/categories/csv').attach('categories', arrayToCustomCsvBuffer(newCategories), 'categories.csv');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Validation error');

        expect(Category.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });

    it('should return 500 and error message for failed CSV processing', async () => {
        const res = await request(app).post('/categories/csv').attach('categories', null, 'categories.csv');
        expect(res.status).toBe(500);        
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Failed to process CSV');
    });
});


/********/
/* UPDATE */
/********/

// PATCH /categories/:id
describe('PATCH /categories/:id', () => {
    it('should return 404 if category not found', async () => {
        Category.findById.mockResolvedValue(null);
        const res = await request(app).patch(`/categories/${mockCategories[0]._id}`).send({ name: 'Updated Name' });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should return 500 error if findById fails', async () => {
        Category.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).patch(`/categories/${mockCategories[0]._id}`).send({ name: 'Updated Name' });
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 400 error if parameter name is not a string', async () => {
        const categoryToUpdate = { ...mockCategories[0], save: jest.fn().mockResolvedValue(mockCategories[0]) };
        Category.findById.mockResolvedValue(categoryToUpdate);

        const resNameNotString = await request(app).patch(`/categories/${mockCategories[0]._id}`).send({ name: 0 });
        expect(resNameNotString.status).toBe(400);
        expect(resNameNotString.body.message).toBe('An error occurred');
        expect(resNameNotString.body.error).toBe('Parameters must be strings');
        expect(resNameNotString.body.invalidParams).toEqual({ name: 0 });

        const resDescriptionNotString = await request(app).patch(`/categories/${mockCategories[0]._id}`).send({ description: 1 });
        expect(resDescriptionNotString.status).toBe(400);
        expect(resDescriptionNotString.body.message).toBe('An error occurred');
        expect(resDescriptionNotString.body.error).toBe('Parameters must be strings');
        expect(resDescriptionNotString.body.invalidParams).toEqual({ description: 1 });

        const resLanguageNotString = await request(app).patch(`/categories/${mockCategories[0]._id}`).send({ language: 2 });
        expect(resLanguageNotString.status).toBe(400);
        expect(resLanguageNotString.body.message).toBe('An error occurred');
        expect(resLanguageNotString.body.error).toBe('Parameters must be strings');
        expect(resLanguageNotString.body.invalidParams).toEqual({ language: 2 });

        const resAllParametersNotString = await request(app).patch(`/categories/${mockCategories[0]._id}`).send({ name: 0, description: 1, language: 2 });
        expect(resAllParametersNotString.status).toBe(400);
        expect(resAllParametersNotString.body.message).toBe('An error occurred');
        expect(resAllParametersNotString.body.error).toBe('Parameters must be strings');
        expect(resAllParametersNotString.body.invalidParams).toEqual({ name: 0, description: 1, language: 2 });
    }); 

    it('should return 400 res if parameter language incorrect', async () => {
        const categoryToUpdate = { ...mockCategories[0], save: jest.fn().mockResolvedValue(mockCategories[0]) };
        Category.findById.mockResolvedValue(categoryToUpdate);
        const res = await request(app).patch(`/categories/${mockCategories[0]._id}`).send({ language: 'Not a language' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Language must be part of [' + enumLanguage + ']');
        expect(res.body.invalidParams).toEqual('Not a language');
    });

    it('should return 200 res if no fields were updated', async () => {
        const categoryToUpdate = { ...mockCategories[0], save: jest.fn().mockResolvedValue(mockCategories[0]) };
        Category.findById.mockResolvedValue(categoryToUpdate);
        const res = await request(app).patch(`/categories/${mockCategories[0]._id}`).send({ name: 'Test Category name', description: 'Test Category description', language: 'eng' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('No fields were updated');
    });

    it('should update a category', async () => {
        const currentDate = new Date().toISOString(); 
        const updatedCategory = { 
            ...mockCategories[0], 
            name: 'Updated Category name', 
            updatedAt: currentDate,
            save: jest.fn().mockResolvedValue({ ...mockCategories[0], name: 'Updated Category name', updatedAt: currentDate })
        };
        Category.findById.mockResolvedValue(updatedCategory);

        const res = await request(app).patch(`/categories/${mockCategories[0]._id}`).send({ name: 'Updated Category name' });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Category name');
        expect(res.body.updatedAt).toBe(currentDate);
        expect(updatedCategory.save).toHaveBeenCalled();
    });

    it('should return 400 error if save fails', async () => {
        const categoryToUpdate = { ...mockCategories[0], save: jest.fn().mockRejectedValue(new Error('Save failed')) };
        Category.findById.mockResolvedValue(categoryToUpdate);
        const res = await request(app).patch(`/categories/${mockCategories[0]._id}`).send({ name: 'Updated Category Name' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Save failed');
    });
});


/********/
/* DELETE */
/********/

// Delete all categories
describe('DELETE /categories/all', () => {
    it('should delete all categories', async () => {
        Category.deleteMany.mockResolvedValue({ deletedCount: 2 });
        const res = await request(app).delete('/categories/all');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('All categories deleted');
        expect(res.body.deletedCount).toBe(2);

        // Verify deleteMany was called correctly
        expect(Category.deleteMany).toHaveBeenCalledWith({});
    });

    it('should return a 500 error if delete fails', async () => {
        Category.deleteMany.mockRejectedValue(new Error('Deletion failed'));
        const res = await request(app).delete('/categories/all');
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Deletion failed');
    });
});

// DELETE /categories/:id
describe('DELETE /categories/:id', () => {
    it('should return 404 error if category not found', async () => {
        Category.findById.mockResolvedValue(null);
        const res = await request(app).delete(`/categories/${mockCategories[0]._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should return a 500 error if finding category fails', async () => {
        Category.findById.mockRejectedValue(new Error('Database error'));
        const res = await request(app).delete(`/categories/${mockCategories[0]._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });

    it('should return 404 if category not found during delete', async () => {
        Category.findById.mockResolvedValue(mockCategories[0]);
        Category.findByIdAndDelete.mockResolvedValue(null);
        const res = await request(app).delete(`/categories/${mockCategories[0]._id}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Category not found');
    });

    it('should delete a category by ID', async () => {
        Category.findById.mockResolvedValue(mockCategories[0]);
        Category.findByIdAndDelete.mockResolvedValue(mockCategories[0]);
        const res = await request(app).delete(`/categories/${mockCategories[0]._id}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Category deleted');
    });

    it('should return a 500 error if delete fails', async () => {
        Category.findById.mockResolvedValue(mockCategories[0]);
        Category.findByIdAndDelete.mockRejectedValue(new Error('Database error'));
        const res = await request(app).delete(`/categories/${mockCategories[0]._id}`);
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
        expect(res.body.error).toBe('Database error');
    });
});