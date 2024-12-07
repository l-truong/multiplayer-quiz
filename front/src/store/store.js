import { reactive } from 'vue';

// Define individual reactive states
const categoriesState = reactive([]);
const questionsState = reactive([]);
const statsState = reactive([]);
const timestampState = reactive({ value: 0 });
const answersState = reactive([]);
const categoriesParametersState = ({ 
  choosenNbQuestions: 20,
  choosenCategory: [],
  choosenTimer: 30
});

// Define setter functions
const setCategories = (categories) => {
  categoriesState.length = 0; // Clear the array before setting new values
  categoriesState.push(...categories);
};

const setQuestions = (questions) => {
  questionsState.length = 0; // Clear the array before setting new values
  questionsState.push(...questions);
};

const setStats = (stats) => {
  statsState.length = 0; // Clear the array before setting new values
  statsState.push(...stats);
};

const setTimer = (timestamp) => {
  timestampState.value = timestamp; // Set the timestamp value
};

const setAnswers = (answers) => {
  answersState.length = 0; // Clear the array before setting new values
  answersState.push(...answers);
};

const setCategoriesParametersState = (choosenNbQuestions, choosenCategory, choosenTimer) => {
  categoriesParametersState.choosenNbQuestions = choosenNbQuestions;
  categoriesParametersState.choosenCategory = choosenCategory;
  categoriesParametersState.choosenTimer = choosenTimer;
};

// Export the reactive state and setter functions
export { 
  categoriesState, questionsState, statsState, timestampState, answersState, categoriesParametersState,
  setCategories, setQuestions, setStats, setTimer, setAnswers, setCategoriesParametersState
};