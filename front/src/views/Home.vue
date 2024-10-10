<template>
  <div id="home">
    <h1>This is Home View</h1>  
  </div>    
  <div>
      <h1>{{ $t('welcomeMessage') }}</h1>
      <button>{{ $t('startQuiz') }}</button>
    </div>
  <div>
    <select v-model="$i18n.locale">
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style lang="scss">
#home {
  h1 {
    color: pink;
    font-size: 2rem;

    &:hover {
      color: palevioletred;
    }
  }
}
</style>