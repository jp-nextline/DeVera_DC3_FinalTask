<script setup>

import { loadData } from '../storage.js'
import PageHeader from '../components/PageHeader.vue'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const colors = [
  'gold',
  'lightsalmon',
  'khaki',
  'burlywood',
  'peachpuff',
  'sandybrown',
  'palegoldenrod',
  'wheat',
]

const subjects = loadData('tt_subjects')
const schedule = loadData('tt_schedule')

function getSubject(id) {
  return subjects.find(function (s) {
    return s.id === id
  })
}

function getColor(id) {
  const index = subjects.findIndex(function (s) {
    return s.id === id
  })
  if (index === -1) {
    return 'lightgray'
  }
  return colors[index % colors.length]
}

function getClassesForDay(day) {
  const list = schedule.filter(function (item) {
    return item.day === day
  })
  list.sort(function (a, b) {
    return a.startTime.localeCompare(b.startTime)
  })
  return list
}

</script>

<template>

  <div>

    <PageHeader title="Class Schedule" subtitle="Your weekly timetable" />

    <p v-if="schedule.length === 0" class="card warning">
      No classes yet. Add a subject with a class schedule in
      <RouterLink to="/subjects">Subjects</RouterLink>.
    </p>

    <div v-else class="timetable-wrapper">

      <div class="timetable">

        <div v-for="day in days" :key="day" class="day-column">

          <h3 class="day-title">{{ day }}</h3>
          <p v-if="getClassesForDay(day).length === 0" class="empty-day">No classes</p>

          <div v-for="item in getClassesForDay(day)" :key="item.id" class="class-block" :style="{ backgroundColor: getColor(item.subjectId) }">
            <strong>{{ getSubject(item.subjectId).code }}</strong>

            <p>{{ getSubject(item.subjectId).name }}</p>
            <p>{{ item.startTime }} - {{ item.endTime }}</p>
            <p v-if="item.room !== ''">{{ item.room }}</p>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>