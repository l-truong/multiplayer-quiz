/* Vue Router configuration */

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import StudentView from '../views/Student.vue'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router