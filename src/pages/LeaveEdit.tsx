import {useState, useEffect, type FormEvent} from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import instance from '@/lib/axios';

type Leave ={
    id:number,
    title:string,
    description:string,
    status:string
}

const LeaveEdit =()=>{
    const { id } = useParams<{id:string}>()

    const navigate = useNavigate()

    const [form, setForm] = useState({
        title:null,
        description:null
    })

    useEffect(()=>{

        const list = async()=>{
            const resp = await instance.get('/leave/'+id);
            let data = resp.data.data[0]
            setForm({
                title:data.title,
                description:data.description
            })
        }

        list()

    },[])

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit=async(e:FormEvent)=>{
        e.preventDefault()
        let process = await instance.put('/leave/'+id,form);

        // console.log(process)
        if(process.status==200){
            navigate('/')
        }
    }

    return(
        <div className='w-full max-w-screen min-h-screen px-3 py-4'>
            <Card className='w-full max-w-sm'>
                <CardHeader>
                    <CardTitle>Edit Pengajuan</CardTitle>
                    <CardAction>
                        <Button variant="ghost" size="icon" className='size-8 rounded-full'>
                            <Link to="/">
                                <X />
                            </Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                <CardContent>
                        <div className="flex flex-col gap-6 mb-3">
                            <div className="grid gap-2">
                                <Label htmlFor='title'>Title</Label>
                                <Input name="title" id="title" type="text" value={form?.title || ''} placeholder="Izin Sakit" required onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor='description'>Description</Label>
                                <Textarea name="description" id="description" value={form?.description || ''} placeholder="Izin saya" required onChange={handleChange}/>
                            </div>
                        </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 my-3">
                    <Button variant="outline" size="sm" className="text-white bg-red-500">
                    <Link to="/">Cancel</Link>
                    </Button>
                    <Button type="submit" variant="outline" size="sm" className="text-white bg-blue-500">
                    Save
                    </Button>
                </CardFooter>
                </form>
            </Card>
        </div>
    )
} 

export default LeaveEdit;