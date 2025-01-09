<template>
<div>
    <!-- Header Section -->
    <div class="w-full bg-white min-h-16 shadow-lg">
        <h2 class="text-xl sm:text-2xl px-4 py-4 text-center lg:float-start break-words whitespace-normal md:float-start">
            Class Management
        </h2>
    </div>

    <!-- Main Content Section -->
    <div class="p-6 grid lg:grid-cols-2 md:grid-cols-1 gap-8 mt-6">
        <!-- Add/Edit Classes Section -->
        <div class="bg-white shadow-md rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-700">Add/Edit Classes</h3>
            <p class="mt-2 text-gray-600">Create new classes or edit existing ones.</p>
            <div class="mt-4">
                <input v-model="newClass.name" type="text" placeholder="Class Name" class="border border-gray-300 rounded-md p-2 w-full mb-4" />
                <input v-model="newClass.teacher" type="text" placeholder="Teacher Name" class="border border-gray-300 rounded-md p-2 w-full mb-4" />
                <input v-model="newClass.students" type="number" placeholder="Number of Students" class="border border-gray-300 rounded-md p-2 w-full mb-4" />
                <button @click="addClass" class="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 w-full">
                    {{ newClass.id ? 'Edit Class' : 'Add Class' }}
                </button>
            </div>
        </div>

        <!-- Assign Students to Classes Section -->
        <div class="bg-white shadow-md rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-700">Assign Students to Classes</h3>
            <p class="mt-2 text-gray-600">Assign students to different classes from the list.</p>
            <div class="mt-4">
                <select v-model="selectedClass" class="border border-gray-300 rounded-md p-2 w-full mb-4">
                    <option disabled value="">Select a Class</option>
                    <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
                        {{ classItem.name }}
                    </option>
                </select>
                <input v-model="newStudentName" type="text" placeholder="Student Name" class="border border-gray-300 rounded-md p-2 w-full mb-4" />
                <button @click="assignStudent" class="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 w-full">
                    Assign Student
                </button>
            </div>
        </div>

        <!-- Class Overview Table Section -->
        <div class="bg-white shadow-md rounded-lg p-6 col-span-2">
            <h3 class="text-lg font-semibold text-gray-700">Class Overview</h3>
            <p class="mt-2 text-gray-600">Overview of all classes with attendance data.</p>
            <div class="mt-4 overflow-x-auto">
                <table class="min-w-full table-auto">
                    <thead>
                        <tr class="bg-[#f5365c] text-white">
                            <th class="px-4 py-2 text-left">Class Name</th>
                            <th class="px-4 py-2 text-left">Teacher</th>
                            <th class="px-4 py-2 text-left">Number of Students</th>
                            <th class="px-4 py-2 text-left">Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(classItem, index) in classes" :key="index">
                            <td class="border px-4 py-2">{{ classItem.name }}</td>
                            <td class="border px-4 py-2">{{ classItem.teacher }}</td>
                            <td class="border px-4 py-2">{{ classItem.students }}</td>
                            <td class="border px-4 py-2">{{ getAttendance(classItem.id) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
// Defining TypeScript types for class and student
interface Class {
    id: number;
    name: string;
    teacher: string;
    students: number;
}

interface Attendance {
    classId: number;
    attendance: string;
}

// Defining reactive states
const classes = ref < Class[] > ([{
        id: 1,
        name: 'Math 101',
        teacher: 'Mr. Smith',
        students: 30
    },
    {
        id: 2,
        name: 'English Literature',
        teacher: 'Ms. Johnson',
        students: 25
    },
]);

const newClass = ref < Class > ({
    id: 0,
    name: '',
    teacher: '',
    students: 0,
});

const selectedClass = ref < number | null > (null);
const newStudentName = ref < string > ('');
const attendanceData = ref < Attendance[] > ([{
        classId: 1,
        attendance: '80%'
    },
    {
        classId: 2,
        attendance: '90%'
    },
]);

// Function to add or edit a class
const addClass = () => {
    if (newClass.value.id === 0) {
        newClass.value.id = Date.now();
        classes.value.push({
            ...newClass.value
        });
    } else {
        const index = classes.value.findIndex((classItem: Class) => classItem.id === newClass.value.id);
        if (index !== -1) {
            classes.value[index] = {
                ...newClass.value
            };
        }
    }
    newClass.value = {
        id: 0,
        name: '',
        teacher: '',
        students: 0
    };
};

// Function to assign a student to a class
const assignStudent = () => {
    if (selectedClass.value && newStudentName.value) {
        const classItem = classes.value.find((classItem: Class) => classItem.id === selectedClass.value);
        if (classItem) {
            alert(`${newStudentName.value} has been assigned to ${classItem.name}.`);
            newStudentName.value = '';
        }
    }
};

// Function to get the attendance for a class
const getAttendance = (classId: number) => {
    const attendance = attendanceData.value.find((item: Attendance) => item.classId === classId);
    return attendance ? attendance.attendance : 'N/A';
};
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
