/* API calls related to categories */
import axios from '../axios';

export const categoriesService = {
    getCategories(language = '') {
        const endpoint = language ? `/categories/${language}` : '/categories';
        return axios.get(endpoint)
            .then(res => res.data)
            .catch(err => {
            console.error('error:', err);
            //throw err; 
        });
    },

    getEnglishCategories() {
        this.getCategories('eng');
    },

    getFrenchCategories() {
        this.getCategories('fr');
    },

    getCategoryById(id) {
        return axios.get(`/categories/${id}`)
            .then(res => res.data)
            .catch(err => {
                console.error('Error:', err);
                //throw err;
            });
    }
}