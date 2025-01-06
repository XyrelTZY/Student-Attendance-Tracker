<template>
<div class="flex">
    <!-- Sidebar -->
    <div class="sidebar-container w-14 h-screen shad">
        <div class="mb-16">
        </div>
        <ul class="flex flex-col gap-2 mt-4 text-center">
            <li v-for="link in links" :key="link.to" :class="[ 
              'flex items-center px-4 py-3 text-black cursor-pointer transition-all duration-300',
              activeLink === link.to
                /**
                 * @Status_Decided
                 * ? 'bg-indigo-300 text-white border-l-8 rounded-r-lg border-blue-500' 
                 */
                ? 'border-r-8 rounded-r-lg border-blue-500'
                : 'hover:bg-indigo-300 rounded-r-lg hover:text-white'
            ]">
                <!-- SVG Icon -->
                <span class="text-4xl mr-3" v-html="link.icon" @click="setActive(link.to)"></span>
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
const route = useRoute();

const links = [{
        /**
         * @Dashboard
         * Overview of Attendance Statistics
         * Notifications
         * Recent Activity
         */
        to: '/',
        icon: `
            <svg class="w-5 h-5" viewBox="0 0 25.00 25.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9.918 10.0005H7.082C6.66587 9.99708 6.26541 10.1591 5.96873 10.4509C5.67204 10.7427 5.50343 11.1404 5.5 11.5565V17.4455C5.5077 18.3117 6.21584 19.0078 7.082 19.0005H9.918C10.3341 19.004 10.7346 18.842 11.0313 18.5502C11.328 18.2584 11.4966 17.8607 11.5 17.4445V11.5565C11.4966 11.1404 11.328 10.7427 11.0313 10.4509C10.7346 10.1591 10.3341 9.99708 9.918 10.0005Z" stroke="#5e72e4" stroke-width="1.4499999999999997" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M9.918 4.0006H7.082C6.23326 3.97706 5.52559 4.64492 5.5 5.4936V6.5076C5.52559 7.35629 6.23326 8.02415 7.082 8.0006H9.918C10.7667 8.02415 11.4744 7.35629 11.5 6.5076V5.4936C11.4744 4.64492 10.7667 3.97706 9.918 4.0006Z" stroke="#5e72e4" stroke-width="1.4499999999999997" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.082 13.0007H17.917C18.3333 13.0044 18.734 12.8425 19.0309 12.5507C19.3278 12.2588 19.4966 11.861 19.5 11.4447V5.55666C19.4966 5.14054 19.328 4.74282 19.0313 4.45101C18.7346 4.1592 18.3341 3.9972 17.918 4.00066H15.082C14.6659 3.9972 14.2654 4.1592 13.9687 4.45101C13.672 4.74282 13.5034 5.14054 13.5 5.55666V11.4447C13.5034 11.8608 13.672 12.2585 13.9687 12.5503C14.2654 12.8421 14.6659 13.0041 15.082 13.0007Z" stroke="#5e72e4" stroke-width="1.4499999999999997" stroke-linecap="round" stroke-linejoin="round"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.082 19.0006H17.917C18.7661 19.0247 19.4744 18.3567 19.5 17.5076V16.4936C19.4744 15.6449 18.7667 14.9771 17.918 15.0006H15.082C14.2333 14.9771 13.5256 15.6449 13.5 16.4936V17.5066C13.525 18.3557 14.2329 19.0241 15.082 19.0006Z" stroke="#5e72e4" stroke-width="1.4499999999999997" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          `,
    },
    {
        /**
         * @Attendance_Management
         * Mark Attendance
         * View Attendance Records
         * Bulk Upload Attendance
         */
        to: '/StudentTracker',
        icon: `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1 4h2m-1-4V9m0-4a4 4 0 10-8 0v1h8V5a4 4 0 018 0v1h-8" />
            </svg>
          `,
    },
    {
        /**
         * @Student_Management
         * Add New Student
         * View/Edit Student Details
         * Import/Export Student Data
         */
        to: '/EduManage',
        icon: `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          `,
    },
    {
        /**
         * @Class_Management
         * Add/Edit Classes
         * Assign Students to Classes
         * Class Attendance Overview
         */
        to: '/EduClass',
        icon: `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12l-4-4m0 8l4-4m-4 4V4" />
            </svg>
          `,
    },
    {
        /**
         * @Reports
         * Generate Attendance Reports
         * Export Attendance Data (e.g., Excel, PDF)
         * Attendance Summary
         */
        to: '/Reports',
        icon: `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12l-4-4m0 8l4-4m-4 4V4" />
            </svg>
          `,
    },

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
];

/**
 * Sets the active link and navigates to the specified route.
 * 
 * @param to
 * @returns 
 */
const setActive = async (to: string): Promise < string > => {
    activeLink.value = to;
    router.push(to);

    return route.path
};

/**
 * @Real_Time_Rendering_Configurations
 * @Path
 */

let interval: any;


/**
 * Watches for changes to the current route path and logs the updated path.
 *
 * @param {() => string} source - A function that returns the current route path.
 * @param {(newPath: string) => void} callback - A callback function that executes when the route path changes.
 */

let Dashboard : any = null;
watch(
    () => route.path,
    async (newPath: string) => {
      if(newPath === Dashboard) return;
        console.log("Navigated To:", newPath);
        
      if(newPath === "/")
      {
      console.log("Dashboard");
      }

      Dashboard = newPath;
    },
);

/**
 * @Log
 * @Check
 */
onMounted(() => {
    const lastPath = route.path;

    interval = setInterval(() => {
        interval = null;
        console.log("Current Path:", route.path);

    }, 50000);

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
