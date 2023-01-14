import { defineStore } from 'pinia'

export const useCoinStore = defineStore({
    id: 'coin',
    state: () => ({
        coins: 100,
        hatchPrice: 10,
    }),
    getters: {},
    actions: {
        addCoin(amount) {
            this.coins += amount
        },
        removeCoin(amount) {
            this.coins -= amount
        },
        increaseHatchPrice() {
            this.hatchPrice = Math.floor(this.hatchPrice * (1.1 + Math.random() * 0.2));

        },
    }
})
