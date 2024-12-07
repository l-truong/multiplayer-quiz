<template>
  <div class="quiz game" v-if="questions.length > 0">
    <div class='quiz-col1'>
      <div>{{ $t('game.title') }} {{ index + 1 }} / {{ questions.length }}</div>
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: ( ( (index) / questions.length ) * 100 ) + '%' }"></div>
      </div>
      <div>{{ getNameByCategoryId(questions[index].categoryId) }}</div>      
      <div>{{ timeLeft }}</div>
    </div>    
    <div class="quiz-col2 d-flex flex-column justify-content-between">
      <div>
        <div>{{ currentQuestion.questionText }}</div>   
        <div class="d-flex flex-row justify-content-between">
          <div v-for="(option, optionIndex) in randomizedOptions" :key="optionIndex">
            <button 
              :id="`option-${optionIndex}`" 
              :value="option"
              @click="goNextQuestion(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>   
      </div>  
      <div></div>     
    </div>
  </div>
</template>
  
<script>
import { navigationMixin } from '../mixins/navigationMixin';

export default {
  name: "QuizView",
  mixins: [navigationMixin],
  data() {
    return {   
      timestamp: 0,
      timeLeft: 0,
      timer: null,   // Timer reference
      questions: [],
      stats: [],
      index: 0  ,
      selectedAnswersList: []
    };
  },
  created() {
    this.checkBadValuesForRedirection();

    this.questions = this.$questions;
    this.stats = this.$stats;    
    this.timestamp = this.$timestamp;
    this.timeLeft = this.timestamp.value;    
  },
  mounted() {    
    this.startTimer();
  },
  beforeUnmount() {
    clearInterval(this.timer);  // Clear the timer when the component is destroyed
  },
  methods: {
    checkBadValuesForRedirection() {
      if (this.$questions == undefined || this.$questions == null || !this.$questions || this.$questions.length == 0 || 
      !this.$stats == undefined || this.$stats == null || !this.$stats || this.$stats.length == 0 ||
      !this.$timestamp) {
        this.goToHome();
      }
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 1) {
          this.timeLeft--;  // Decrease timeLeft by 1 every second
        } else {
          this.goNextQuestion(null);  // Automatically move to the next question when time runs out
        }
      }, 1000);
    },
    getNameByCategoryId(categoryId) {
      const item = this.stats.find(entry => entry.categoryId === categoryId);
      return item ? item.name : "Categorie inconnue";
    },
    goNextQuestion(option) {   
      this.timeLeft = this.timestamp.value;       
      this.selectedAnswersList.push(option);
      
      if (this.index == this.questions.length - 1) {               
        clearInterval(this.timer);
        this.$setAnswers(this.selectedAnswersList);
        this.goToResults();
      } else {
        this.index++;        
      }
    },
    shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
  },  
  computed: {  
    currentQuestion() {      
      return this.questions[this.index];
    },    
    randomizedOptions() {
      return this.shuffleArray([...this.currentQuestion.options]);
    }  
  }
};
</script>



<style lang="scss" scoped>
@import '@/assets/styles/variables';

.game {
  .quiz-col1 {
    .progress-container {
      width: 100%;
      background-color: #f3f3f3;
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

      .progress-bar {
        height: 100%;
        background-color: #4caf50; /* Green */
        transition: width 0.3s ease;
      }
    }
  }
}
</style>

<style lang="scss">
</style>