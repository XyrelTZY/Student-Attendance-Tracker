<template v-slot:header="{ props: { headers } }">
<v-container class="pa-4">
    <!-- Dashboard Header -->
    <v-card class="mb-6">
        <v-card-title class="text-h5">Dashboard</v-card-title>
    </v-card>

    <!-- Cards Section -->
    <v-row class="mb-6" justify="center">
        <v-col v-for="(card, index) in cards" :key="index" cols="12" sm="6" lg="4">
            <v-card class="pa-4">
                <v-card-title class="text-lg text-center">{{ card.title }}</v-card-title>
                <v-card-subtitle class="text-h2 text-center">{{ card.label }}</v-card-subtitle>
            </v-card>
        </v-col>
    </v-row>

    <!-- Attendance Table -->
    <v-card class="shadow-lg">
        <v-card-text>
            <!-- Filters Section -->
            <v-row class="mb-4" align="center">
                <v-col>
                    <v-text-field v-model="search" label="Search by Student Name..." outlined />
                </v-col>
                <v-col>
                    <v-select v-model="selectedDate" :items="dateOptions" label="Select Date" outlined />
                </v-col>
            </v-row>

            <v-data-table :headers="headers" :items="filteredAttendance" :items-per-page="itemsPerPage" class="elevation-1 text-center" :pagination.sync="pagination">
                <template v-slot:item.status="{ item }">
                    <v-chip :color="item.status === 'Present' ? 'green' : 'red'" text-color="white">
                        {{ item.status }}
                    </v-chip>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script lang="ts" setup>
import axios from 'axios';

interface Attendance {
    id: number;
    name: string;
    date: string;
    status: 'Present' | 'Absent';
    createdAt: Date;
}

const headers = [
    {
        title: 'Full Name',
        key: 'name',
        align: 'center' as const,
    },
    {
        title: 'Date',
        align: 'center' as const,
        key: 'date'
    },
    {
        title: 'Attendance Status',
        align: 'center' as const,
        key: 'status',
    },
];

const attendance = ref < Attendance[] > ([]);
const search = ref('');
const selectedDate = ref('Today');
const itemsPerPage = ref(5);
const dateOptions = ['Today', 'Last Week', 'Last Month'];

// Pagination state
const pagination = ref({
    page: 1,
    rowsPerPage: itemsPerPage.value,
});

const totalAttendance = computed(() => attendance.value.length);

const presentCount = computed(() => attendance.value.filter(item => item.status === 'Present').length);
const absentCount = computed(() => attendance.value.filter(item => item.status === 'Absent').length);

const cards = computed(() => [{
        label: presentCount.value,
        title: 'Present'
    },
    {
        label: absentCount.value,
        title: 'Absent'
    },
    {
        label: totalAttendance.value,
        title: 'Total Students'
    },
]);

const filteredAttendance = computed(() => {
    return attendance.value.filter(item => {
        const matchesSearch = item.name && item.name.toLowerCase().includes(search.value.toLowerCase());
        const matchesDate = selectedDate.value === 'Today' ||
            (selectedDate.value === 'Last Week' && isLastWeek(new Date(item.createdAt))) ||
            (selectedDate.value === 'Last Month' && isLastMonth(new Date(item.createdAt)));
        return matchesSearch && matchesDate;
    });
});

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:5251/api/attendance');
        attendance.value = response.data.map((item: any) => ({
            id: item.id,
            name: item.fullName,
            date: new Date(item.date).toLocaleDateString(),
            status: item.status,
            createdAt: new Date(item.createdAt)
        }));
        console.log(attendance.value);
    } catch (error) {
        console.error('Error Fetching Attendance:', error);
    }
});

function isLastWeek(date: Date): boolean {
    const now = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);
    return date >= lastWeek && date <= now;
}

function isLastMonth(date: Date): boolean {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);
    return date >= lastMonth && date <= now;
}
</script>

<style scoped>

</style>
