<template>
  <div class="quiz">
    <div class="quiz-col1"> 
      <div class="progress-question">
        <span>{{ $t('quiz.question') }}</span><span>{{ currentQuestion + 1 }}/{{ questions.length }}</span>
      </div>          
      <div class="progress-quiz">            
        <div class="progress-bar" :style="{ width: progressWidth }"></div>
      </div>
      <div>
        <span>Theme</span><span>{{ getCurrentQuestion.theme }}</span>
      </div>
      <div>
        Time
      </div>
      <div>
        <button @click="goToHome">{{ $t('return') }}</button>
      </div>
    </div>
    <div class="quiz-col2">
      <section class="quiz-quiz" v-if="!quizCompleted">	
        <div class="quiz-info">
          <span class="question">{{ getCurrentQuestion.question }}</span>
        </div>	
        <div class="options">
          <label 
            v-for="(option, index) in getCurrentQuestion.options" 
            :key="'option' + index" 
            :class="`option ${
              getCurrentQuestion.selected == index 
                ? index == getCurrentQuestion.answer 
                  ? 'correct' 
                  : 'wrong'
                : ''
            } ${
              getCurrentQuestion.selected != null &&
              index != getCurrentQuestion.selected
                ? 'disabled'
                : ''
            }`">
            <input 
              type="radio" 
              :id="'option' + index" 
              :name="getCurrentQuestion.index" 
              :value="index" 
              v-model="getCurrentQuestion.selected" 
              :disabled="getCurrentQuestion.selected"
              @change="setAnswer" 
            />
            <span>{{ option }}</span>
          </label>
        </div>			
      </section>
      <section v-else>
        <h2>You have finished the quiz!</h2>
        <p>Your score is {{ score }}/{{ questions.length }}</p>
      </section>
    </div>  
  </div>  
</template>
  
<script>
import { useRouter } from 'vue-router';

export default {
  name: "QuizView",
  setup() {
    const router = useRouter();
    const goToHome = () => {
      router.push('/');
    };
    return { goToHome };
  },
  data() {
    return {
      progress: 0,
      quizCompleted: false,
      currentQuestion: 0,
      questions: [
        {
          question: 'What is Vue?',
          answer: 0,
          options: [
            'A framework',
            'A library',
            'A type of hat'
          ],
          theme: "theme A",
          selected: null
        },
        {
          question: 'What is Vuex used for?',
          answer: 2,
          options: [
            'Eating a delicious snack',
            'Viewing things',
            'State management'
          ],          
          theme: "theme B",
          selected: null
        },
        {
          question: 'What is Vue Router?',
          answer: 1,
          options: [
            'An ice cream maker',
            'A routing library for Vue',
            'Burger sauce'
          ],
          theme: "theme C",
          selected: null
        }
      ]
    };
  },
  methods: {
    setAnswer(e) {
      this.questions[this.currentQuestion].selected = e.target.value;
      e.target.value = null;

      if (this.currentQuestion < this.questions.length - 1) {
        this.currentQuestion++;
        return;
      }
      this.quizCompleted = true;
    }
  },  
  computed: {
    progressWidth() {
      if (this.quizCompleted === true) {
        return `100%`;
      }
      return `${ this.currentQuestion /  this.questions.length * 100 }%`;
    },
    score() {
      console.log("score")

      let value = 0;
      this.questions.forEach(q => {
        console.log("q.selected", q.selected)
        
        if (q.selected != null && q.answer === q.selected) {
          value++;
        }
      });
      return value;
    },
    getCurrentQuestion() {
      let question = this.questions[this.currentQuestion];
      question.index = this.currentQuestion;
      return question;
    }
  }
};
</script>


<style lang="scss">

.quiz {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  height: 100vh;

  &-col1 {
    .progress-question {

    }
    .progress-quiz {      
      height: 0.4em;
      width: 100%;
      border-radius: 0.5em;
      background: #ffffff;

      .progress-bar {
        height: 100%;        
        border-radius: 0.5em;
        background-color: #76c7c0;
        transition: width 0.3s ease;
      }
    }
  }


  &-col2 {
    /*.quiz-quiz {
      background-color: #382a4b;
      padding: 1rem;
      width: 100%;
      max-width: 640px;

      .quiz-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;

        .question {
          color: #8F8F8F;
          font-size: 1.25rem;
        }
      }

      .options {
        margin-bottom: 1rem;

        .option {
          padding: 1rem;
          display: block;
          background-color: #271c36;
          margin-bottom: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          color: #FFFFFF;

          &:hover {
            background-color: #2d213f;
          }

          &.correct {
            background-color: #2cce7d;
          }

          &.wrong {
            background-color: #ff5a5f;
          }

          &:last-of-type {
            margin-bottom: 0;
          }

          &.disabled {
            opacity: 0.5;
          }

          input {
            display: none;
          }
        }
      }
    }*/
  }
}
</style>