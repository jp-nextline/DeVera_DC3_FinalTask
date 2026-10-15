<script setup>

import { ref, watch } from 'vue'
import { loadData, saveData, loadObject, saveObject } from '../storage.js'
import PageHeader from '../components/PageHeader.vue'
import DeleteButton from '../components/DeleteButton.vue'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const subjects = ref(loadData('tt_subjects'))
const schedule = ref(loadData('tt_schedule'))

function newSlot() {
  return { day: 'Monday', startTime: '', endTime: '', room: '' }
}

const draft = loadObject('tt_draft_subject', null)

const form = ref({
  code: draft?.form?.code ?? '',
  name: draft?.form?.name ?? '',
  instructor: draft?.form?.instructor ?? '',
  units: draft?.form?.units ?? 3,
})
const slots = ref(
  draft?.slots && draft.slots.length > 0
    ? draft.slots.map((slot) => ({ ...slot }))
    : [newSlot()]
)
const editingId = ref(draft?.editingId ?? null)

watch(
  [form, slots, editingId],
  function () {
    saveObject('tt_draft_subject', {
      form: form.value,
      slots: slots.value,
      editingId: editingId.value,
    })
  },
  { deep: true}
)


function addSlot() {
  slots.value.push(newSlot())
}

function removeSlot(index) {
  slots.value.splice(index, 1)
}

function resetForm() {
  form.value = { code: '', name: '', instructor: '', units: 3 }
  slots.value = [newSlot()]
  editingId.value = null
}

function getSchedulesOf(subjectId) {
  return schedule.value.filter(function (item) {
    return item.subjectId === subjectId
  })
}

function saveSubject() {
  if (form.value.code === '' || form.value.name === '') {
    alert('Please enter a subject code and name.')
    return
  }

  const filledSlots = []
  for (const slot of slots.value) {
    if (slot.startTime === '' && slot.endTime === '') {
      continue
    }
    if (slot.startTime === '' || slot.endTime === '') {
      alert('Please fill in both the start and end time of each schedule.')
      return
    }
    if (slot.endTime <= slot.startTime) {
      alert('End time must be later than the start time.')
      return
    }
    filledSlots.push(slot)
  }

  let subjectId = editingId.value

  if (editingId.value === null) {
    subjectId = Date.now()
    subjects.value.push({
      id: subjectId,
      code: form.value.code,
      name: form.value.name,
      instructor: form.value.instructor,
      units: form.value.units,
    })
  } else {
    const subject = subjects.value.find(function (s) {
      return s.id === editingId.value
    })
    subject.code = form.value.code
    subject.name = form.value.name
    subject.instructor = form.value.instructor
    subject.units = form.value.units
  }

  schedule.value = schedule.value.filter(function (item) {
    return item.subjectId !== subjectId
  })

  for (let i = 0; i < filledSlots.length; i++) {
    schedule.value.push({
      id: Date.now() + i,
      subjectId: subjectId,
      day: filledSlots[i].day,
      startTime: filledSlots[i].startTime,
      endTime: filledSlots[i].endTime,
      room: filledSlots[i].room,
    })
  }

  saveData('tt_subjects', subjects.value)
  saveData('tt_schedule', schedule.value)
  resetForm()
}

function editSubject(subject) {
  editingId.value = subject.id
  form.value = {
    code: subject.code,
    name: subject.name,
    instructor: subject.instructor,
    units: subject.units,
  }

  slots.value = []
  const existing = getSchedulesOf(subject.id)
  for (const item of existing) {
    slots.value.push({
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
      room: item.room,
    })
  }
  if (slots.value.length === 0) {
    slots.value.push(newSlot())
  }

  window.scrollTo(0, 0)
}

function deleteSubject(id) {
  subjects.value = subjects.value.filter(function (s) {
    return s.id !== id
  })
  schedule.value = schedule.value.filter(function (item) {
    return item.subjectId !== id
  })
  saveData('tt_subjects', subjects.value)
  saveData('tt_schedule', schedule.value)
}

</script>

<template>

  <div>

    <PageHeader title="Subjects" subtitle="Add your subjects and their class schedules" />

    <form class="card form" @submit.prevent="saveSubject">

      <h2>{{ editingId === null ? 'Add Subject' : 'Edit Subject' }}</h2>

      <label>Subject Code</label>
      <input v-model="form.code" type="text" placeholder="e.g. IT101" />

      <label>Subject Name</label>
      <input v-model="form.name" type="text" placeholder="e.g. Web Development" />

      <label>Instructor</label>
      <input v-model="form.instructor" type="text" placeholder="e.g. Mr. Cruz" />

      <label>Units</label>
      <input v-model.number="form.units" type="number" min="1" max="6" />

      <h3 class="section-title">Class Schedule</h3>

      <div v-for="(slot, index) in slots" :key="index" class="slot-box">

        <div class="slot-field">
          <label>Day</label>
          <select v-model="slot.day">
            <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
          </select>
        </div>

        <div class="slot-field">
          <label>Start Time</label>
          <input v-model="slot.startTime" type="time" />
        </div>

        <div class="slot-field">
          <label>End Time</label>
          <input v-model="slot.endTime" type="time" />
        </div>

        <div class="slot-field">
          <label>Room</label>
          <input v-model="slot.room" type="text" placeholder="e.g. Room 204" />
        </div>

        <button class="btn btn-danger" type="button" @click="removeSlot(index)">Remove</button>

      </div>

      <button class="btn btn-small" type="button" @click="addSlot">+ Add Another Schedule</button>

      <div class="button-row">

        <button class="btn" type="submit">
          {{ editingId === null ? 'Add Subject' : 'Save Changes' }}
        </button>

        <button v-if="editingId !== null" class="btn btn-gray" type="button" @click="resetForm">
          Cancel
        </button>

      </div>

    </form>

    <section class="card">

      <h2>Subject List</h2>
      <p v-if="subjects.length === 0">No subjects yet. Add one above.</p>

      <table v-else>

        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Instructor</th>
            <th>Units</th>
            <th>Schedule</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="subject in subjects" :key="subject.id">
            <td>{{ subject.code }}</td>
            <td>{{ subject.name }}</td>
            <td>{{ subject.instructor }}</td>
            <td>{{ subject.units }}</td>
            <td>
              <p v-if="getSchedulesOf(subject.id).length === 0" class="schedule-line">
                No schedule
              </p>
              <p
                v-for="item in getSchedulesOf(subject.id)"
                :key="item.id"
                class="schedule-line"
              >
                {{ item.day }} {{ item.startTime }} - {{ item.endTime }}
                <span v-if="item.room !== ''">({{ item.room }})</span>
              </p>
            </td>
            <td>
              <button class="btn btn-small" @click="editSubject(subject)">Edit</button>
              <DeleteButton @confirmed="deleteSubject(subject.id)" />
            </td>
          </tr>
        </tbody>

      </table>

    </section>
    
  </div>
</template>