<template>
  <div>
    <h1>{{ $t('welcomeMessage') }}</h1>
    <div>
      <button @click="goToQuiz">{{ $t('startQuiz') }}</button>
    </div>
  </div>  
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: "HomeView",
  setup() {
    const router = useRouter();

    const goToQuiz = () => {
      router.push('/quiz');
    };

    return { goToQuiz };
  }
};
</script>

<style lang="scss" scoped>
</style>