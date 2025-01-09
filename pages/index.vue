<template>
<div class="container mx-auto p-4">
    <!-- Dashboard Header -->
    <div class="w-full bg-white h-16 shadow-lg mb-6">
        <h2 class="text-xl sm:text-2xl px-4 py-4 text-center lg:text-left">Dashboard</h2>
    </div>

    <!-- Cards Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div v-for="(card, index) in cards" :key="index" class="p-6 rounded-lg shadow-md transition-all duration-300 grid grid-cols-2 gap-4" :class="cardColors[index]">
            <h3 class="text-lg text-center">{{ card.title }}</h3>
            <p class="text-3xl text-center">{{ card.label }}</p>
        </div>
    </div>

    <!-- Attendance Table -->
    <div class="shadow-lg overflow-hidden">
        <div class="p-4 border-b">
            <h2 class="text-xl font-semibold">Attendance Overview</h2>
        </div>
        <div class="p-4">
            <div class="flex flex-col sm:flex-row gap-4 mb-4">
                <input v-model="search" type="text" placeholder="Search..." class="px-3 py-2 border-none outline-none bg-white flex-grow" />
                <select v-model="selectedDate" class="px-3 py-2 border-none bg-white outline-none">
                    <option value="">All Dates</option>
                    <option v-for="date in uniqueDates" :key="date" :value="date">
                        {{ date }}
                    </option>
                </select>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-[#f5365c]">
                        <tr>
                            <th class="px-6 py-3 text-center uppercase tracking-wider">Student Name</th>
                            <th class="px-6 py-3 text-center uppercase tracking-wider">Date</th>
                            <th class="px-6 py-3 text-center uppercase tracking-wider">Attendance Status</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="attendance in paginatedAttendance" :key="attendance.id">
                            <td class="px-6 py-4 whitespace-nowrap text-center">{{ attendance.name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">{{ attendance.date }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    attendance.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                                    {{ attendance.status }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mt-4 flex flex-col sm:flex-row justify-between items-center">
                <p class="text-sm text-gray-700 mb-2 sm:mb-0">
                    Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredAttendance.length }} entries
                </p>
                <div class="flex space-x-2">
                    <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 border rounded-md disabled:opacity-50">
                        Previous
                    </button>
                    <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded-md disabled:opacity-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
/**
 * Represents attendance data for a student on a specific date.
 * @interface AttendanceData
 */
interface AttendanceData {
    id: number; // Unique identifier for the attendance record
    name: string; // Name of the student
    date: string; // Date of the attendance record (in 'YYYY-MM-DD' format)
    status: 'Present' | 'Absent'; // Attendance status for the student ('Present' or 'Absent')
}

// List of attendance records for students
const attendanceData = ref < AttendanceData[] > ([{
        id: 1,
        name: "John Doe",
        date: "2025-01-09",
        status: "Present"
    },
    {
        id: 2,
        name: "Jane Smith",
        date: "2025-01-09",
        status: "Absent"
    },
    {
        id: 3,
        name: "Alice Johnson",
        date: "2025-01-09",
        status: "Present"
    },
    {
        id: 4,
        name: "Bob Brown",
        date: "2025-01-09",
        status: "Absent"
    },
    {
        id: 5,
        name: "Charlie Davis",
        date: "2025-01-10",
        status: "Present"
    },
    {
        id: 6,
        name: "Diana Evans",
        date: "2025-01-10",
        status: "Present"
    },
    {
        id: 7,
        name: "Ethan Foster",
        date: "2025-01-10",
        status: "Absent"
    },
    {
        id: 8,
        name: "Grace Harris",
        date: "2025-01-10",
        status: "Present"
    },
])

// Reactive search query to filter attendance records by student name
const search = ref('')

// Reactive selected date to filter attendance records by date
const selectedDate = ref('')

// Current page for pagination
const currentPage = ref(1)

// Number of items to display per page in pagination
const itemsPerPage = ref(5)

/**
 * Computed property to filter attendance records based on search query and selected date.
 */
const filteredAttendance = computed(() => {
    return attendanceData.value.filter((item: AttendanceData) =>
        item.name.toLowerCase().includes(search.value.toLowerCase()) &&
        (selectedDate.value === '' || item.date === selectedDate.value)
    )
})

// Total number of pages based on filtered attendance records
const totalPages = computed(() => Math.ceil(filteredAttendance.value.length / itemsPerPage.value))

/**
 * Computed property to get the attendance records for the current page.
 */
const paginatedAttendance = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredAttendance.value.slice(start, end)
})

// Start index for the current page
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)

// End index for the current page, ensuring it doesn't exceed the total length
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredAttendance.value.length))

/**
 * Moves to the previous page in the pagination.
 */
const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

/**
 * Moves to the next page in the pagination.
 */
const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

/**
 * Computed property to get all unique attendance dates from the data.
 */
const uniqueDates = computed(() => {
    return [...new Set(attendanceData.value.map((item: AttendanceData) => item.date))]
})

/**
 * Computed property to generate statistics cards showing total students, absentees, and attendance counts.
 */
const cards = computed(() => [{
        label: new Set(attendanceData.value.map((item: AttendanceData) => item.name)).size, // Unique student count
        title: "Total Students",
    },
    {
        label: attendanceData.value.filter((item: AttendanceData) => item.status === 'Absent').length, // Total absent students
        title: "Total Absent",
    },
    {
        label: attendanceData.value.filter((item: AttendanceData) => item.status === 'Absent' && item.date === new Date().toISOString().split('T')[0]).length, // Absent today
        title: "Absent Today",
    },
    {
        label: attendanceData.value.filter((item: AttendanceData) => item.status === 'Present' && item.date === new Date().toISOString().split('T')[0]).length, // Present today
        title: "Present Today",
    }
])

// Array of colors for the statistics cards
const cardColors = [
    'bg-[#CFDEF]',
    'bg-[#CFDEF]',
    'bg-[#CFDEF]',
    'bg-[#CFDEF]'
]
</script>
