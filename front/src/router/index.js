/* Vue Router configuration */

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import CategoriesView from '../views/Categories.vue'
import QuizView from '../views/Quiz.vue'
import ResultsView from '../views/Results.vue'

const routes = [
  { 
    path: '/', 
    name: '/home',
    component: HomeView
  },  
  { 
    path: '/categories', 
    name: '/categories',
    component: CategoriesView,
  },
  { 
    path: '/quiz', 
    name: '/quiz',
    component: QuizView
  },
  { 
    path: '/results', 
    name: '/results',
    component: ResultsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router