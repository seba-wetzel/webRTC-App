import { createRouter, createWebHistory } from 'vue-router'
const HomeView = () => import('@/views/HomeView.vue')
const CreateMeetingView = () => import('@/views/CreateMeetingView.vue')
const JoinMeetingView = () => import('@/views/JoinMeetingView.vue')
const MeetingView = () => import('@/views/MeetingView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/crear-reunion',
      name: 'create-meeting',
      component: CreateMeetingView
    },
    {
      path: '/unirse-reunion',
      name: 'join-meeting',
      component: JoinMeetingView
    },
    {
      path: '/reunion',
      name: 'meeting',
      component: MeetingView
    }
  ]
})

export default router
