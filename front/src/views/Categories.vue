<template>  
  <div class='quiz categories'>
    <div class='quiz-col1 d-flex flex-column'>
      <button>{{ $t('categories.copyLink') }}</button>    
      <span>User 1</span>
      <span>User 2</span>
      <span>User 3</span>
      <span>User 4</span>
      <span>User 5</span>
    </div>
    <div class='quiz-col2 d-flex flex-column justify-content-between'>                
      <div>      
        <div class='d-flex flex-row justify-content-between'>
          <h1>{{ $t('categories.title') }}</h1>
          <div class='d-flex flex-column justify-content-center'>
            <span>{{ sumOccurrencesByCategory }} / {{ sumAllOccurrences }} {{ $t('categories.questionRange') }}</span>          
            <span>{{ convertMinutesToMinSec(timer) }}</span>   
          </div>
        </div>
      
        <div>
          <h2>{{ $t('categories.numberOfQuestions') }}</h2> 
          <div>
            <input
              type='range'
              v-model='choosenNbQuestions'
              id='choosenNbQuestions'
              name='choosenNbQuestions'
              min='10'
              max='40'
              step='5'
            />
            <span>{{ choosenNbQuestions }} {{ $t('categories.questionRange') }}</span>
          </div>
        </div>

        <div>
          <h2>{{ $t('categories.categories') }}</h2> 
          <div>
            <div v-for='category in $categories' :key='category._id'>
            <label>
              <input 
                type='checkbox'
                v-model='choosenCategory' 
                :value='category.categoryId'>
                  {{ category.name }} : {{category.description}}
              </label>
            </div>
          </div>        
        </div>

        <div>
          <h2>{{ $t('categories.timer') }}</h2> 
          <div>
            <input
              type='range'
              v-model='choosenTimer'
              id='choosenTimer'
              name='choosenTimer'
              min='15'
              max='60'
              step='15'
            />
            <span>{{ choosenTimer }} {{ $t('categories.timesValue') }}</span>
          </div>
        </div>
      </div>      

      <div class='d-flex flex-row justify-content-between'>
        <button @click='goToHome'><i class='fa-solid fa-caret-left'></i> {{ $t('categories.return') }}</button>   
        <button v-if='choosenCategory.length > 0 && sumOccurrencesByCategory >= choosenNbQuestions' @click='goToQuizAdmin'>{{ $t('categories.start') }} <i class='fa-solid fa-caret-right'></i></button>  
      </div>     
    </div>
  </div>
</template>

<script>
import { navigationMixin } from '../mixins/navigationMixin';
import { questionsService } from '../services/questionsService';

export default {
  name: 'CategoriesView',  
  mixins: [navigationMixin],
  data() {
    return {   
      router: null,   
      stats: [],
      choosenNbQuestions: null,
      choosenTimer: null,
      categories: [],      
      choosenCategory: []
    };
  },  
  created() {   
    this.checkBadValuesForRedirection();

    this.categories = this.$categories;
    this.stats = this.$stats;
    this.choosenNbQuestions = this.$categoriesParametersState.choosenNbQuestions;
    this.choosenCategory = this.$categoriesParametersState.choosenCategory;
    this.choosenTimer = this.$categoriesParametersState.choosenTimer;
  },
  methods: {
    checkBadValuesForRedirection() {
      if (this.$categories == undefined || this.$categories == null || !this.$categories || this.$categories.length == 0 || 
      !this.$stats == undefined || this.$stats == null || !this.$stats || this.$stats.length == 0 ||
      !this.$categoriesParametersState) {
        this.goToHome();
      }
    },
    async goToQuizAdmin() {
      await this.getQuestions();  
      this.$setTimer(this.choosenTimer);
      this.$setCategoriesParametersState(this.choosenNbQuestions, this.choosenCategory, this.choosenTimer);
      this.goToQuiz();    
    },
    async getQuestions() {
      if(this.choosenCategory.length > 0) {
        try {   
          let randomQuestions = await questionsService.getRandomQuestions(this.choosenNbQuestions, this.choosenCategory); 
          this.$setQuestions(randomQuestions);
          return randomQuestions;                  
        } catch (error) {
          console.error('There was an error loading categories.');
          return [];
        }
      }  
      return [];    
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
    sumOccurrencesByCategory() {
      return this.$stats.reduce((sum, stat) => {
          if (this.choosenCategory.includes(stat.categoryId)) {
            return sum + stat.occurence;
          }
          return sum;
      }, 0);
    },
    sumAllOccurrences() {
      return this.$stats.reduce((sum, stat) => sum + stat.occurence, 0);
    },
    timer() {
      return this.choosenNbQuestions * this.choosenTimer / 60;
    }
  },
  watch: {
    '$i18n.locale'(newVal, oldValue) {
      if (newVal !== oldValue) {
        this.choosenCategory = []
      }      
    }
  }
};
</script>

<style lang='scss' scoped>
@import '@/assets/styles/variables';

.categories {
 
}
</style>