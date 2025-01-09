<template>
    <div class="grid grid-rows-1 w-auto">
      <!-- Header Section -->
      <div class="w-auto bg-white min-h-18 shadow-lg h-16 flex items-center justify-between px-4">
        <h2 class="text-xl px-4 py-4 text-center lg:float-start md:float-start sm:text-center break-words whitespace-normal">
          Attendance Management
        </h2>
      </div>
  
      <!-- Search Bar Section -->
      <div class="flex flex-wrap justify-between mt-2 px-4 mb-2">
        <div class="relative w-full sm:w-3/4 sm:-ml-4">
          <input type="text" placeholder="Search Here" class="bg-gray-100 py-2 px-10 shadow-lg outline-none" v-model="search" />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <!-- Bulk Add Button -->
        <button @click="openBulkModal" class="bg-[#f5365c] text-white py-2 px-4 hover:bg-[#f5365c] mt-1 -mr-4 lg:mt-0">
          Add Attendance
        </button>
      </div>
  
      <!-- Data Table Section -->
      <div class="w-full h-[28rem] p-4 shadow-md overflow-auto">
        <table class="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-[#f5365c]">
              <th class="border border-gray-300 px-4 py-2">Full Name</th>
              <th class="border border-gray-300 px-4 py-2">Status</th>
              <th class="border border-gray-300 px-4 py-2">Date</th>
              <th class="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in filteredData" :key="index" class="text-center">
              <td class="border border-gray-300 px-4 py-2">{{ row.name }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <span :class="[row.status == 'Present' ? 'bg-green-600 py-1 text-white px-2 rounded-sm' :
                       row.status == 'Late' ? 'bg-blue-600 text-white py-1 px-5 rounded-sm' : 'bg-red-600 text-white py-1 px-2 rounded-sm'
                      ]">{{ row.status }}</span>
              </td>
              <td class="border border-gray-300 px-4 py-2">{{ row.date }}</td>
              <td class="border border-gray-300 px-4 py-2">
                <button class="bg-[#f5365c] text-black py-1 px-3 hover:bg-[#f5365cd6]" @click="openModal(row)">
                  View
                </button>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="4" class="border border-gray-300 px-4 py-2 text-center">No Data Found</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Pagination Section -->
      <div class="flex justify-end items-center mt-4 px-4">
        <button class="bg-[#f5365cd6] py-2 px-4 hover:bg-[#f5365c] disabled:opacity-50" :disabled="currentPage <= 1" @click="prevPage">
          Back
        </button>
        <p class="text-center py-2 px-4">
          {{ currentPage }} / {{ totalPages }}
        </p>
        <button class="bg-[#f5365cd6] py-2 px-4 hover:bg-[#f5365c] disabled:opacity-50" :disabled="currentPage >= totalPages" @click="nextPage">
          Next
        </button>
      </div>
  
      <!-- Modal Section -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center">
        <div class="bg-gray-100 p-6 rounded shadow-lg w-full sm:w-[50%] lg:w-[30%]">
          <h3 class="text-lg font-semibold mb-4">Details</h3>
          <p><strong>Name:</strong> {{ modalData?.name }}</p>
          <p><strong>Status:</strong> {{ modalData?.status }}</p>
          <p><strong>Date:</strong> {{ modalData?.date }}</p>
          <div class="mt-4 flex justify-end">
            <button class="bg-red-500 text-black py-2 px-4 hover:bg-red-600" @click="closeModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script lang="ts" setup>
interface Row {
    name: string;
    date: string;
    status: string;
}

const search = ref('');
const currentPage = ref(1);
const totalPages = ref(10);
const isModalOpen = ref(false);
const isBulkModalOpen = ref(false);
const modalData = ref < Row | null > (null);

const rowsPerPage = 10;
const data = ref < Row[] > ([{
        name: 'Xyrel D. Tenefrancia',
        date: '2025-01-01',
        status: 'Present'
    },
    {
        name: 'Pearl Bulawan',
        date: '2025-01-01',
        status: 'Absent'
    },
    {
        name: 'Julieto Ponce',
        date: '2025-01-02',
        status: 'Present'
    },
    {
        name: 'Nempha S. Vicente',
        date: '2025-01-02',
        status: 'Late'
    },
]);

// Data for bulk attendance
const bulkRows = ref < Row[] > ([{
    name: '',
    date: '',
    status: 'Present'
}, ]);

const filteredData = computed(() => {
    const startIndex = (currentPage.value - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.value.filter((row: Row) =>
        row.name.toLowerCase().includes(search.value.toLowerCase())
    ).slice(startIndex, endIndex);
});

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const openModal = (row: Row) => {
    modalData.value = row;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    modalData.value = null;
};

// Bulk modal functions
const openBulkModal = () => {
    isBulkModalOpen.value = true;
};

const closeBulkModal = () => {
    isBulkModalOpen.value = false;
    bulkRows.value = [{
        name: '',
        date: '',
        status: 'Present'
    }];
};

const addBulkAttendance = () => {
    bulkRows.value.forEach((row: Row) => {
        if (row.name && row.date && row.status) {
            data.value.push(row);
        }
    });
    closeBulkModal();
};
</script>
  
  
<style>
body {
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
}
</style>
