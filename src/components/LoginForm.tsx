import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchemaType } from "@/schemas/loginSchema";

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
import { useDispatch } from "react-redux";
import instance from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { login } from "@/features/auth/authSlice";

import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
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

  const loginProcess = async (data: LoginSchemaType) => {
    try {
      const process = await instance.post("/login", data);
      const { token, user } = process.data;
      dispatch(login({ token, user }));
      toast(process.data.message)
      navigate("/");
    } catch (err) {
      console.error("Login gagal", err);
      toast(err.response.data.message)
    } 
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(loginProcess)} className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@mail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a className="ml-auto text-sm underline hover:no-underline">
                  Lupa Password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="**********"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="link"
                  size="icon"
                  onClick={() => setShow((prev) => !prev)}
                  className="absolute right-1 top-1 text-muted-foreground"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" variant="destructive" className="w-full">
              Login
            </Button>
            <div className="mt-2 text-center text-sm">
              Belum punya akun?{" "}
              <a href="/register" className="underline underline-offset-4">
                Daftar
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
