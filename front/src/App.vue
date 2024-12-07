<template>  
  <div class='container'>
    <router-view/>  
    <div v-if='!isUnwantedRoutes' class='languageSelector'>
      <select v-model='$i18n.locale' @change='updateDataByLanguage'>
        <option value='eng'>English</option>
        <option value='fr'>Français</option>
      </select>
    </div>
  </div>
</template>

<script>
import { categoriesService } from '../src/services/categoriesService';
import { questionsService } from '../src/services/questionsService';

export default {
  name: 'App',
  components: { },
  data() {
    return {
      unwantedRoutes: ['/quiz'],
      isUnwantedRoutes: false
    };
  },
  created() {},
  mounted() {
    this.updateDataByLanguage();       
  },
  methods: {
    updateDataByLanguage() {
      this.updatedCategoriesByLanguage();
      this.updatedStatsByLanguage();
    },
    async updatedCategoriesByLanguage() {
      this.categories = await categoriesService.getCategories(this.$i18n.locale); 
      this.$setCategories(this.categories);
    },
    async updatedStatsByLanguage() {
      this.stats = await questionsService.getStatsQuestions(this.$i18n.locale); 
      this.$setStats(this.stats);
    }
  },
  watch: {
    '$route'(to) {
      this.isUnwantedRoutes = this.unwantedRoutes.includes(to.path);
    }
  },
}
</script>