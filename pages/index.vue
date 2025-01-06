<template>
<div class="grid grid-flow-dense grid-cols-1">
    <div class="w-full bg-white h-16 shadow-lg">
        <h2 class="text-2xl px-4 py-4 text-center lg:float-start md:float-start">Dashboard</h2>
    </div>
    <div class="min-w-100 grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-10 items-center min-h-26">
        <div v-for="(card, index) in cards" :key="index" class="grid-cols-4 bg-white md:h-auto shadow-xl px-1 py-[0.40rem]">
            <div class="flex flex-row gap-5 text-center">
                <p class="py-5 text-sm px-3 rounded-sm" :class="[
                  index === 0 ? 'bg-indigo-400' :
                  index === 1 ? 'bg-cyan-300' :
                  index === 2 ? 'bg-emerald-300' :
                  'bg-[#f5365c]'
                ]">{{ card.icon }}</p>
                <div class="mx-3 my-2">
                    <p class="text-md">{{ card.title }}</p>
                    <p>{{ card.label }}</p>
                </div>
            </div>
        </div>
    </div>
    <!--  -->
    <div>

    </div>
</div>
</template>

<script lang="ts" setup>
const cards = [{
        label: <number> 132,
        icon: <string | number> "Icon 1",
        title: <string> "Total Students",
        absent: "Absent",
    },
    {
        label: <number> 120,
        icon: <string | number> "Icon 2",
        title: <string> "Total Absent",
        absent: "Present",

    },
    {
        label: <number> 112,
        icon: <string | number> "Icon 3",
        title: <string> "Recent Activity",
        absent: "Absent",
    },
    {
        label: <number> 132,
        icon: <string | number> "Icon 4",
        title: <string> "Notifications",
        absent: "Present",
    }
];

</script>

<style lang="scss">
</style>
