<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/inertia-vue3';
import { useAnimals } from "../animals";
import { ref, watch } from 'vue';
import { useCoinStore } from "@/stores/CoinStore";


const all_animals = useAnimals();

const coinStore = useCoinStore();
console.log(coinStore.coins);



let hatch_price = ref(coinStore.hatchPrice);

let animals = ref([]);


const getAnimalBasedOnRarity = (rarity) => {
    let animals = all_animals.filter(animal => animal.rarity == rarity);
    return animals[Math.floor(Math.random() * animals.length)];
}

const getAnimal = () => {
    let random = Math.random();
    if (random < 0.7) {
        return getAnimalBasedOnRarity("common");
    } else if (random < 0.85) {
        return getAnimalBasedOnRarity("uncommon");
    } else if (random < 0.95) {
        return getAnimalBasedOnRarity("rare");
    } else {
        return getAnimalBasedOnRarity("super-rare");
    }
}


const hatchEgg = () => {
    if (coinStore.coins >= hatch_price.value) {
        coinStore.removeCoin(hatch_price.value);
        hatch_price.value = Math.floor(hatch_price.value * (1.1 + Math.random() * 0.2));
        animals.value.push(getAnimal());
    } else {
        alert("You don't have enough money to hatch an egg!");
    }
}


const collect = (id) => {
    let animal = animals.value.find(animal => animal.id == id);
    coinStore.addCoin(animal.collect);
    animal.collect = 0;
}

setInterval(() => {
    animals.value.forEach(animal => {
        animal.collect += animal.yield / (24 * 60);
    });
}, 1000 * 10);


</script>

<template>

    <Head title="Zoo" />

    <AuthenticatedLayout>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <div class="px-4 py-2 relative  flex flex-wrap items-center justify-center">

                <div
                    class="flex-shrink-0 h-full bg-teal-500 w-full m-2 relative overflow-hidden   rounded-lg max-w-xs shadow-lg">
                    <svg class="absolute bottom-0 left-0 mb-8" viewBox="0 0 375 283" fill="none"
                        style="transform: scale(1.5); opacity: 0.1;">
                        <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)"
                            fill="white" />
                        <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)"
                            fill="white" />
                    </svg>
                    <div class="relative pt-2 px-2 flex items-center justify-center">
                        <div class="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                            style="background: radial-gradient(black, transparent 60%); transform: rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1); opacity: 0.2;">
                        </div>
                        <img class="relative w-full rounded-lg" src="images/assets/misc/egg.png" alt="">
                    </div>
                    <div class=" text-white px-5  mt-5">
                        <div class="flex justify-center">
                            <button :onClick="hatchEgg"
                                class="bg-amber-500 px-4 text-lg z-10 py-2 rounded-lg cursor-pointer">
                                {{ hatch_price }} Coins
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-for="animal in animals" class="px-4 py-2  flex flex-wrap items-center justify-center">

                <div :class="[animal.rarity, (animal.collect >= 1 ? 'glow-' + animal.rarity : '')]"
                    class="relative flex-shrink-0 h-full w-full m-2  overflow-hidden   rounded-lg max-w-xs shadow-lg">
                    <span class="py-1 z-10 px-4 badge rounded-lg shadow   text-xs absolute top-2 left-0">
                        <button class="bg-sky-800 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </button>
                    </span>


                    <span :class="[animal.rarity, 'border-' + animal.rarity]"
                        class="py-1 z-10 px-4 badge rounded-lg shadow border-solid border-slate-300 border  text-xs absolute top-4 right-4">{{
                        (animal.rarity.replace(/-/g, ' ')).toUpperCase()
                        }}</span>
                    <svg class="absolute bottom-0 left-0 mb-8" viewBox="0 0 375 283" fill="none"
                        style="transform: scale(1.5); opacity: 0.1;">
                        <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)"
                            fill="white" />
                        <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)"
                            fill="white" />
                    </svg>
                    <div class="relative pt-2 px-2 flex items-center justify-center">
                        <div class="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                            style="background: radial-gradient(black, transparent 60%); transform: rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1); opacity: 0.2;">
                        </div>
                        <img @click="collect(animal.id)" class="relative w-full rounded-lg" :src="animal.image" alt="">
                    </div>
                    <div class=" relative text-white px-5 pb-2 mt-5">
                        <div class="flex justify-between">
                            <span class="block font-semibold text-xl">
                                {{ animal.name }}<br />
                                <small class=" text-xs">Yield Rate : {{ animal.yield }}/Hr</small>
                            </span>
                            <button @click="collect(animal.id)"
                                class=" bg-slate-200 rounded-full h-[2rem] text-black text-base font-bold px-3 gap-2 py-2 leading-none flex items-center">
                                <img height="20" width="20" src="images/assets/icons/coin.ico" alt="">
                                {{ parseInt(animal.collect) }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>


<style scoped>
.common {
    background-color: #22c55e;
}


.uncommon {
    background-color: #f59e0b;
}

.rare {
    background-color: #ef4444;
}

.super-rare {
    background-color: #dc2626;
}

.glow-common {
    box-shadow: 0 0 10px, 0 0 5px #22c55e, 0 0 10px #22c55e;
    border: 2px solid #15803d;
}

.glow-uncommon {
    box-shadow: 0 0 10px #f59e0b, 0 0 5px #f59e0b, 0 0 10px #f59e0b;
    border: 2px solid #b45309;
}

.glow-rare {
    box-shadow: 0 0 10px #ef4444, 0 0 5px #ef4444, 0 0 10px #ef4444;
    border: 2px solid #991b1b;
}

.glow-super-rare {
    box-shadow: 0 0 10px #dc2626, 0 0 5px #dc2626, 0 0 10px #dc2626;
    border: 2px solid #7f1d1d;
}
</style>
