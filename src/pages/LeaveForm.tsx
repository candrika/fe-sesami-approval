import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leaveSchema, type LeaveSchemaType } from "@/schemas/leaveSchema";

import { useNavigate, Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import instance from "@/lib/axios";

const LeaveForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LeaveSchemaType>({
    resolver: zodResolver(leaveSchema)
  });

  const onSubmit = async (data: LeaveSchemaType) => {
    const response = await instance.post("leave", data);
    if (response.status === 200) {
      navigate("/");
    }
  };

  return (
    <div className="w-full max-w-screen min-h-screen px-3 py-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Buat Pengajuan</CardTitle>
          <CardAction>
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <Link to="/">
                <X />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6 mb-3">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Judul Izin"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Alasan pengajuan"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 mt-3">
            <Button variant="outline" size="sm" className="bg-red-500 text-white">
              <Link to="/">Cancel</Link>
            </Button>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="bg-blue-500 text-white"
            >
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LeaveForm;
