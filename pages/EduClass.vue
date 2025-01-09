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
/**
 * Represents a class in the system.
 * @interface Class
 */
interface Class {
    id: number; // Unique identifier for the class
    name: string; // Name of the class (e.g., 'Math 101')
    teacher: string; // Name of the teacher for the class
    students: number; // Number of students enrolled in the class
}

/**
 * Represents the attendance data for a class.
 * @interface Attendance
 */
interface Attendance {
    classId: number; // ID of the class
    attendance: string; // Attendance percentage for the class (e.g., '80%')
}

// Defining reactive states

// List of all classes
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
])

// A new class being added or edited
const newClass = ref < Class > ({
    id: 0, // The default ID is 0, which means it will be a new class
    name: '',
    teacher: '',
    students: 0,
})

// The selected class ID for various actions (e.g., assigning a student)
const selectedClass = ref < number | null > (null)

// The name of the new student to be assigned
const newStudentName = ref < string > ('')

// List of attendance data for the classes
const attendanceData = ref < Attendance[] > ([{
        classId: 1,
        attendance: '80%'
    },
    {
        classId: 2,
        attendance: '90%'
    },
])

/**
 * Adds a new class or updates an existing one in the `classes` array.
 * If the class already has an `id`, it will update the class, otherwise, a new class will be added.
 */
const addClass = () => {
    // If the class ID is 0, it means we are adding a new class
    if (newClass.value.id === 0) {
        newClass.value.id = Date.now(); // Use the current timestamp as a unique ID
        classes.value.push({
            ...newClass.value
        }) // Add the new class to the classes list
    } else {
        // If the class ID is not 0, we are updating an existing class
        const index = classes.value.findIndex((classItem: Class) => classItem.id === newClass.value.id)
        if (index !== -1) {
            classes.value[index] = {
                ...newClass.value
            } // Update the class at the found index
        }
    }
    // Reset the newClass state to its default values
    newClass.value = {
        id: 0,
        name: '',
        teacher: '',
        students: 0
    }
}

/**
 * Assigns a student to the selected class.
 * If a student name and selected class are provided, it will display an alert confirming the assignment.
 */
const assignStudent = () => {
    if (selectedClass.value && newStudentName.value) {
        const classItem = classes.value.find((classItem: Class) => classItem.id === selectedClass.value)
        if (classItem) {
            // Display an alert confirming the student's assignment
            alert(`${newStudentName.value} has been assigned to ${classItem.name}.`)
            // Reset the new student name field
            newStudentName.value = ''
        }
    }
}

/**
 * Fetches the attendance for a given class based on its `classId`.
 * @param {number} classId The ID of the class for which attendance needs to be fetched.
 * @returns {string} The attendance percentage for the class or 'N/A' if no attendance data exists for the class.
 */
const getAttendance = (classId: number) => {
    // Find the attendance data for the given classId
    const attendance = attendanceData.value.find((item: Attendance) => item.classId === classId)
    // Return the attendance percentage or 'N/A' if no data found
    return attendance ? attendance.attendance : 'N/A'
}
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
