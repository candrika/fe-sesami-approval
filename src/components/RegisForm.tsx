import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchemaType } from "@/schemas/registerSchema";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "@/lib/axios";
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export default function RegisForm({ className, ...props }: React.ComponentProps<"div">) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const toast = (message: any)=>{
      Toastify({
        duration: 3000,
        text:message,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
  }

  const registerProcess = async(data: RegisterSchemaType) => {
    console.log("Form berhasil:", data);
     try {
      const process = await instance.post("/register", data);
      

      toast(process.data.message)
      navigate("/");
    } catch (err) {
      // console.error("Register gagal", err.response.data.message);
      toast(err.response.data.message)
    } 
  
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Please Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(registerProcess)} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Nama lengkap"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="your@mail.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  {...register("password")}
                  placeholder="********"
                />
                <Button
                  type="button"
                  variant="link"
                  size="icon"
                  onClick={() => setShow(!show)}
                  className="absolute right-1 top-1 text-muted-foreground"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <Button type="submit" variant="destructive" className="w-full">
              Register
            </Button>

            <div className="mt-2 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
