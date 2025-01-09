<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">Student Attendance Administrator</h1>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Dashboard Overview -->
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-100 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-blue-800">Present Today</h3>
              <p class="text-3xl font-bold text-blue-600">{{ presentCount }}</p>
            </div>
            <div class="bg-red-100 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-red-800">Absent Today</h3>
              <p class="text-3xl font-bold text-red-600">{{ absentCount }}</p>
            </div>
            <div class="bg-green-100 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-green-800">Overall Attendance</h3>
              <p class="text-3xl font-bold text-green-600">{{ overallAttendancePercentage }}%</p>
            </div>
          </div>
        </div>

        <!-- Attendance Management -->
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Attendance Management</h2>
          <div class="mb-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name, ID, or class"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
              @input="searchStudents"
            />
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="student in filteredStudents" :key="student.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ student.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ student.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ student.class }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="student.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ student.present ? 'Present' : 'Absent' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="toggleAttendance(student)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Reporting -->
        <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Reporting</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Generate Report</h3>
              <button
                @click="generateReport"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Generate Report
              </button>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Class Summary</h3>
              <ul class="list-disc pl-5">
                <li v-for="(percentage, className) in classAttendancePercentages" :key="className">
                  {{ className }}: {{ percentage }}%
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Mock data for students
const students = ref([
  { id: '001', name: 'Alice Johnson', class: 'Class A', present: true },
  { id: '002', name: 'Bob Smith', class: 'Class B', present: false },
  { id: '003', name: 'Charlie Brown', class: 'Class A', present: true },
  { id: '004', name: 'Diana Prince', class: 'Class C', present: true },
  { id: '005', name: 'Ethan Hunt', class: 'Class B', present: false },
])

const searchQuery = ref('')

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value
  const query = searchQuery.value.toLowerCase()
  return students.value.filter(student => 
    student.name.toLowerCase().includes(query) ||
    student.id.toLowerCase().includes(query) ||
    student.class.toLowerCase().includes(query)
  )
})

const presentCount = computed(() => students.value.filter(s => s.present).length)
const absentCount = computed(() => students.value.filter(s => !s.present).length)
const overallAttendancePercentage = computed(() => 
  ((presentCount.value / students.value.length) * 100).toFixed(2)
)

const classAttendancePercentages = computed(() => {
  const classSummary = {}
  students.value.forEach(student => {
    if (!classSummary[student.class]) {
      classSummary[student.class] = { total: 0, present: 0 }
    }
    classSummary[student.class].total++
    if (student.present) classSummary[student.class].present++
  })

  const percentages = {}
  for (const [className, data] of Object.entries(classSummary)) {
    percentages[className] = ((data.present / data.total) * 100).toFixed(2)
  }
  return percentages
})

const toggleAttendance = (student) => {
  student.present = !student.present
}

const searchStudents = () => {
  // This function is called on input, but filtering is handled by the computed property
}

const generateReport = () => {
  // In a real application, this would generate a report based on the current data
  console.log('Generating report...')
  alert('Report generated! (This is a mock action)')
}

onMounted(() => {
  // In a real application, you might fetch initial data here
  console.log('Component mounted')
})
</script>