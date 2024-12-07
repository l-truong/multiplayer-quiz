import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { 
    categoriesState, questionsState, statsState, timestampState, answersState, categoriesParametersState,
    setCategories, setQuestions, setStats, setTimer, setAnswers, setCategoriesParametersState
} from './store/store';
import './assets/styles/reset.css';
import './assets/styles/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/styles/main.scss';

const app = createApp(App);

// Use the router and i18n as before
app.use(router);
app.use(i18n);

// Set global properties for the individual reactive states and setter functions
app.config.globalProperties.$categories = categoriesState;
app.config.globalProperties.$questions = questionsState;
app.config.globalProperties.$stats = statsState;
app.config.globalProperties.$timestamp = timestampState;
app.config.globalProperties.$answers = answersState;
app.config.globalProperties.$categoriesParametersState = categoriesParametersState;

app.config.globalProperties.$setCategories = setCategories;
app.config.globalProperties.$setQuestions = setQuestions;
app.config.globalProperties.$setStats = setStats;
app.config.globalProperties.$setTimer = setTimer;
app.config.globalProperties.$setAnswers = setAnswers;
app.config.globalProperties.$setCategoriesParametersState = setCategoriesParametersState;

// Mount the app
app.mount('#app');