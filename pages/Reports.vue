<template>
<div class="min-h-screen">
    <div class="w-full bg-white h-16 shadow-lg mb-6">
        <h2 class="text-xl sm:text-2xl px-4 py-4">Report</h2>
    </div>
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
                    <input v-model="searchQuery" type="text" placeholder="Search by name, ID, or class" class="w-full px-3 py-2 border border-gray-300 rounded-md" @input="searchStudents" />
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
                                    <span :class="student.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        {{ student.present ? 'Present' : 'Absent' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button @click="toggleAttendance(student)" class="text-indigo-600 hover:text-indigo-900">
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
                        <button @click="generateReport" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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

<script lang="ts" setup>
/**
 * Interface representing a Student object.
 * @interface
 */
interface Student {
    id: string; // Unique identifier for the student
    name: string; // Full name of the student
    class: string; // Class the student belongs to
    present: boolean; // Boolean flag indicating whether the student is present or not
}

// Students array, initialized with a few students. The array is a reference and holds all student data.
const students = ref<Student[]>([
    {
        id: '001',
        name: 'Alice Johnson',
        class: 'Class A',
        present: true
    },
    {
        id: '002',
        name: 'Bob Smith',
        class: 'Class B',
        present: false
    },
    {
        id: '003',
        name: 'Charlie Brown',
        class: 'Class A',
        present: true
    },
    {
        id: '004',
        name: 'Diana Prince',
        class: 'Class C',
        present: true
    },
    {
        id: '005',
        name: 'Ethan Hunt',
        class: 'Class B',
        present: false
    },
])

// Search query for filtering students based on name, ID, or class
const searchQuery = ref('')

/**
 * Filters the students array based on the search query.
 * The search query can match the student name, ID, or class.
 * @returns {Student[]} The filtered list of students based on the search query.
 */
const filteredStudents = computed(() => {
    if (!searchQuery.value) return students.value
    const query = searchQuery.value.toLowerCase()
    return students.value.filter((student: Student) =>
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.class.toLowerCase().includes(query)
    )
})

// The number of students who are present
const presentCount = computed(() => students.value.filter((s: Student) => s.present).length)

// The number of students who are absent
const absentCount = computed(() => students.value.filter((s: Student) => !s.present).length)

/**
 * Calculates the overall attendance percentage based on the total number of students and the number present.
 * @returns {string} The overall attendance percentage, rounded to two decimal places.
 */
const overallAttendancePercentage = computed(() =>
    ((presentCount.value / students.value.length) * 100).toFixed(2)
)

/**
 * Calculates the attendance percentage for each class.
 * It iterates over the students, grouping by class and counting the present and total students in each class.
 * @returns {Record<string, string>} A record containing class names as keys and their corresponding attendance percentages as values.
 */
const classAttendancePercentages = computed<Record<string, string>>(() => {
    // Define classSummary with a proper type
    const classSummary: Record<string, { total: number, present: number }> = {}

    students.value.forEach((student: Student) => {
        // If the class is not yet in the summary, initialize it
        if (!classSummary[student.class]) {
            classSummary[student.class] = {
                total: 0,
                present: 0
            }
        }
        // Increment the total count for the class
        classSummary[student.class].total++
        // If the student is present, increment the present count for the class
        if (student.present) classSummary[student.class].present++
    })

    // Calculating the attendance percentage for each class
    const percentages: Record<string, string> = {}
    for (const [className, data] of Object.entries(classSummary)) {
        percentages[className] = ((data.present / data.total) * 100).toFixed(2)
    }

    return percentages
})

/**
 * Toggles the attendance of a specific student between present and absent.
 * This function is called when a student's attendance status is changed.
 * @param {Student} student The student whose attendance will be toggled.
 */
const toggleAttendance = (student: Student) => {
    student.present = !student.present
}

/**
 * A placeholder function for searching students. It is not necessary because `filteredStudents` already handles filtering.
 */
const searchStudents = () => {
    // This function is called on input, but filtering is handled by the computed property.
}

/**
 * Simulates generating a report based on the current student attendance data.
 * In a real-world scenario, this could be an export or summary generation function.
 */
const generateReport = () => {
    console.log('Generating report...')
    alert('Report generated! (This is a mock action)')
}

// Lifecycle hook that is called when the component is mounted
onMounted(() => {
    // Here you might fetch initial data or do any setup logic
    console.log('Component mounted')
})
</script>
