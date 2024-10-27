import { db } from "../data/db"
import { CartItem, Guitar } from "../types"


export type CarActions =
    {
        type: 'add-to-cart',
        payload: {
            item: Guitar
        }
    } |
    {
        type: 'remove-from-cart',
        payload: {
            id: Guitar['id']
        }
    } |
    {
        type: 'decrease-quantity',
        payload: {
            id: Guitar['id']
        }
    } |
    {
        type: 'increase-quantity',
        payload: {
            id: Guitar['id']
        }
    } |
    {
        type: 'clear-cart'
    }

export type CarState = {
    data: Guitar[],
    cart: CartItem[]
}


//Check items on localStorage
const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

export const initialState: CarState = {
    data: db,
    cart: initialCart()
}

const MIN_ITEMS = 1
const MAX_ITEMS = 5

export const cartReducer = (
    state: CarState = initialState,
    action: CarActions
) => {
    if (action.type === "add-to-cart") {

        const itemExists = state.cart.find((guitar) => guitar.id === action.payload.item.id)

        let updatedCart: CartItem[] = []
        if (itemExists) {
            updatedCart = state.cart.map(item => {
                if (item.id === action.payload.item.id) {
                    if (item.quantity < MAX_ITEMS) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                } else {
                    return item
                }
            })
        } else {
            const newItem: CartItem = { ...action.payload.item, quantity: 1 }
            updatedCart = [...state.cart, newItem]
        }
        return {
            ...state,
            cart: updatedCart
        }
    }

    if (action.type === "remove-from-cart") {

        const updateCart = state.cart.filter(item => item.id !== action.payload.id)
        return {
            ...state,
            cart: updateCart
        }
    }

    if (action.type === "decrease-quantity") {

        const cart = state.cart.map(item => {

            if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }

            return item
        })

        return {
            ...state,
            cart
        }
    }

    if (action.type === "increase-quantity") {

        const cart = state.cart.map(item => {

            if (item.id === action.payload.id && MAX_ITEMS > item.quantity) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }

            return item
        })
        return {
            ...state,
            cart
        }
    }

    if (action.type === "clear-cart") {

        return {
            ...state,
            cart: []
        }
    }

    return state
}
