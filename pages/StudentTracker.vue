<template>
    <div class="min-h-screen">
      <!-- Header Section -->
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 class="!text-base">Student Tracker</h1>
        </div>
      </header>
  
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Search Section -->
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div class="relative w-full sm:w-96">
            <input
              v-model="search"
              type="text"
              placeholder="Search..."
              class="w-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 border-none bg-white focus:ring-[#f5365c] focus:border-transparent shadow-lg"
            />
            <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
  
        <!-- Data Table Section -->
        <div class="bg-white shadow-md overflow-hidden py-4 px-2">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-[#f5365c]">
                <tr>
                  <th
                    v-for="header in tableHeaders"
                    :key="header"
                    class="px-6 py-3 text-xs uppercase tracking-wider text-center text-white"
                  >
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="student in paginatedData" :key="student.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-center">{{ student.fullName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">{{ formatDate(student.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span :class="getStatusClass(student.status)" class="text-center">
                      {{ student.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">{{ student.period }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <button
                      @click="openModal(student)"
                      class="text-[#f5365c] hover:text-[#f5365c]/80 transition duration-300 ease-in-out"
                    >
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="filteredData.length === 0" class="px-6 py-5 text-center text-gray-500">
            No data found
          </div>
        </div>
  
        <!-- Pagination Section -->
        <div class="mt-6 flex justify-between items-center">
          <p class="text-sm text-gray-700">
            Showing {{ paginationStart }} to {{ paginationEnd }} of {{ filteredData.length }} results
          </p>
          <div class="flex space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage <= 1"
              class="bg-white border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="bg-white border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
            >
              Next
            </button>
          </div>
        </div>
      </main>
  
      <!-- Modal Section for Single View -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="isModalOpen"
            class="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50"
          >
            <div class="bg-white shadow-xl p-6 w-full max-w-md">
              <h3 class="text-2xl font-semibold mb-4 text-gray-800">Student Details</h3>
              <div class="space-y-4">
                <p class="text-gray-600"><strong class="font-medium">Name:</strong> {{ modalData?.fullName }}</p>
                <p class="text-gray-600">
                  <strong class="font-medium mr-2">Status:</strong>
                  <span :class="getStatusClass(modalData?.status)">{{ modalData?.status }}</span>
                </p>
                <p class="text-gray-600"><strong class="font-medium">Date:</strong> {{ formatDate(modalData?.date) }}</p>
                <p class="text-gray-600"><strong class="font-medium">Period:</strong> {{ modalData?.period }}</p>
              </div>
              <div class="mt-6 flex justify-end">
                <button
                  @click="closeModal"
                  class="px-6 py-2 bg-[#f5365c] text-white hover:bg-[#f5365c]/90 transition duration-300 ease-in-out"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { SearchIcon } from 'lucide-vue-next'
  import axios from 'axios'
  
  interface Student {
    id: number
    fullName: string
    date: string
    status: string
    period: string
  }
  
  const search = ref('')
  const currentPage = ref(1)
  const rowsPerPage = 10
  const isModalOpen = ref(false)
  const modalData = ref<Student | null>(null)
  const students = ref<Student[]>([])
  
  const tableHeaders = ['Full Name', 'Date', 'Status', 'Period', 'Actions']
  
  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5251/api/attendance')
      students.value = response.data.map((item: any, index: number) => ({
        id: index + 1,
        fullName: item.fullName || '',
        date: item.date || '',
        status: item.status || '',
        period: item.period || ''
      }))
    } catch (error) {
      console.error('Error fetching student data:', error)
    }
  }
  
  onMounted(fetchStudents)
  
  const filteredData = computed(() => {
    return students.value.filter((student) =>
      student.fullName.toLowerCase().includes(search.value.toLowerCase())
    )
  })
  
  const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return filteredData.value.slice(startIndex, endIndex)
  })
  
  const totalPages = computed(() => Math.ceil(filteredData.value.length / rowsPerPage))
  
  const paginationStart = computed(() => (currentPage.value - 1) * rowsPerPage + 1)
  const paginationEnd = computed(() => Math.min(currentPage.value * rowsPerPage, filteredData.value.length))
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }
  
  const openModal = (student: Student) => {
    modalData.value = student
    isModalOpen.value = true
  }
  
  const closeModal = () => {
    isModalOpen.value = false
    modalData.value = null
  }
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const getStatusClass = (status: string | undefined) => {
    switch (status) {
      case 'Present':
        return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
      case 'Late':
        return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
      case 'Absent':
        return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
      default:
        return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
    }
  }
  </script>
  
  <style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  </style>
  
  