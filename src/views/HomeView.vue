<script setup>

import { loadData } from '../storage.js'
import PageHeader from '../components/PageHeader.vue'
import StatCard from '../components/StatCard.vue'

const subjects = loadData('tt_subjects')
const schedule = loadData('tt_schedule')
const tasks = loadData('tt_tasks')

const pendingTasks = tasks.filter(function (task) {
  return task.done === false
})

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const today = dayNames[new Date().getDay()]

const todaysClasses = schedule.filter(function (item) {
  return item.day === today
})

function getSubjectName(id) {
  const subject = subjects.find(function (s) {
    return s.id === id
  })
  if (subject) {
    return subject.code + ' - ' + subject.name
  }
  return 'Unknown subject'
}

</script>

<template>

  <div>

    <PageHeader title="Welcome to TimeTracker" subtitle="Your Student Scheduling Information System" />

    <div class="stats">

      <StatCard label="Subjects" :value="subjects.length" />
      <StatCard label="Classes per week" :value="schedule.length" />
      <StatCard label="Pending tasks" :value="pendingTasks.length" />

    </div>

    <section class="card">

      <h2>Today's Classes ({{ today }})</h2>
      <p v-if="todaysClasses.length === 0">No classes scheduled for today.</p>

      <ul v-else>
        <li v-for="item in todaysClasses" :key="item.id">
          {{ item.startTime }} - {{ item.endTime }} |
          {{ getSubjectName(item.subjectId) }} | Room: {{ item.room }}
        </li>
      </ul>
    </section>

    <section class="card">

      <h2>Get Started</h2>

      <div class="button-row">
        <RouterLink class="btn" to="/subjects">Manage Subjects</RouterLink>
        <RouterLink class="btn" to="/schedule">Manage Schedule</RouterLink>
        <RouterLink class="btn" to="/tasks">Manage Tasks</RouterLink>
      </div>

    </section>

  </div>

</template>