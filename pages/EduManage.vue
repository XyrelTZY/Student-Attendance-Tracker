<template>
    <div class="grid grid-cols-1">
        <div class="w-full bg-white min-w-44 shadow-lg mb-4">
            <h2 class="py-4 px-2 text-xl text-center lg:float-start break-words whitespace-normal md:float-start">
                Student Management
            </h2>
        </div>
        <div class="flex-wrap">
            <div class="px-4 py-4">
                <div class="justify-between sm:justify-center">
                    <button @click="openModal" class="mb-2 p-2 bg-[#f5365c] text-white py-2 px-4 hover:bg-[#f5365c] float-right justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 5v14m7-7H5"></path>
                        </svg>
                    </button>
                    <!-- Search Bar -->
                    <div class="mb-4 relative">
                        <input v-model="searchQuery" type="text" placeholder="Search..." class="w-auto sm:w-auto p-2 pl-10 pr-2 border border-gray-300 bg-white rounded border-none shadow-lg" />
                        <!-- Magnifying Glass Icon -->
                        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>
    
                <div class="w-full px-4 py-4 shadow-lg overflow-x-auto">
                    <!-- Data Table -->
                    <table class="w-full min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-[#f5365c]">
                                <th class="border border-gray-300 p-2">ID</th>
                                <th class="border border-gray-300 p-2">Name</th>
                                <th class="border border-gray-300 p-2">Date of Birth</th>
                                <th class="border border-gray-300 p-2">Grade</th>
                                <th class="border border-gray-300 p-2">Section</th>
                                <th class="border border-gray-300 p-2">Track</th>
                                <th class="border border-gray-300 p-2">Phone No.</th>
                                <th class="border border-gray-300 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(student, index) in paginatedStudents" :key="index || -1" class="odd:bg-white even:bg-gray-50">
                                <td class="border border-gray-300 p-2 text-center">{{ student.id }}</td>
                                <td class="border border-gray-300 p-2 text-center">{{ student.name }}</td>
                                <td class="border border-gray-300 p-2 text-center">{{ student.dateOfBirth }}</td>
                                <td class="border border-gray-300 p-2 text-center">{{ student.grade }}</td>
                                <td class="border border-gray-300 p-2 text-center">{{ student.section }}</td>
                                <td class="border border-gray-300 p-2 text-center">{{ student.track }}</td>
                                <td class="border border-gray-300 p-2 text-center">{{ student.phoneNo }}</td>
                                <td class="border border-gray-300 p-2 w-8">
                                    <div class="flex justify-center gap-2">
                                        <button @click="editStudent(student)" class="bg-[#f5365c] w-20 py-2">Edit</button>
                                        <button @click="viewAttendance(student)" class="bg-[#f5365c] w-20 py-2">View</button>
                                    </div>
                                </td>
                            </tr>
                            <!-- Conditional row when no students match the search query -->
                            <tr v-if="filteredStudents.length === 0" class="border border-gray-300">
                                <td colspan="8" class="border border-gray-300 px-4 py-2 text-center">No Data Found</td>
                            </tr>
                        </tbody>
    
                    </table>
    
                </div>
    
                <!-- Pagination -->
                <div class="flex justify-end gap-2 items-center mt-4">
                    <button :disabled="currentPage === 1" @click="prevPage" class="p-2 bg-[#f5365c] text-white disabled:opacity-50">
                        Previous
                    </button>
                    <span>Page {{ currentPage }} / {{ totalPages }}</span>
                    <button :disabled="currentPage === totalPages" @click="nextPage" class="p-2 bg-[#f5365c] text-white disabled:opacity-50 px-5">
                        Next
                    </button>
                </div>
            </div>
        </div>
    
        <!-- Modal: Add/Edit Student -->
        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
            <div class="bg-white p-6 shadow-lg max-w-[28rem] w-full">
                <h3 class="text-lg font-semibold mb-4 text-center">{{ isEditing ? 'Update Student' : 'Add New Student' }}</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Name</label>
                        <input v-model="form.name" type="text" class="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Date of Birth</label>
                        <input v-model="form.dateOfBirth" type="date" class="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Grade</label>
                        <input v-model="form.grade" type="text" class="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Section</label>
                        <input v-model="form.section" type="text" class="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Track</label>
                        <input v-model="form.track" type="text" class="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Phone No.</label>
                        <input v-model="form.phoneNo" type="text" class="w-full p-2 border border-gray-300 rounded" />
                    </div>
                </div>
                <div class="flex justify-end">
                    <button @click="closeModal" class="p-2 bg-[#f5365c] text-white mr-2">Cancel</button>
                    <button @click="saveStudent" class="p-2 bg-green-500 text-white px-4">Save</button>
                </div>
            </div>
        </div>
    
        <!-- Modal: View Attendance Record -->
        <div v-if="isAttendanceModalOpen" class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
            <div class="bg-white p-6 rounded shadow-lg w-1/3 max-w-full">
                <h3 class="text-lg font-semibold mb-4">Attendance Record for {{ selectedStudent?.name }}</h3>
                <div class="mb-4">
                    <ul>
                        <li v-for="attendance in selectedStudent?.attendance" :key="attendance.date" class="border mb-2 px-2 py-3">
                            <span>{{ attendance.date }} - </span>
                            <span :class="attendance.status == 'Present' ? 'text-green-400' : 'text-red-400'">{{ attendance.status }}
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="flex justify-end">
                    <button @click="closeAttendanceModal" class="p-2 bg-[#f5365c] text-white">Close</button>
                </div>
            </div>
        </div>
    </div>
    </template>
    

