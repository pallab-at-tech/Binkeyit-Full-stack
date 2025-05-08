import { createSlice } from "@reduxjs/toolkit"

const intialState = {
    cart : []
}

const cartSlice = createSlice({
    name : "CartItem",
    initialState : intialState,
    reducers : {
        handleAddItemCart : (state , action)=>{
            state.cart = [...action.payload]
        }
    }
})

export const {handleAddItemCart} = cartSlice.actions
export default cartSlice.reducer