import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SubjectsView from '../views/SubjectsView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import TasksView from '../views/TasksView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/subjects', name: 'subjects', component: SubjectsView },
  { path: '/schedule', name: 'schedule', component: ScheduleView },
  { path: '/tasks', name: 'tasks', component: TasksView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})

export default router