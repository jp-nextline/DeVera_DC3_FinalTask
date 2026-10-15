<script setup>

import { ref, computed, watch } from 'vue'
import { loadData, saveData, loadObject, saveObject } from '../storage.js'
import PageHeader from '../components/PageHeader.vue'
import DeleteButton from '../components/DeleteButton.vue'

const subjects = loadData('tt_subjects')
const tasks = ref(loadData('tt_tasks'))

const draft = loadObject('tt_draft_task', null)

const form = ref({
  title: draft?.form?.title ?? '',
  subjectId: draft?.form?.subjectId ?? '',
  dueDate: draft?.form?.dueDate ?? '',
})
const editingId = ref(draft?.editingId ?? null)

watch(
  [form, editingId],
  function () {
    saveObject('tt_draft_task', {
      form: form.value,
      editingId: editingId.value,
    })
  },
  { deep: true }
)

const filter = ref('all')

function resetForm() {
  form.value = { title: '', subjectId: '', dueDate: '' }
  editingId.value = null
}

function getSubjectName(id) {
  const subject = subjects.find(function (s) {
    return s.id === id
  })
  if (subject) {
    return subject.code
  }
  return '-'
}

const filteredTasks = computed(function () {
  if (filter.value === 'pending') {
    return tasks.value.filter(function (t) {
      return t.done === false
    })
  }
  if (filter.value === 'done') {
    return tasks.value.filter(function (t) {
      return t.done === true
    })
  }
  return tasks.value
})

function saveTask() {
  if (form.value.title === '' || form.value.dueDate === '') {
    alert('Please enter a task title and a due date.')
    return
  }

  if (editingId.value === null) {
    tasks.value.push({
      id: Date.now(),
      title: form.value.title,
      subjectId: form.value.subjectId,
      dueDate: form.value.dueDate,
      done: false,
    })
  } else {
    const task = tasks.value.find(function (t) {
      return t.id === editingId.value
    })
    task.title = form.value.title
    task.subjectId = form.value.subjectId
    task.dueDate = form.value.dueDate
  }

  saveData('tt_tasks', tasks.value)
  resetForm()
}

function editTask(task) {
  editingId.value = task.id
  form.value = {
    title: task.title,
    subjectId: task.subjectId,
    dueDate: task.dueDate,
  }
}

function toggleDone(task) {
  task.done = !task.done
  saveData('tt_tasks', tasks.value)
}

function deleteTask(id) {
  tasks.value = tasks.value.filter(function (t) {
    return t.id !== id
  })
  saveData('tt_tasks', tasks.value)
}

</script>

<template>

  <div>

    <PageHeader title="Tasks" subtitle="Keep track of your deadlines" />

    <form class="card form" @submit.prevent="saveTask">

      <h2>{{ editingId === null ? 'Add Task' : 'Edit Task' }}</h2>

      <label>Task Title</label>
      <input v-model="form.title" type="text" placeholder="e.g. Finish Vue project" />

      <label>Subject (optional)</label>
      <select v-model="form.subjectId">
        <option value="">-- None --</option>
        <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
          {{ subject.code }} - {{ subject.name }}
        </option>
      </select>

      <label>Due Date</label>
      <input v-model="form.dueDate" type="date" />

      <div class="button-row">

        <button class="btn" type="submit">
          {{ editingId === null ? 'Add Task' : 'Save Changes' }}
        </button>

        <button v-if="editingId !== null" class="btn btn-gray" type="button" @click="resetForm">
          Cancel
        </button>

      </div>

    </form>

    <section class="card">

      <h2>Task List</h2>

      <div class="button-row">
        <button class="btn btn-small" @click="filter = 'all'">All</button>
        <button class="btn btn-small" @click="filter = 'pending'">Pending</button>
        <button class="btn btn-small" @click="filter = 'done'">Done</button>
      </div>

      <p v-if="filteredTasks.length === 0">No tasks to show.</p>

      <table v-else>

        <thead>
          <tr>
            <th>Done</th>
            <th>Title</th>
            <th>Subject</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id" :class="{ 'task-done': task.done }">
            <td>
              <input type="checkbox" :checked="task.done" @change="toggleDone(task)" />
            </td>
            <td>{{ task.title }}</td>
            <td>{{ getSubjectName(task.subjectId) }}</td>
            <td>{{ task.dueDate }}</td>
            <td>
              <button class="btn btn-small" @click="editTask(task)">Edit</button>
              <DeleteButton @confirmed="deleteTask(task.id)" />
            </td>
          </tr>
        </tbody>

      </table>

    </section>

  </div>
  
</template>