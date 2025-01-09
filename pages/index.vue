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
interface AttendanceData {
    id: number
    name: string
    date: string
    status: 'Present' | 'Absent'
}

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

const search = ref('')
const selectedDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const filteredAttendance = computed(() => {
    return attendanceData.value.filter((item: AttendanceData) =>
        item.name.toLowerCase().includes(search.value.toLowerCase()) &&
        (selectedDate.value === '' || item.date === selectedDate.value)
    )
})

const totalPages = computed(() => Math.ceil(filteredAttendance.value.length / itemsPerPage))

const paginatedAttendance = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredAttendance.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredAttendance.value.length))

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

const uniqueDates = computed(() => {
    return [...new Set(attendanceData.value.map((item: AttendanceData) => item.date))]
})

const cards = computed(() => [{
        label: new Set(attendanceData.value.map((item: AttendanceData) => item.name)).size,
        title: "Total Students",
    },
    {
        label: attendanceData.value.filter((item: AttendanceData) => item.status === 'Absent').length,
        title: "Total Absent",
    },
    {
        label: attendanceData.value.filter((item: AttendanceData) => item.status === 'Absent' && item.date === new Date().toISOString().split('T')[0]).length,
        title: "Absent Today",
    },
    {
        label: attendanceData.value.filter((item: AttendanceData) => item.status === 'Present' && item.date === new Date().toISOString().split('T')[0]).length,
        title: "Present Today",
    }
])

const cardColors = [
    'bg-[#CFDEF',
    'bg-[#CFDEF',
    'bg-[#CFDEF',
    'bg-[#CFDEF'
]
</script>
