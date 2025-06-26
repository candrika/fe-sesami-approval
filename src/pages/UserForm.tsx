import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserSchemaType } from "@/schemas/userSchema";

import { useNavigate, Link } from "react-router-dom";
import { X, Eye, EyeOff } from "lucide-react";

import { useState } from "react";
import instance from "@/lib/axios";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserForm = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      roles: "User",
    },
  });

  const onSubmit = async (data: UserSchemaType) => {
    const process = await instance.post(`admin/create/user`, data);
    if (process.status === 201) {
      console.log(process.data.message);
      navigate("/users");
    }
  };

  return (
    <div className="w-full max-w-screen min-h-screen px-3 py-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Pendaftaran User</CardTitle>
          <CardAction>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
            >
              <Link to="/users">
                <X />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6 mb-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Chandrika Eka"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6 mb-3">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6 mb-3">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    placeholder="********"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="link"
                    size="icon"
                    onClick={() => setShow(!show)}
                    className="absolute right-1 top-1 text-muted-foreground"
                  >
                    {show ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6 mb-3">
              <div className="grid gap-2">
                <Label htmlFor="role">Role User</Label>
                <Select
                  disabled
                  defaultValue="User"
                  onValueChange={(value) => setValue("roles", value as "User")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Verifikator">Verifikator</SelectItem>
                  </SelectContent>
                </Select>
                {errors.roles && (
                  <p className="text-sm text-red-500">{errors.roles.message}</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-white bg-red-500"
            >
              <Link to="/users">Cancel</Link>
            </Button>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="text-white bg-blue-500"
            >
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;
