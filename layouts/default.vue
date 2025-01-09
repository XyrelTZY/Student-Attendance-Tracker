<template>
<div class="flex ">
    <!-- Sidebar -->
    <div class="sidebar-container w-16 h-screen md:h-[50rem] hover:w-44 overflow-hidden transition-all duration-300 ease-in-out')]">
        <div class="my-2 lg:mx-[0.25rem] mx-3 border-b-[1px] flex flex-row gap-4 relative">
            <img src="../assets/images/SchoolLogo.png" alt="ZSNHS School Logo" class="w-14">
            <figure v-for="(schoolname, index) in title" :key="index" class="abosolute mt-4 ">{{ schoolname.title}}</figure>
        </div>
        <ul class="flex flex-col gap-2 mt-4 text-center">
            <li v-for="(link, index) in links" :key="index" @click="setActive(link.to)" :class="[ 
              'flex items-center px-4 py-3 text-black cursor-pointer transition-all duration-300',
              activeLink === link.to
                /**
                 * @Status_Decided
                 * ? 'bg-indigo-300 text-white border-l-8 rounded-r-lg border-blue-500' 
                 */
                ? 'border-l-8 ml-[0.05rem] rounded-l-sm border-[#f5365c] bg-[#e9ecef]'
                : 'hover:bg-[#CFDEF3]' 
            ]">
                <!-- SVG Icon -->
                <span class="text-4xl mr-7" v-html="link.icon" @click="setActive(link.to)" :class="[
                    activeLink === link.to || index === 0 ? 'text-blue-500' : 'text-black',
                    index === 1 ? 'text-black' : 
                    index === 2 ? 'text-black' :
                    index === 3 ? 'text-black': 
                    index === 4 ? 'text-black' : 'text-black'
                ]" /> {{ link.label }}
            </li>
        </ul>
    </div>

    <!-- Main Content -->
    <main class="flex-1 p-6">
        <slot />
    </main>
</div>
</template>

<script lang="ts" setup>
const activeLink = useActiveLink(); //State Management 
const router = useRouter(); //Router Navigation
const route = useRoute(); //To Find Routes Path

const title = [{
    title: < string > "ZSNHS"
}]; //Title
const links = [{
        /**
         * @Dashboard
         * Overview of Attendance Statistics
         * Notifications
         * Recent Activity
         */
        to: '/',
        label: 'Dashboard',
        icon: `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
      </svg>`,
    },
    {
        /**
         * @Attendance_Management
         * Mark Attendance
         * View Attendance Records
         * Bulk Upload Attendance
         */
        to: '/StudentTracker',
        label: 'Attendance',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" class="w-6"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>`, // mdi:clipboard-check
    },
    {
        /**
         * @Student_Management
         * Add New Student
         * View/Edit Student Details
         * Import/Export Student Data
         */
        to: '/EduManage',
        label: 'Student',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" class="w-6"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/></svg>`, // mdi:account-group
    },
    // {
    //     /**
    //      * @Class_Management
    //      * Add/Edit Classes
    //      * Assign Students to Classes
    //      * Class Attendance Overview
    //      */
    //     to: '/EduClass',
    //     label: 'Classes',
    //     icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" class="w-6"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/></svg>`, // mdi:school
    // },
    {
        /**
         * @Reports
         * Generate Attendance Reports
         * Export Attendance Data (e.g., Excel, PDF)
         * Attendance Summary
         */
        to: '/Reports',
        label: 'Reports',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" w="w-6"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 412L346-160H160v-186L28-480l132-134v-186h186l134-132 134 132h186v186l132 134-132 134v186H614L480-28Zm0-112 100-100h140v-140l100-100-100-100v-140H580L480-820 380-720H240v140L140-480l100 100v140h140l100 100Zm0-340Z"/></svg>`, // mdi:chart-bar
    },
];

/**
 * @Optional_Features
 * 
  @User_Management for @Multiple_Admin
 * Add/Remove Administrators
 * Manage User Roles
 
    @Settings
 * Academic Year/Session Settings
 * Attendance Rules (e.g., thresholds, late policies)
 * Notification Preferences
 
    @Help && @Support
 * User Guide
 * FAQs
 * Contact Support
 */

/**
 * Sets the active link and navigates to the specified route.
 * 
 * @param to
 * @returns 
 */
const setActive = async (to: string): Promise < string > => {
    while (true) {
        activeLink.value = to;
        router.push(to);

        return route.path
    }
};

/**
 * @Real_Time_Rendering_Configurations
 * @Path
 */

/**
 * Watches for changes to the current route path and logs the updated path.
 *
 * @param {() => string} source - A function that returns the current route path.
 * @param {(newPath: string) => void} callback - A callback function that executes when the route path changes.
 */

let Dashboard: any = null;
watch(
    () => route.path,
    async (newPath: string) => {
        if (newPath === Dashboard) void
        console.log("Navigated To:", newPath);

        if (newPath === "/") {
            console.log("Dashboard");
        }

        Dashboard = newPath;
    },
);

/**
 * @Log
 * @Check
 */

let interval: any;

onMounted(() => {
    const lastPath = route.path;

    interval = setInterval(() => {
        interval = null;
        console.log("Current Path:", route.path);

    }, 1000);

    if (lastPath) {
        router.push(lastPath);
    }
    if (interval) {
        return route.path
    }

});

/**
 * @Clear
 */
onUnmounted(() => {
    if (interval) {
        clearInterval(interval);
        interval = null;

        return console.log("Current Path:", route.path);
    }
});
</script>

<style lang="scss">
@import '../assets/global.scss';

.sidebar-container {
    background: $theme5;
}
</style>
