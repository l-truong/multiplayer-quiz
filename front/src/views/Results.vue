<template>
  <div class="quiz results">
    <div class="quiz-col1 home">ResultsView</div>
    <div class="quiz-col2">
        <button @click="goToHome">Click Me</button>        
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

    return { goToHome };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables";

.results {
}
</style>
