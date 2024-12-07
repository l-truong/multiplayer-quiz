// navigationMixin.js
export const navigationMixin = {
    methods: {        
        goToHome() {
            this.$router.push('/');
        },        
        goToCategories() {
            this.$router.push("/categories");
        },
        goToQuiz() {
            this.$router.push("/quiz");
        },
        goToResults() {
            this.$router.push("/results");
        }
    }
};