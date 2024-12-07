<template>
  <div class="quiz results">
    <div class='quiz-col1 home d-flex flex-column'>
      <span>{{ $t('results.score') }}</span>
      <span>User 1</span>
      <span>User 2</span>
      <span>User 3</span>
      <span>User 4</span>
      <span>User 5</span>
    </div>  
    <div class="quiz-col2 d-flex flex-column justify-content-between">  
      <div class='d-flex flex-row justify-content-between'>
        <h1>{{ $t('results.title') }}</h1>   
        <div class='d-flex flex-column justify-content-center'>
          <span>{{ correctAnswersCount }} / {{ questions.length }}</span>          
        </div>     
      </div>

      <div style="overflow-y: auto;">
        <div v-for="(question, questionIndex) in questions" :key="questionIndex" class="pb-2">  
          <div>{{ question.questionText }}</div>
          <div>{{ question.explanation }}</div>        
          <div class="d-flex flex-row justify-content-between">          
            <div v-for="(option, optionIndex) in question.options" :key="optionIndex"
              :style="{ color: getOptionColor(option, question.correctAnswer, questionIndex) }"
            >          
              {{ option }}
            </div>
          </div>             
          <i :class="[ 'fa-solid', question.correctAnswer === answers[questionIndex] ? 'fa-check' : 
          answers[questionIndex] !== null ? 'fa-xmark' : 'fa-minus' ]"></i>
        </div>      
      </div> 
      <div class='d-flex flex-row justify-content-end'>      
        <button @click="goToHome"><i class="fa-solid fa-house"></i> {{ $t("results.home") }}</button>
        <button @click="goToCategories"><i class="fa-solid fa-arrow-rotate-right"></i> {{ $t("results.tryAgain") }}</button>                
      </div> 
    </div>
  </div>
</template>

<script>
import { navigationMixin } from '../mixins/navigationMixin';

export default {
  name: "ResultsView",
  mixins: [navigationMixin],
  data() {
    return {   
      questions: [],
      answers: []
    }
  },
  created() {
    this.checkBadValuesForRedirection();
    
    this.questions = this.$questions;
    this.answers = this.$answers;
  },
  methods: {
    checkBadValuesForRedirection() {
      if (this.$questions == undefined || this.$questions == null || !this.$questions || this.$questions.length == 0 || 
      !this.$answers == undefined || this.$answers == null || !this.$answers || this.$answers.length == 0) {
        this.goToHome();
      }
    },
    getOptionColor(option, correctAnswer, questionIndex) {
      const userAnswer = this.answers[questionIndex]; // Get the answer for the current question
      if (option === correctAnswer && option === userAnswer) {
        return "green"; // Correct answer, chosen by user
      } else if (option === userAnswer) {
        return "red"; // Incorrect answer, chosen by user
      } else if (option === correctAnswer) {
        return "green"; // Correct answer, but not chosen by user
      }
      return "black"; // Default color for unselected options
    }
  },
  computed: {
    correctAnswersCount() {
      return this.questions.reduce((count, question, index) => {
        if (this.answers[index] === question.correctAnswer) {
          count++;
        }
        return count;
      }, 0);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.results {
}
</style>
