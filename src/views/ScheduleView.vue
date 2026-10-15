<script setup>

import { ref, computed } from 'vue'
import { loadData, saveData } from '../storage.js'
import PageHeader from '../components/PageHeader.vue'
import DeleteButton from '../components/DeleteButton.vue'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const subjects = loadData('tt_subjects')
const schedule = ref(loadData('tt_schedule'))
const form = ref({ subjectId: '', day: 'Monday', startTime: '', endTime: '', room: '' })
const editingId = ref(null)

function resetForm() {
  form.value = { subjectId: '', day: 'Monday', startTime: '', endTime: '', room: '' }
  editingId.value = null
}

function getSubjectName(id) {
  const subject = subjects.find(function (s) {
    return s.id === id
  })
  if (subject) {
    return subject.code + ' - ' + subject.name
  }
  return 'Unknown subject'
}

const sortedSchedule = computed(function () {
  const copy = [...schedule.value]
  copy.sort(function (a, b) {
    const dayA = days.indexOf(a.day)
    const dayB = days.indexOf(b.day)
    if (dayA !== dayB) {
      return dayA - dayB
    }
    return a.startTime.localeCompare(b.startTime)
  })
  return copy
})

function saveClass() {
  if (form.value.subjectId === '' || form.value.startTime === '' || form.value.endTime === '') {
    alert('Please choose a subject and enter the start and end time.')
    return
  }
  if (form.value.endTime <= form.value.startTime) {
    alert('End time must be later than the start time.')
    return
  }

  if (editingId.value === null) {
    schedule.value.push({
      id: Date.now(),
      subjectId: form.value.subjectId,
      day: form.value.day,
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      room: form.value.room,
    })
  } else {
    const item = schedule.value.find(function (c) {
      return c.id === editingId.value
    })
    item.subjectId = form.value.subjectId
    item.day = form.value.day
    item.startTime = form.value.startTime
    item.endTime = form.value.endTime
    item.room = form.value.room
  }

  saveData('tt_schedule', schedule.value)
  resetForm()
}

function editClass(item) {
  editingId.value = item.id
  form.value = {
    subjectId: item.subjectId,
    day: item.day,
    startTime: item.startTime,
    endTime: item.endTime,
    room: item.room,
  }
}

function deleteClass(id) {
  schedule.value = schedule.value.filter(function (c) {
    return c.id !== id
  })
  saveData('tt_schedule', schedule.value)
}

</script>

<template>

  <div>

    <PageHeader title="Class Schedule" subtitle="Plan your weekly classes" />

    <p v-if="subjects.length === 0" class="card warning">
      You need to add a subject first.
      <RouterLink to="/subjects">Go to Subjects</RouterLink>
    </p>

    <form v-else class="card form" @submit.prevent="saveClass">

      <h2>{{ editingId === null ? 'Add Class' : 'Edit Class' }}</h2>

      <label>Subject</label>
      <select v-model="form.subjectId">
        <option value="">-- Choose a subject --</option>
        <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
          {{ subject.code }} - {{ subject.name }}
        </option>
      </select>

      <label>Day</label>
      <select v-model="form.day">
        <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
      </select>

      <label>Start Time</label>
      <input v-model="form.startTime" type="time" />

      <label>End Time</label>
      <input v-model="form.endTime" type="time" />

      <label>Room</label>
      <input v-model="form.room" type="text" placeholder="e.g. Room 204" />

      <div class="button-row">
        
        <button class="btn" type="submit">
          {{ editingId === null ? 'Add Class' : 'Save Changes' }}
        </button>

        <button v-if="editingId !== null" class="btn btn-gray" type="button" @click="resetForm">
          Cancel
        </button>

      </div>

    </form>

    <section class="card">

      <h2>Weekly Schedule</h2>
      <p v-if="schedule.length === 0">No classes yet.</p>

      <table v-else>

        <thead>
          <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Subject</th>
            <th>Room</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in sortedSchedule" :key="item.id">
            <td>{{ item.day }}</td>
            <td>{{ item.startTime }} - {{ item.endTime }}</td>
            <td>{{ getSubjectName(item.subjectId) }}</td>
            <td>{{ item.room }}</td>
            <td>
              <button class="btn btn-small" @click="editClass(item)">Edit</button>
              <DeleteButton @confirmed="deleteClass(item.id)" />
            </td>
          </tr>
        </tbody>

      </table>

    </section>

  </div>

</template>