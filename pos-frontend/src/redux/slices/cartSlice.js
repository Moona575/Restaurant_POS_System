import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
    name : "cart",
    initialState,
    reducers : {
        addItems: (state, action) => { state.push(action.payload); },
        removeItem: (state, action) => state.filter(item => item.id !== action.payload),
        removeAllItems: (state) => [],
        setCartItems: (state, action) => action.payload // <--- NEW
    }
})

export const getTotalPrice = (state) => state.cart.reduce((total, item) => total + item.price, 0);
export const { addItems, removeItem, removeAllItems, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
