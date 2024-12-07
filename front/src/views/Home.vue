<template>
  <div class="quiz home">
    <div class="quiz-col1">
      <h1>{{ $t("home.welcomeMessage") }}</h1>
      <form @submit.prevent="submitForm">
        <label for="name">{{ $t("home.name") }}</label>
        <div>
          <input
            type="text"
            id="name"
            v-model="name"
            :placeholder="$t('home.namePlaceholder')"
            :class="{ 'is-invalid': nameError }"
          />
          <span v-if="nameError" class="error-message">{{
            this.$t("home.requiredField")
          }}</span>
        </div>

        <label for="room">{{ $t("home.room") }}</label>
        <select v-model="room" id="room" name="room">
          <option value="join">{{ $t("home.join") }}</option>
          <option value="create">{{ $t("home.create") }}</option>
        </select>

        <label for="roomId">{{ $t("home.roomId") }}</label>
        <div>
          <input
            type="text"
            id="roomId"
            v-model="roomId"
            :placeholder="$t('home.roomIdPlaceholder')"
            :class="{ 'is-invalid': roomError }"
          />
          <span v-if="roomError" class="error-message">{{
            this.$t("home.requiredField")
          }}</span>
        </div>

        <input type="submit" :value="$t('home.startQuiz')" />
      </form>
    </div>
    <div class="quiz-col2 div-background">      
    </div>
  </div>
</template>

<script>
import { navigationMixin } from '../mixins/navigationMixin';

export default {
  name: "HomeView",
  mixins: [navigationMixin],
  data() {
    return {
      name: "",
      room: "create", //default
      roomId: "",
      nameError: "",
      roomError: "",
    };
  },
  methods: {
    validateName() {
      if (!this.name.trim()) {
        this.nameError = true;
        return false;
      }
      this.nameError = false;
      return true;
    },
    validateRoom() {
      if (!this.roomId.trim()) {
        this.roomError = true;
        return false;
      }
      this.roomError = false;
      return true;
    },
    submitForm() {
      const isNameValid = this.validateName();
      const isRoomValid = this.validateRoom();

      if (isNameValid && isRoomValid) {
        console.log("Form submitted with data:", {
          name: this.name,
          room: this.room,
          roomId: this.roomId,
        });

        if (this.room === "join") {
          this.goToQuiz();
        } else {
          this.goToCategories();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.home {
  input[type="text"], select {
    width: 100%;
    padding: 0.75em 1.25em;
    margin: 0.5em 0;
    display: inline-block;
    border: 0.0625em solid $border-color;
    border-radius: 0.25em;
    box-sizing: border-box;
  }

  input[type="submit"] {
    width: 100%;
    background-color: $primary-color;
    color: white;
    padding: 0.875em 1.25em;
    margin: 0.5em 0;
    border: none;
    border-radius: 0.25em;
    cursor: pointer;
  }

  input[type="submit"]:hover {
    background-color: $primary-color-hover;
  }

  .error-message {
    color: $error-color;
    font-size: 0.875rem;
  }

  .is-invalid {
    border-color: $error-color;
  }

  .div-background {
    background-image: $background-image-url;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>