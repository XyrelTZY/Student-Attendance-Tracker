<template>
    <div class="min-h-screen">
      <!-- Header Section -->
      <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ">
          <h1 class="text-1xl">Attendance Management</h1>
        </div>
      </header>
  
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Search and Bulk Add Section -->
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
          <button
            @click="openBulkModal"
            class="bg-[#f5365c] text-white py-2 px-4 hover:bg-[#f5365c]/90 transition duration-300 ease-in-out flex items-center space-x-2"
          >
            <PlusIcon class="w-5 h-5" />
          </button>
        </div>
  
        <!-- Data Table Section -->
        <div class="bg-white shadow-md overflow-hidden py-4 px-2">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-[#f5365c]">
                <tr>
                  <th v-for="header in tableHeaders" :key="header" class="px-6 py-3 text-xs uppercase tracking-wider text-center">
                    {{ header }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="row in paginatedData" :key="row.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-center">{{ row.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span :class="getStatusClass(row.status)" class="text-center">
                      {{ row.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center ">{{ formatDate(row.date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">{{ row.period }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <button @click="openModal(row)" class="text-[#f5365c] hover:text-[#f5365c]/80 transition duration-300 ease-in-out">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="filteredData.length === 0" class="px-6 py-4 text-center text-gray-500">
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
  
      <!-- Modal Section for Bulk Attendance -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="isBulkModalOpen" class="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
            <div class="bg-white shadow-xl p-6 w-full max-w-md">
              <h3 class="text-lg font-semibold mb-4">Add Bulk Attendance</h3>
              <form @submit.prevent="addBulkAttendance">
                <div v-for="(row, index) in bulkRows" :key="index" class="mb-4 p-4 bg-gray-50 grid grid-cols-2 gap-4 grid-rows-2">
                  <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700">Full Name:</label>
                    <input v-model="row.name" type="text" required class="mt-1 block w-full border-gray-300 shadow-sm focus:border-[#f5365c] focus:ring focus:ring-[#f5365c] focus:ring-opacity-50 outline-none py-2 px-2 bg-white" />
                  </div>
                  <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700">Date:</label>
                    <input v-model="row.date" type="date" required class="mt-1 block w-full border-gray-300 shadow-sm focus:border-[#f5365c] focus:ring focus:ring-[#f5365c] focus:ring-opacity-50 outline-none py-2 px-2 bg-white" />
                  </div>
                  <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700">Status:</label>
                    <select v-model="row.status" required class="mt-1 block w-full border-gray-300 shadow-sm focus:border-[#f5365c] focus:ring focus:ring-[#f5365c] focus:ring-opacity-50 outline-none py-2 px-2 bg-white">
                      <option value="Present">Present</option>
                      <option value="Late">Late</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                  <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700">Period:</label>
                    <select v-model="row.period" required class="mt-1 block w-full border-gray-300 shadow-sm focus:border-[#f5365c] focus:ring focus:ring-[#f5365c] focus:ring-opacity-50 outline-none py-2 px-2 bg-white">
                      <option value="Morning">Morning</option>
                      <option value="Noon">Noon</option>
                    </select>
                  </div>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="addBulkRow" class="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300 ease-in-out">
                    Add Row
                  </button>
                  <button type="button" @click="closeBulkModal" class="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition duration-300 ease-in-out">
                    Cancel
                  </button>
                  <button type="submit" class="px-4 py-2 bg-[#f5365c] text-white hover:bg-[#f5365c]/90 transition duration-300 ease-in-out">
                    Add Attendance
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>
  
      <!-- Modal Section for Single View -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div class="bg-white shadow-xl p-6 w-full max-w-md">
              <h3 class="text-2xl font-semibold mb-4 text-gray-800">Attendance Details</h3>
              <div class="space-y-4">
                <p class="text-gray-600"><strong class="font-medium">Name:</strong> {{ modalData?.name }}</p>
                <p class="text-gray-600">
                  <strong class="font-medium mr-2">Status:</strong>
                  <span :class="getStatusClass(modalData?.status)">{{ modalData?.status }}</span>
                </p>
                <p class="text-gray-600"><strong class="font-medium">Date:</strong> {{ formatDate(modalData?.date) }}</p>
                <p class="text-gray-600"><strong class="font-medium">Period:</strong> {{ modalData?.period }}</p>
              </div>
              <div class="mt-6 flex justify-end">
                <button @click="closeModal" class="px-6 py-2 bg-[#f5365c] text-white hover:bg-[#f5365c]/90 transition duration-300 ease-in-out">
                  Close
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </template>
  
  <script setup lang="ts">
  import { SearchIcon, PlusIcon } from 'lucide-vue-next'
  
  interface Row {
    id: number;
    name: string;
    date: string;
    status: string;
    period: string;
  }
  
  const search = ref('')
  const currentPage = ref(1)
  const rowsPerPage = 10
  const isModalOpen = ref(false)
  const isBulkModalOpen = ref(false)
  const modalData = ref<Row | null>(null)
  
  const tableHeaders = ['Full Name', 'Status', 'Date', 'Period', 'Actions']
  
  const data = ref<Row[]>([
    { id: 1, name: 'Xyrel D. Tenefrancia', date: '2025-01-01', status: 'Present', period: 'Noon' },
    { id: 2, name: 'Pearl Bulawan', date: '2025-01-01', status: 'Absent', period: 'Morning' },
    { id: 3, name: 'Julieto Ponce', date: '2025-01-02', status: 'Present', period: 'Noon' },
    { id: 4, name: 'Nempha S. Vicente', date: '2025-01-02', status: 'Late', period: 'Morning' },
  ])
  
  const bulkRows = ref<Omit<Row, 'id'>[]>([{ name: '', date: '', status: 'Present', period: 'Morning' }])
  
  const filteredData = computed(() => {
    return data.value.filter((row: Row) =>
      row.name.toLowerCase().includes(search.value.toLowerCase())
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
  
  const openModal = (row: Row) => {
    modalData.value = row
    isModalOpen.value = true
  }
  
  const closeModal = () => {
    isModalOpen.value = false
    modalData.value = null
  }
  
  const openBulkModal = () => {
    isBulkModalOpen.value = true
  }
  
  const closeBulkModal = () => {
    isBulkModalOpen.value = false
    bulkRows.value = [{ name: '', date: '', status: 'Present', period: 'Morning' }]
  }
  
  const addBulkRow = () => {
    bulkRows.value.push({ name: '', date: '', status: 'Present', period: 'Morning' })
  }
  
  const addBulkAttendance = () => {
    const newRows = bulkRows.value.filter((row: any)=> row.name && row.date && row.status && row.period)
    const lastId = data.value.length > 0 ? Math.max(...data.value.map((row: Row) => row.id)) : 0
    const newData = newRows.map((row: any, index: any) => ({ ...row, id: lastId + index + 1 }))
    data.value.push(...newData)
    closeBulkModal()
  }
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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