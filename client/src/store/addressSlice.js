import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    adressList : []
}

const addressSlice = createSlice({
    name : 'adress',
    initialState : initialValue,
    reducers : {
        handleAddAdress : (state , action)=>{
            state.adressList = [...action.payload]
        }
    }
})

export const {handleAddAdress} = addressSlice.actions

export default addressSlice.reducer