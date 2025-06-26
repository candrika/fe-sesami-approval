import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from '../../lib/axios'
import { toast } from 'sonner';

export interface Leave{
    id:string,
    title:string,
    description:string,
    status:'terima'|'tolak'|'revisi'|'batal'
}

interface LeaveState{
    leaveList:Leave[],
    loading:boolean,
    error:string|null
}

const initialState:LeaveState={
    leaveList:[],
    loading:false,
    error:null
}

export const fetchLeave = createAsyncThunk("leave/fetch",async(_,thunkAPI)=>{
    try{
        const res = await instance.get('/leave/list')
        return res.data
    }catch(err:any){
        return thunkAPI.rejectWithValue(err.response.data)
    }
});

export const storeLeave = createAsyncThunk("leave/store",async(data:Partial<Leave>,thunkAPI)=>{
    try{
        const res = await instance.post('leave',data)
        toast.success("Izin berhasil diajukan")
        return res.data
    }catch(err:any){
        toast.error("Gagal mengajukan izin")
        return thunkAPI.rejectWithValue(err.response.data)
    }
});

export const updateLeave = createAsyncThunk("leave/update", async ({ id, data }: { id: string; data: Partial<Leave> }, thunkAPI)=>{
    try{
        const res = await instance.put(`leave/${id}`,data)
        toast.success("Izin berhasil diperbarui")
        return res.data
    }catch(err:any){
        toast.error("Gagal memperbarui izin")
        return thunkAPI.rejectWithValue(err.response.data)
    }
})

export const deleteLeave = createAsyncThunk("leave/delete", async(id:string, thunkAPI)=>{
    try{
        await instance.delete(`leave/${id}`)
        toast.success("Izin berhasil dihapus")
    }catch(err:any){
        toast.error("Gagal menghapus izin")
        return thunkAPI.rejectWithValue(err.response.data)
    }
});

export const confirmLeave = createAsyncThunk("leave/confirm",async({id, status}:{id:string, status:string}, _thunkAPI)=>{
    try{
        const res = await instance.put(`leave/${id}/status`,{status})
        toast.success('Status izin diperbarui')
        return res.data
    }catch(err:any){
        toast.error('Gagal memperbarui status')
    }
})

const leaveSlice = createSlice({
    name:'leave',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchLeave.pending,(state)=>{
            state.loading=true
            console.log(fetchLeave)
        })
        .addCase(fetchLeave.fulfilled, (state, action)=>{
            state.leaveList = action.payload;
            state.loading=false
        })
        .addCase(fetchLeave.rejected, (state, action)=>{
            state.loading=false
            state.error=action.payload as string
        })
        .addCase(storeLeave.fulfilled, (state, action)=>{
            state.leaveList.push(action.payload)
        })
        .addCase(updateLeave.fulfilled, (state, action)=>{
            const index = state.leaveList.findIndex((i)=>i.id===action.payload.id)
            if(index !== -1){
                state.leaveList[index]=action.payload
            }
        })
        .addCase(deleteLeave.fulfilled, (state, action)=>{
            state.leaveList = state.leaveList.filter((izin)=>izin.id!==action.payload)
        })
        .addCase(confirmLeave.fulfilled, (state, action)=>{
            const index = state.leaveList.findIndex((i)=>i.id===action.payload.id)
            if(index !== -1){
                state.leaveList[index]=action.payload
            }
        })
    }
})

export default leaveSlice.reducer