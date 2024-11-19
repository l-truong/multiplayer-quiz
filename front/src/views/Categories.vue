<template>  
  <div class="quiz categories">
    <div class="quiz-col1 home">
      <button>{{ $t("categories.copyLink") }}</button>     
      <span>User 1</span> 
      <span>User 2</span> 
      <span>User 3</span> 
      <span>User 4</span> 
      <span>User 5</span> 
    </div>
    <div class="quiz-col2">  
      <div>
        <span>853/4195 questions</span>
        <br>
        <span>{{ convertMinutesToMinSec(timer) }}</span>   
      </div>   

      <h1>Création de partie</h1>
      
      <div>
        <span>Nombre de questions</span> 
        <select v-model="questionsNb" id="questionsNb" name="questionsNb">
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="30">30</option>
          <option value="35">35</option>
          <option value="40">45</option>
        </select>
      </div>

      <div v-if="categories">
        <span>Thèmes</span> 
        <div v-for="(category, index) in categories" :key="index">
        <label>
          <input 
            type="checkbox"
            v-model="choosenCategory" 
            :value="category.name">
              {{ category.name }}
          </label>
        </div>
      </div>

      <div>
        <span>Timestamp</span> 
        <select v-model="timestamp" id="timestamp" name="timestamp">
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
          <option value="60">60</option>
        </select>
      </div>

      <button @click="goToHome">{{ $t("categories.return") }}</button>   
      <button @click="goToQuiz">{{ $t("categories.start") }}</button>       
    </div>
  </div>
</template>

<script>
import { categoriesService } from '../services/categoriesService';
import { questionsService } from '../services/questionsService';
import { useRouter } from "vue-router";

export default {
  name: "CategoriesView",
  setup() {
    const router = useRouter();

    const goToHome = () => {
      router.push("/");
    };
    const goToQuiz = () => {
      router.push("/quiz");
    };

    return { goToHome, goToQuiz };
  },
  data() {
    return {
      questionsNb: 20, //default
      timestamp: 30, //default
      categories: null,
      choosenCategory: []
    };
  },  
  async created() {
    this.categories = await categoriesService.getCategories();
    let eng = await categoriesService.getCategories('eng');
    let fr = await categoriesService.getCategories('fr');
    let id = await categoriesService.getCategoryById('672d0698004c7514fcd799c8');
    console.log(this.categories)
    console.log(eng)
    console.log(fr)
    console.log(id)
    

    //this.loadCategories();
  },
  methods: {
    async loadCategories() {
      try {
        this.categories = await categoriesService.getCategories();

        let questions = await questionsService.getQuestions();
        let random = await questionsService.getRandomQuestions(20);      
        console.log(questions)
        console.log(random)
      } catch (error) {
        this.error = 'There was an error loading categories.';
        console.error(error);
      }
    },
    convertMinutesToMinSec(timer) {
      const min = Math.floor(timer);
      const sec = Math.round((timer - min) * 60);
      if (sec === 0) {
        return `${min} m`;
      } else {
        return `${min} m ${sec} s`;
      }
    }
  },
  computed: {
    timer() {
      return this.questionsNb * this.timestamp / 60;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.categories {
 
}
</style>