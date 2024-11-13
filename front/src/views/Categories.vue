<template>  
  <div class="quiz categories">
    <div class="quiz-col1 home">
        CategoriesView
    </div>
    <div class="quiz-col2">  
        <button @click="goToHome">Click Me</button>       
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "CategoriesView",
  setup() {
    const router = useRouter();

    const goToHome = () => {
      router.push("/");
    };

    return { goToHome };
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.categories {
 
}
</style>