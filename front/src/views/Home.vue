<template>
  <div class="quiz">
    <div class="quiz-col1">
      <h1>{{ $t('login.welcomeMessage') }}</h1>
      <form @submit.prevent="submitForm">
        <label for="name">{{ $t('login.name') }}</label>
        <div>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            :placeholder="$t('login.namePlaceholder')"
            :class="{'is-invalid': nameError}"
          />
          <span v-if="nameError" class="error-message">{{ this.$t('login.requiredField') }}</span>
        </div>
                
        <label for="room">{{ $t('login.room') }}</label>
        <select v-model="room" id="room" name="room">
          <option value="join">{{ $t('login.join') }}</option>
          <option value="create">{{ $t('login.create') }}</option>
        </select>        

        <label for="roomId">{{ $t('login.roomId') }}</label>
        <div>
          <input 
            type="text" 
            id="roomId" 
            v-model="roomId" 
            :placeholder="$t('login.roomIdPlaceholder')" 
            :class="{'is-invalid': roomError}"
          />
          <span v-if="roomError" class="error-message">{{ this.$t('login.requiredField') }}</span>
        </div>        

        <input 
          type="submit" 
          :value="$t('login.startQuiz')"
        />
      </form>
    </div>
    <div class="quiz-col2">
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
  },
  data() {
    return {
      name: '',
      room: 'join', //default
      roomId: '',
      nameError: '',
      roomError: ''
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
        console.log('Form submitted with data:', {
          name: this.name,
          room: this.room,
          roomId: this.roomId
        });
        this.goToQuiz();
      }      
    }
  }
};
</script>

<style lang="scss" scoped>
  input[type="text"], select {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  input[type="submit"] {
    width: 100%;
    background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  input[type="submit"]:hover {
    background-color: #45a049;
  }

  .error-message {
    color: red;
    font-size: 0.875rem;
  }

  .is-invalid {
    border-color: red;
  }
</style>