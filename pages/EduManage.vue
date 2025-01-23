<template>
  <v-container class="pa-4">
    <!-- Dashboard Header -->
    <v-card class="mb-6">
      <v-card-title class="text-h5">Student Management</v-card-title>
    </v-card>

    <!-- Search and Add Button Section -->
    <v-row class="mb-4" align="center">
      <v-col class="d-flex" cols="12" sm="6">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search..."
          class="mr-2"
        />
      </v-col>
      <v-col class="d-flex justify-end" cols="12" sm="6">
        <v-btn @click="openModal" color="#f5365c" class="white--text">
          <v-icon left>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-card class="shadow-lg">
      <v-card-text>
        <v-data-table
          :items="paginatedStudents"
          :items-per-page="itemsPerPage"
          class="elevation-1"
        >
          <!-- <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title class="text-left">Students Information</v-toolbar-title>
            </v-toolbar>
          </template> -->
          <template v-slot:item.actions="{ item }">
            <v-btn @click="editStudent(item)" color="#f5365c" class="white--text">Edit</v-btn>
            <v-btn @click="viewStudent(item)" color="#f5365c" class="white--text">View</v-btn>
          </template>
          <template v-slot:no-data>
            <v-alert type="info" class="mt-4">
              No Data Found
            </v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal: Add/Edit Student -->
    <v-dialog v-model="isModalOpen" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditing ? 'Update Student' : 'Add New Student' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="form.FullName" label="Name" required />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="form.BirthDate" label="Date of Birth" type="date" required />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="form.GradeLevel" label="Grade" required />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="form.Section" label="Section" required />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="form.Track" label="Track" required />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model="form.PhoneNo" label="Phone No." required />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeModal" color="grey">Cancel</v-btn>
          <v-btn @click="saveStudent" color="green">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal: View Student Details -->
    <v-dialog v-model="isViewModalOpen" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Details for {{ selectedStudent?.FullName }}</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Name: {{ selectedStudent?.FullName }}</v-list-item-title>
                <v-list-item-subtitle>Date of Birth: {{ selectedStudent?.BirthDate }}</v-list-item-subtitle>
                <v-list-item-subtitle>Grade: {{ selectedStudent?.GradeLevel }}</v-list-item-subtitle>
                <v-list-item-subtitle>Section: {{ selectedStudent?.Section }}</v-list-item-subtitle>
                <v-list-item-subtitle>Track: {{ selectedStudent?.Track }}</v-list-item-subtitle>
                <v-list-item-subtitle>Phone No.: {{ selectedStudent?.PhoneNo }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeViewModal" color="#f5365c" class="white--text">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

interface Attendance {
  date: string;
  status: string;
}

interface Student {
  id: number | null;
  FullName: string;
  BirthDate: string;
  GradeLevel: number | null;
  PhoneNo: string | null;
  Track: string;
  Section: string;
  attendance: Attendance[];
}

const students = ref<Student[]>([]);
const searchQuery = ref('');
const itemsPerPage = ref(5);
const pagination = ref({ page: 1, rowsPerPage: itemsPerPage.value });

const isModalOpen = ref(false);
const isEditing = ref(false);
const isViewModalOpen = ref(false);
const selectedStudent = ref<Student | null>(null);

const form = ref<Student>({
  id: null,
  FullName: '',
  BirthDate: '',
  GradeLevel: null,
  PhoneNo: null,
  Track: '',
  Section: '',
  attendance: [],
});

// Fetch data from the API
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5251/api/students');
    students.value = response.data.map((student: any) => ({
      id: student.studentID,
      FullName: student.fName,
      BirthDate: student.birthDate,
      GradeLevel: student.gradeLevel,
      PhoneNo: student.phoneNumber,
      Track: student.track,
      Section: student.section,
    }));
  } catch (error) {
    console.error('Error fetching students:', error);
  }
});

// Computed properties
const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value;
  return students.value.filter((student: Student) =>
    student.FullName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedStudents = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.rowsPerPage;
  const end = start + pagination.value.rowsPerPage;
  return filteredStudents.value.slice(start, end);
});

function openModal() {
  isEditing.value = false;
  form.value = {
    id: null,
    FullName: '',
    BirthDate: '',
    GradeLevel: null,
    Track: '',
    Section: '',
    PhoneNo: null,
    attendance: [],
  };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function editStudent(student: Student) {
  isEditing.value = true;
  form.value = { ...student };
  isModalOpen.value = true;
}

function viewStudent(student: Student) {
  selectedStudent.value = student;
  isViewModalOpen.value = true;
}

function closeViewModal() {
  isViewModalOpen.value = false;
}

async function saveStudent() {
  const studentData = { ...form.value };

  if (!studentData.FullName || !studentData.BirthDate || !studentData.Track || !studentData.Section) {
    console.error('Missing required fields');
    return;
  }

  if (studentData.GradeLevel === null) {
    studentData.GradeLevel = 0; // Assuming 0 for null GradeLevel
  }

  if (studentData.BirthDate) {
    studentData.BirthDate = new Date(studentData.BirthDate).toISOString();
  }

  try {
    if (isEditing.value) {
      await axios.put(`http://localhost:5251/api/students/${studentData.id}`, studentData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const index = students.value.findIndex((student: Student) => student.id === studentData.id);
      if (index !== -1) {
        students.value[index] = { ...studentData };
      }
    } else {
      const newId = Math.max(...students.value.map((student: Student) => student.id || 0)) + 1;
      const newStudent = { ...studentData, id: newId };
      await axios.post('http://localhost:5251/api/students', newStudent, {
        headers: { 'Content-Type': 'application/json' },
      });

      students.value.push(newStudent);
    }

    closeModal();
  } catch (error: any) {
    console.error('Error saving student:', error.response?.data || error.message);
  }
}
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}

.v-btn {
  cursor: pointer;
}

.v-btn:disabled {
  cursor: not-allowed;
}
</style>