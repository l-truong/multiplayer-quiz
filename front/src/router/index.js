/* Vue Router configuration */

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import StudentView from '../views/Student.vue'
import QuizView from '../views/Quiz.vue'

const routes = [
  { 
    path: '/', 
    name: '/home',
    component: HomeView
  },
  { 
    path: '/student', 
    name: '/student',
    component: StudentView
  },
  { 
    path: '/quiz', 
    name: '/quiz',
    component: QuizView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router