import { defineStore } from 'pinia'

export const useOwnedAnimalStore = defineStore({
    id: 'ownedAnimal',
    state: () => ({
        ownedAnimals: [],
    }),
    getters: {},
    actions: {
        addOwnedAnimal(animal) {
            this.ownedAnimals.push(animal)
        },
        removeOwnedAnimal(animal) {
            this.ownedAnimals = this.ownedAnimals.filter((ownedAnimal) => ownedAnimal.name !== animal.name)
        },
    },
})