<script lang="ts" setup>
interface Student {
    id: number | null;
    name: string;
    dateOfBirth: string;
    grade: number | null;
    phoneNo: number | null;
    track: string,
        section: string,
        attendance: {
            date: string;status: string
        } []; // Attendance data
};

const students = ref < Student[] > ([{
        id: 1,
        name: 'Pearl Bulawan',
        dateOfBirth: '2005-03-12',
        grade: 11,
        phoneNo: 9123567789,
        track: "TVL",
        section: "Ryzen",
        attendance: [{
                date: '2025-01-01',
                status: 'Present'
            },
            {
                date: '2025-01-02',
                status: 'Absent'
            },
        ]
    },
    {
        id: 2,
        name: 'Von Villaver',
        dateOfBirth: '2006-02-22',
        grade: 11,
        phoneNo: 9123567789,
        track: "TVL",
        section: "Haswell",
        attendance: [{
                date: '2025-01-01',
                status: 'Present'
            },
            {
                date: '2025-01-02',
                status: 'Present'
            },
        ]
    },
    {
        id: 3,
        name: 'Xyrel Tenefrancia',
        dateOfBirth: '2006-02-22',
        grade: 11,
        phoneNo: 9123567789,
        track: "TVL",
        section: "Haswell",
        attendance: [{
                date: '2025-01-01',
                status: 'Present'
            },
            {
                date: '2025-01-02',
                status: 'Present'
            },
        ]
    },
    {
        id: 4,
        name: 'Julieto Ponce',
        dateOfBirth: '2006-02-22',
        grade: 11,
        phoneNo: 9123567789,
        track: "TVL",
        section: "Haswell",
        attendance: [{
                date: '2025-01-01',
                status: 'Present'
            },
            {
                date: '2025-01-02',
                status: 'Present'
            },
        ]
    },
    {
        id: 5,
        name: 'Nempha Vicente',
        dateOfBirth: '2006-02-22',
        grade: 11,
        phoneNo: 9123567789,
        track: "TVL",
        section: "Haswell",
        attendance: [{
                date: '2025-01-01',
                status: 'Present'
            },
            {
                date: '2025-01-02',
                status: 'Present'
            },
        ]
    },
    {
        id: 6,
        name: 'Jayrald Deniega',
        dateOfBirth: '2006-02-22',
        grade: 11,
        phoneNo: 9123567789,
        track: "TVL",
        section: "Haswell",
        attendance: [{
                date: '2025-01-01',
                status: 'Present'
            },
            {
                date: '2025-01-02',
                status: 'Present'
            },
        ]
    }
]);

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

const isModalOpen = ref(false);
const isEditing = ref(false);
const isAttendanceModalOpen = ref(false);
const selectedStudent = ref < Student | null > (null);

const form = ref < Student > ({
    id: null,
    name: '',
    dateOfBirth: '',
    grade: null,
    phoneNo: null,
    section: '',
    track: '',
    attendance: []
});

const filteredStudents = computed(() => {
    if (!searchQuery.value) return students.value;
    return students.value.filter((student: Student) =>
        student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage));

const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredStudents.value.slice(start, end);
});

function prevPage() {
    if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
    if (currentPage.value < totalPages.value) currentPage.value++;
}

function openModal() {
    isEditing.value = false;
    form.value = {
        id: null,
        name: '',
        dateOfBirth: '',
        grade: null,
        section: '',
        track: '',
        phoneNo: null,
        attendance: []
    };
    isModalOpen.value = true;
}

function editStudent(student: Student) {
    isEditing.value = true;
    form.value = {
        ...student
    };
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

function saveStudent() {
    if (isEditing.value) {
        const index = students.value.findIndex((student: Student) => student.id !== null && student.id === form.value.id);
        if (index !== -1) {
            students.value[index] = {
                ...form.value
            }; // Update existing student
        }
    } else {
        const newId = Math.max(...students.value.map((student: Student) => student.id || 0)) + 1;
        students.value.push({
            ...form.value,
            id: newId
        });
    }
    closeModal();
}

// View attendance record for a student
function viewAttendance(student: Student) {
    selectedStudent.value = student;
    isAttendanceModalOpen.value = true;
}

// Close attendance modal
function closeAttendanceModal() {
    isAttendanceModalOpen.value = false;
}
</script>

<style scoped>
table {
    margin-top: 20px;
}

button {
    cursor: pointer;
}

button:disabled {
    cursor: not-allowed;
}
</style>
