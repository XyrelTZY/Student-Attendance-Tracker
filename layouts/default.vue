<template>
<div class="flex">
    <!-- Sidebar -->
    <div class="w-52 h-screen bg-black">
        <ul class="flex flex-col gap-2 mt-4 text-center">
            <li v-for="link in links" :key="link.to" :class="[ 
            'flex items-center px-4 py-3 rounded-lg text-gray-400 cursor-pointer transition-all duration-300',
            activeLink === link.to
              ? 'bg-gray-800 text-white border-l-8 border-blue-500'
              : 'hover:bg-gray-700 hover:text-white'
          ]" @click="setActive(link.to)">
                <!-- Icon -->
                <i :class="link.icon" class="text-lg mr-3"></i>
                <!-- Label -->
                <span>{{ link.label }}</span>
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
const activeLink = useActiveLink();

// Sidebar links with icons
const links = [{
        label: 'Home',
        to: '/',
        icon: 'fas fa-home'
    },
    {
        label: 'About',
        to: '/about',
        icon: 'fas fa-info-circle'
    },
    {
        label: 'Services',
        to: '/services',
        icon: 'fas fa-concierge-bell'
    },
    {
        label: 'Contact',
        to: '/contact',
        icon: 'fas fa-envelope'
    },
];

const setActive = (to: string) => {
    activeLink.value = to;
};
</script>

<style>
</style>
