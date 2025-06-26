import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import instance from "@/lib/axios"

import { Settings } from "lucide-react"
import { useEffect, useState } from "react"

export function SheetDemo() {

  const [form, setForm] = useState({
    id:'',
    name:'',
    email:'',
    password:''
  })

  useEffect(()=>{
    const profile = async()=>{
        const resp = await instance.get('/profile')
        console.log(resp.data)
        setForm({
            id:resp.data.id,
            name:resp.data?.name || null,
            email:resp.data?.email,
            password:""
        })
    }
    profile()
  },[])

  const saveProfile = async(e:React.FormEvent)=>{
    e.preventDefault()
    const resp = await instance(`profile/${form.id}/update`);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button>
            <Settings  className="animate-spin"/>
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={saveProfile}>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
                <Label htmlFor="sheet-demo-name">Name</Label>
                <Input name="name" value={form.name} id="sheet-demo-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">Email</Label>
                <Input name="email" value={form.email} id="sheet-demo-email" type="email"/>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="sheet-demo-username">password</Label>
                <Input name="email" id="sheet-demo-password" type="password" />
            </div>
            </div>
            <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose asChild>
                <Button variant="outline">Close</Button>
            </SheetClose>
            </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
