<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- Header Section -->
    <div class="w-full bg-white min-h-16 shadow-lg">
      <h2 class="text-3xl px-6 py-4 text-center font-semibold text-gray-700">Attendance Reports</h2>
    </div>

    <!-- Main Content Section -->
    <div class="p-6 grid lg:grid-cols-2 gap-8 mt-6">

      <!-- Generate Attendance Reports Section -->
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-300">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Generate Attendance Reports</h3>
        <p class="text-gray-600 mb-4">Create custom attendance reports based on your criteria.</p>
        <div class="mt-4">
          <select v-model="selectedReportCriteria" class="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option disabled value="">Select Report Criteria</option>
            <option>Daily Attendance</option>
            <option>Weekly Attendance</option>
            <option>Monthly Attendance</option>
          </select>
          <button 
            @click="generateReport"
            class="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all w-full mt-4">
            Generate Report
          </button>
        </div>
      </div>

      <!-- Export Attendance Data Section -->
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-300">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Export Attendance Data</h3>
        <p class="text-gray-600 mb-4">Export attendance reports to Excel, PDF, or other formats.</p>
        <div class="mt-4">
          <select v-model="exportFormat" class="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option disabled value="">Select Export Format</option>
            <option>Excel</option>
            <option>PDF</option>
            <option>CSV</option>
          </select>
          <button 
            @click="exportData"
            class="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-all w-full mt-4">
            Export Data
          </button>
        </div>
      </div>

      <!-- Attendance Summary Section -->
      <div class="bg-white shadow-lg rounded-lg p-6 col-span-2 hover:shadow-xl transition-all duration-300">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Attendance Summary</h3>
        <p class="text-gray-600 mb-4">Overview of the total attendance for each class or period.</p>
        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full table-auto">
            <thead>
              <tr class="bg-[#f5365c] text-white">
                <th class="px-4 py-2 text-left">Class Name</th>
                <th class="px-4 py-2 text-left">Teacher</th>
                <th class="px-4 py-2 text-left">Total Students</th>
                <th class="px-4 py-2 text-left">Attendance Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(classItem, index) in classes" :key="index" class="hover:bg-gray-100 transition-all duration-200">
                <td class="border px-4 py-2">{{ classItem.name }}</td>
                <td class="border px-4 py-2">{{ classItem.teacher }}</td>
                <td class="border px-4 py-2">{{ classItem.students }}</td>
                <td class="border px-4 py-2">{{ getAttendancePercentage(classItem.id) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Class {
  id: number
  name: string
  teacher: string
  students: number
}

interface Attendance {
  classId: number
  attendancePercentage: number
}

// Defining reactive states
const classes = ref<Class[]>([
  { id: 1, name: 'Math 101', teacher: 'Mr. Smith', students: 30 },
  { id: 2, name: 'English Literature', teacher: 'Ms. Johnson', students: 25 },
])

const selectedReportCriteria = ref<string>('')
const exportFormat = ref<string>('')

// Example attendance data
const attendanceData = ref<Attendance[]>([
  { classId: 1, attendancePercentage: 80 },
  { classId: 2, attendancePercentage: 90 },
])

// Function to generate attendance report based on selected criteria
const generateReport = () => {
  if (selectedReportCriteria.value) {
    alert(`Generating ${selectedReportCriteria.value} report...`)
  } else {
    alert('Please select a report criteria.')
  }
}

// Function to export attendance data
const exportData = () => {
  if (exportFormat.value) {
    alert(`Exporting data to ${exportFormat.value}...`)
  } else {
    alert('Please select an export format.')
  }
}

// Function to get attendance percentage for each class
const getAttendancePercentage = (classId: number) => {
  const attendance = attendanceData.value.find((item: Attendance) => item.classId === classId)
  return attendance ? attendance.attendancePercentage : 'N/A'
}
</script>

<style scoped>
/* Adding a smooth transition effect for hover and focus */
input:focus, select:focus {
  border-color: #4c51bf;
  outline: none;
}

button:focus {
  outline: none;
}

button:hover {
  transform: scale(1.05);
}

table th {
  background-color: #f5365c;
}

table tbody tr:hover {
  background-color: #f7fafc;
}
</style>
