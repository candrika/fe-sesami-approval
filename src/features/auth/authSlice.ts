import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User{
    id:string|null,
    name:string|null,
    email:string|null,
    password:string|null,
    role:string|null
}

interface authSlice{
    token:string|null,
    user:User|null
}

const initialState:authSlice={
    token:null,
    user:null
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        login(state, action:PayloadAction<{user:User,token:string}>){
            state.token = action.payload.token
            state.user = action.payload.user
            localStorage.setItem('token',action.payload.token)
            localStorage.setItem('role',action.payload.user?.role || '')
            console.log(action)
        },
        logout(state){
            state.token = null
        }
    }
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer