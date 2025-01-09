<template>
<div class="grid grid-flow-dense grid-cols-1">
    <!-- Dashboard Header -->
    <div class="w-full bg-white h-16 shadow-lg">
        <h2 class="text-xl sm:text-2xl px-4 py-4 text-center lg:float-start break-words whitespace-normal md:float-start">Dashboard</h2>
    </div>

    <!-- Cards Section -->
    <div class="min-w-100 grid lg:grid-cols-4 md:grid-cols-2 grid-rows-1 gap-8 mt-10 items-center min-h-24">
        <div v-for="(card, index) in cards" :key="index" class="grid-cols-4 md:h-auto shadow-xl px-1 bg-[#f7fafc] py-[0.40rem]">
            <div class="flex flex-row gap-5 text-center sm:flex-col md:gap-4">
                <p class="py-5 text-sm px-3 rounded-sm" :class="[index === 0 ? 'bg-[#e9ecef]' :
                                                                index === 1 ? 'bg-[#e9ecef]' :
                                                                index === 2 ? 'bg-[#e9ecef]' : 
                                                                'bg-[#e9ecef]' ]">{{ card.icon }}</p>
                <div class="mx-3 my-2">
                    <p class="text-md">{{ card.title }}</p>
                    <p>{{ card.label }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Attendance Table -->
    <div class="lg:grid md:grid md:grid-cols-1 lg:grid-cols-1 grid-cols-2 gap-8 mt-4 lg:mt-1 grid-rows-2 hidden">
        <div class="overflow-x-auto">
            <h1 class="bg-white mb-2 py-2 px-2 shadow-lg">Overview</h1>
            <table class="min-w-full table-auto">
                <thead>
                    <tr class="bg-[#f5365c]">
                        <th class="px-4 py-2 text-center">Student Name</th>
                        <th class="px-4 py-2 text-center">Date</th>
                        <th class="px-4 py-2 text-center">Attendance Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(attendance, index) in attendanceData" :key="index">
                        <td class="border px-4 py-2 text-center">{{ attendance.name }}</td>
                        <td class="border px-4 py-2 text-center">{{ attendance.date }}</td>
                        <td class="border px-4 py-2 text-center">{{ attendance.status }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
const cards = [{
        label: 132,
        icon: "Icon 1",
        title: "Total Students",
    },
    {
        label: 120,
        icon: "Icon 2",
        title: "Total Absent",
    },
    {
        label: 112,
        icon: "Icon 3",
        title: "Absent Today",
    },
    {
        label: 132,
        icon: "Icon 4",
        title: "Present Today",
    }
];

// Attendance data
const attendanceData = [{
        name: "John Doe",
        date: "2025-01-09",
        status: "Present"
    },
    {
        name: "Jane Smith",
        date: "2025-01-09",
        status: "Absent"
    },
    {
        name: "Alice Johnson",
        date: "2025-01-09",
        status: "Present"
    },
    {
        name: "Bob Brown",
        date: "2025-01-09",
        status: "Absent"
    }
];
</script>

<style lang="scss">
</style>
