import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DoctorRegister from '../views/DoctorRegister.vue'
import DoctorEdit from '../views/DoctorEdit.vue'
import PatientRegister from '../views/PatientRegister.vue'
import PatientEdit from '../views/PatientEdit.vue'
import ExamsView from '../views/ExamsView.vue'
import Dashboard from '../views/Dashboard.vue'
import TermsAndConditions from '../views/TermsAndConditions.vue'
import Test from '../views/Test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/register/doctor',
      name: 'Cadastro',
      component: DoctorRegister,
    },
    {
      path: '/edit/doctor',
      name: 'Minha conta',
      component: DoctorEdit
    },
    {
      path: '/register/patient',
      name: 'Add paciente',
      component: PatientRegister,
      beforeEnter: (to, from, next) => {
        console.log("'/register/patient'");
        const token = localStorage.getItem('token')
        if (!token) {
          next('/')
        }
        next()
      }
    },
    {
      path: '/patient/:id',
      name: 'Editar paciente',
      component: PatientEdit,
      props: true,
      beforeEnter: (to, from, next) => {
        console.log("/patient/:id");
        const token = localStorage.getItem('token')
        if (!token) {
          next('/')
        }
        next()
      }
    },
    {
      path: '/patient/:id/exams',
      name: 'Dados clínicos',
      component: ExamsView,
      props: true,
      beforeEnter: (to, from, next) => {
        console.log("'/patient/:id/exams'", );
        const token = localStorage.getItem('token')
        if (!token) {
          next('/')
        }
        next()
      }
    },
    {
      path: '/dashboard',
      name: 'Pacientes',
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
      path: '/terms-and-conditions',
      name: 'Termos',
      component: TermsAndConditions,
    },
    {
      path: '/about',
      name: 'Sobre',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/test',
      name: 'Teste',
      component: Test,
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
