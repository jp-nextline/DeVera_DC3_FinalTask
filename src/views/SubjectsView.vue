<script setup>

import { ref } from 'vue'
import { loadData, saveData } from '../storage.js'
import PageHeader from '../components/PageHeader.vue'
import DeleteButton from '../components/DeleteButton.vue'

const subjects = ref(loadData('tt_subjects'))
const form = ref({ code: '', name: '', instructor: '', units: 3 })
const editingId = ref(null)

function resetForm() {
  form.value = { code: '', name: '', instructor: '', units: 3 }
  editingId.value = null
}

function saveSubject() {
  if (form.value.code === '' || form.value.name === '') {
    alert('Please enter a subject code and name.')
    return
  }

  if (editingId.value === null) {
    subjects.value.push({
      id: Date.now(),
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

  saveData('tt_subjects', subjects.value)
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
}

function deleteSubject(id) {
  subjects.value = subjects.value.filter(function (s) {
    return s.id !== id
  })
  saveData('tt_subjects', subjects.value)
}

</script>

<template>

  <div>

    <PageHeader title="Subjects" subtitle="Add and manage your subjects" />

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
              <button class="btn btn-small" @click="editSubject(subject)">Edit</button>
              <DeleteButton @confirmed="deleteSubject(subject.id)" />
            </td>
          </tr>
        </tbody>

      </table>

    </section>

  </div>
  
</template>