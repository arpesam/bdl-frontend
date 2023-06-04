import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DoctorRegister from '../views/DoctorRegister.vue'
import PatientRegister from '../views/PatientRegister.vue'
import PatientEdit from '../views/PatientEdit.vue'
import ExamsView from '../views/ExamsView.vue'
import Dashboard from '../views/Dashboard.vue'
import Test from '../views/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register/doctor',
      name: 'register-doctor',
      component: DoctorRegister
    },
    {
      path: '/register/patient',
      name: 'patient-register',
      component: PatientRegister,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/')
        }
        next()
      }
    },
    {
      path: '/patient/:id',
      name: 'patient-edit',
      component: PatientEdit,
      props: true,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/')
        }
        next()
      }
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/patient/:id/exams',
      name: 'exams-view',
      component: ExamsView,
      props: true,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/')
        }
        next()
      }
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/')
        }
        next()
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

function beforeEnter(to, from, next) {
  const token = localStorage.getItem('token')
  if (!token) {
    next('/')
  }
  next()
}

export default router
