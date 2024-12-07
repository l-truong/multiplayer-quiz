/* API calls related to questions */
import axios from '../axios';

export const questionsService = {
    getQuestions(language = '', categories = []) {
        let endpoint = language ? `/questions/${language}` : '/questions';    
        const params = categories.length > 0 ? { categories: categories } : {};
    
        return axios.get(endpoint, params)
            .then(res => res.data)
            .catch(err => {
                console.error('error:', err);
                throw err; 
            });
    },

    getEnglishQuestions(categories = []) {
        this.getQuestions('eng', categories);
    },

    getFrenchQuestions(categories = []) {
        this.getQuestions('fr', categories);
    },

    getRandomQuestions(count, categories = []) {
        if (!count || count <= 0 || isNaN(count)) {
            throw new Error('Invalid count value. Please provide a positive number.');
        }
        
        const params = categories.length > 0 ? { params : {categories: categories } } : {};
        return axios.get(`/questions/random/${count}`, params)
            .then(res => res.data)
            .catch(err => {
                console.error('Error:', err);
                throw err;
            });
    },
    
    getQuestionById(id) {
        return axios.get(`/questions/${id}`)
            .then(res => res.data)
            .catch(err => {
                console.error('Error:', err);
                throw err;
            });
    },

    getStatsQuestions(language = '') {
        const endpoint = language ? `/questions/stats/${language}` : '/questions/stats';
        return axios.get(endpoint)
            .then(res => res.data)
            .catch(err => {
                console.error('error:', err);
                throw err;
            });
    }
}