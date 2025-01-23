<template>
    <div class="min-h-screen">
        <div class="w-full bg-white h-16 shadow-lg mb-6">
            <h2 class="text-xl sm:text-2xl px-4 py-4">Report</h2>
        </div>
        <main>
            <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <!-- Dashboard Overview -->
                <div class="overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-white p-4 rounded-lg text-center">
                            <h3 class="text-lg font-medium text-blue-800 mb-2">Present Today</h3>
                            <p class="text-3xl font-bold text-blue-600">{{ presentCount }}</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg text-center">
                            <h3 class="text-lg font-medium text-red-800 mb-2">Absent Today</h3>
                            <p class="text-3xl font-bold text-red-600 text-center">{{ absentCount }}</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg text-center">
                            <h3 class="text-lg font-medium text-green-800 mb-2">Overall Attendance</h3>
                            <p class="text-3xl font-bold text-green-600">{{ overallAttendancePercentage }}%</p>
                        </div>
                    </div>
                </div>

                <!-- Attendance Management -->
                <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
                    <h2 class="text-2xl font-semibold text-gray-900 mb-4">Attendance Management</h2>
                    <div class="mb-4">
                        <input v-model="searchQuery" type="text" placeholder="Search..." class="w-full px-3 py-2 bg-gray-100 outline-none rounded-md" />
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-[#f5365c]">
                                <tr>
                                    <th class="px-6 py-3 text-xs uppercase tracking-wider text-center text-white">Name</th>
                                    <th class="px-6 py-3 text-xs uppercase tracking-wider text-center text-white">Student ID</th>
                                    <th class="px-6 py-3 text-xs uppercase tracking-wider text-center text-white">Class</th>
                                    <th class="px-6 py-3 text-xs uppercase tracking-wider text-center text-white">Status</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(student, index) in filteredStudents" :key="index">
                                    <td class="px-6 py-4 whitespace-nowrap text-center">{{ student.FullName }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center">{{ student.Student_Id }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center">{{ student.Class }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-center">
                                        <span :class="student.Status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class=" text-center px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                            {{ student.Status }}
                                        </span>
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
                            <h3 class="text-lg font-medium text-gray-900 mb-2 text-xs">Generate Report</h3>
                            <button @click="generateReport" class="bg-[#f5365c] whitespace-nowrap text-white text-xs font-bold py-2 px-4 rounded">
                                Generate Report
                            </button>
                        </div>
                        <div class="flex gap-4">
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
import axios from 'axios';

interface Student {
  Student_Id: string;
  FullName: string;
  Class: string;
  Status: string;
}

const students = ref<Student[]>([]);
const searchQuery = ref('');

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5251/api/report');
    students.value = response.data.map((item: any) => ({
      Student_Id: item.student_Id,
      FullName: item.full_Name,
      Class: item.class,
      Status: item.status,
    }));
  } catch (error) {
    console.error('Error Fetching Data:', error);
  }
});


const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value;
  const query = searchQuery.value.toLowerCase();
  return students.value.filter(
    (student: Student) =>
      student.FullName.toLowerCase().includes(query) ||
      student.Student_Id.toString().toLowerCase().includes(query) ||
      student.Class.toLowerCase().includes(query)
  );
});

const presentCount = computed(() => students.value.filter((s: Student) => s.Status === 'Present').length);
const absentCount = computed(() => students.value.filter((s: Student) => s.Status === 'Absent').length);
const overallAttendancePercentage = computed(() => ((presentCount.value / students.value.length) * 100).toFixed(2));

const classAttendancePercentages = computed<Record<string, string>>(() => {
  const classSummary: Record<string, { total: number; present: number }> = {};

  students.value.forEach((student: Student) => {
    if (!classSummary[student.Class]) {
      classSummary[student.Class] = { total: 0, present: 0 };
    }
    classSummary[student.Class].total++;
    if (student.Status === 'Present') classSummary[student.Class].present++;
  });

  const percentages: Record<string, string> = {};
  for (const [className, data] of Object.entries(classSummary)) {
    percentages[className] = ((data.present / data.total) * 100).toFixed(2);
  }

  return percentages;
});

const generateReport = () => {
  console.log('Generating report...');
  alert('Report generated! (This is a mock action)');
};
</script>
