<template>
<div class="grid grid-flow-dense grid-cols-1">
    <div class="w-full bg-white h-16 shadow-lg">
        <h2 class="text-xl sm:text-2xl px-4 py-4 text-center lg:float-start break-words whitespace-normal md:float-start">Dashboard</h2>
    </div>
    <div class="min-w-100 grid lg:grid-cols-4 md:grid-cols-2 grid-rows-1 gap-8 mt-10 items-center min-h-24">
        <div v-for="(card, index) in cards" :key="index" class="grid-cols-4 md:h-auto shadow-xl px-1 bg-[#f7fafc] py-[0.40rem]">
            <div class="flex flex-row gap-5 text-center sm:flex-col md:gap-4">
                <p class="py-5 text-sm px-3 rounded-sm" :class="[
                  index === 0 ? 'bg-[#e9ecef]' :
                  index === 1 ? 'bg-[#e9ecef]' :
                  index === 2 ? 'bg-[#e9ecef]' :
                  'bg-[#e9ecef]'
                ]">{{ card.icon }}</p>
                <div class="mx-3 my-2">
                    <p class="text-md">{{ card.title }}</p>
                    <p>{{ card.label }}</p>
                </div>
            </div>
            
        </div>
    </div>
    <!-- Chart and Notification h-[25.3rem] -->
     <!-- Need to Fix && Remove the Notification and Chart in Mobile Views -->
    <div class="lg:grid md:grid lg:grid-cols-2 grid-cols-2 gap-8 mt-4 lg:mt-1 grid-rows-2 hidden">
            <div class="w-auto bg-[#f7fafc] h-96">
                Charts
            </div>
            <div class="w-auto bg-[#f7fafc] h-96">
                Reports
        </div>
    </div>
</div>
</template>

<script lang="ts" setup>
const cards = [{
        label: < number > 132,
        icon: < string | number > "Icon 1",
        title: < string > "Total Students",
        absent: "Absent",
        // background: "~/assets/pages/users.svg"
    },
    {
        label: < number > 120,
        icon: < string | number > "Icon 2",
        title: < string > "Total Absent",
        absent: "Present",

    },
    {
        label: < number > 112,
        icon: < string | number > "Icon 3",
        title: < string > "Recent Activity",
        absent: "Absent",
    },
    {
        label: < number > 132,
        icon: < string | number > "Icon 4",
        title: < string > "Notifications",
        absent: "Present",
    }
];
</script>

<style lang="scss">

</style>
