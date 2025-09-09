// src/redux/slices/customerSlice.js (Corrected)

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderId: "",
    customerName: "",
    customerPhone: "",
    guests: 0,
    table: null
}

const customerSlice = createSlice({
    name : "customer",
    initialState,
    reducers : {
        // 🟢 FIX: Accept multiple possible keys from the payload
        setCustomer: (state, action) => {
            const { customerName, customerPhone, guests, table, name, phone } = action.payload;
            
            // Prioritize the correct keys, but fall back to the old ones if necessary
            state.customerName = customerName || name || "";
            state.customerPhone = customerPhone || phone || "";
            state.guests = guests;
            state.table = table;
        },

        removeCustomer: (state) => {
            state.customerName = "";
            state.customerPhone = "";
            state.guests = 0;
            state.table = null;
        },

        updateTable: (state, action) => {
            state.table = action.payload.table;
        }
    }
})

export const { setCustomer, removeCustomer, updateTable } = customerSlice.actions;
export default customerSlice.reducer;