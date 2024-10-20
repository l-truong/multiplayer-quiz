<template>
  <!--Main container-->    
  <div class="app">
    <!--Questions container-->
    <section class="progress-container">            
			<span class="progress-question">{{ $t('quiz.question') }} {{ currentQuestion + 1 }}/{{ questions.length }}</span>
      <div class="progress-bar" :style="{ width: progressWidth }"></div>
      Theme <br><br>
      Difficulté <br><br>
      Time<br><br>
    </section>
    <section class="quiz-container" v-if="!quizCompleted">	
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
  <div>
    <button @click="goToHome">{{ $t('return') }}</button>
  </div>
</template>
  
<script>
import { useRouter } from 'vue-router';

export default {
  name: "QuizView",
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
    },
    goToHome() {
      const router = useRouter();
      router.push('/');
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
      let value = 0;
      this.questions.forEach(q => {
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}

body {
  background-color: #271c36;
  color: #FFF;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

p {
  color: #8F8F8F;
  font-size: 1.5rem;
  text-align: center;
}

button {
  appearance: none;
  outline: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  background-color: #2cce7d;
  color: #2d213f;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.2rem;
  border-radius: 0.5rem;

  &:disabled {
    opacity: 0.5;
  }
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  height: 100vh;

  .progress-container {
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    height: 30px;

    .progress-bar {
      height: 100%;
      background-color: #76c7c0;
      transition: width 0.3s ease;
    }
  }

  .quiz-container {
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

      &.progress-question {
        color: #FFF;
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
  }
}
</style>