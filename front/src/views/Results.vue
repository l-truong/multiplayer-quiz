<template>
  <div class="quiz results">
    <div class="quiz-col1 home"></div>
    <div class="quiz-col2">
        <button @click="goToCategories">{{ $t("results.tryAgain") }}</button>     
        <button @click="goToHome">{{ $t("results.home") }}</button>   
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "ResultsView",
  data() {
    const router = useRouter();

    const goToHome = () => {
      router.push("/");
    };
    const goToCategories = () => {
      router.push("/categories");
    };

    return { goToHome, goToCategories };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.results {
}
</style>
