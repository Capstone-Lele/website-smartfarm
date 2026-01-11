"use client";
import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { FiPlusCircle } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { LuSave } from "react-icons/lu";
import { RiResetRightLine } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { TbPencilMinus } from "react-icons/tb";
import { toast } from "sonner";
import { Combobox } from "@/components/combobox";
import { ROLE_LABEL } from "@/lib/constants/role";
import { User } from "@/types/user.types";
import { useUpdateUser } from "@/lib/api/service/users/useUser";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama pengguna wajib diisi" }),
  image: z
    .any()
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "Format file harus JPG atau PNG",
      }
    )
    .optional(),
  email: z.string().email({ message: "Email tidak valid" }),
  role: z.string().min(1, { message: "Role pengguna wajib diisi" }),
});

const EditUserModal = ({ user }: { user: User }) => {
  const userMutation = useUpdateUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      image: undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      image: undefined,
    });
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Submitting form with data:", data);
    // try {
    //   const res = await userMutation.mutateAsync({ id: user.id, data });
    //   form.reset();
    //   toast.success(res.message || "Pengguna berhasil diubah");
    // } catch (error: any) {
    //   toast.error("Gagal mengedit pengguna", {
    //     description: error?.message || "Silakan coba lagi.",
    //   });
    // }
  };

  return (
    <Sheet>
      <SheetTrigger className="h-8 w-8 p-0 cursor-pointer hover:bg-primary-surface text-black flex items-center justify-center rounded-md">
        <TbPencilMinus />
      </SheetTrigger>
      <SheetContent className="h-screen overflow-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader className="border-b">
          <SheetTitle>Edit Pengguna</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk mengedit pengguna.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="name">Nama Pengguna</FieldLabel>
                      <Input
                        id="name"
                        autoComplete="off"
                        placeholder="Contoh: Budi Santoso"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan nama pengguna.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="email">Email Pengguna</FieldLabel>
                      <Input
                        id="email"
                        autoComplete="off"
                        placeholder="Contoh: budi@gmail.com"
                        type="email"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan email pengguna.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="role">Role Pengguna</FieldLabel>
                      <Combobox
                        data={ROLE_LABEL}
                        onValueChange={field.onChange}
                        isLoading={userMutation.isPending}
                        name="Role"
                        selectedValue={field.value}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan role pengguna.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="image"
                  control={form.control}
                  render={({
                    field: { onChange, value, ...field },
                    fieldState,
                  }) => (
                    <Field>
                      <FieldLabel htmlFor="image">Image Pengguna</FieldLabel>
                      <Input
                        id="image"
                        autoComplete="off"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                        }}
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan image pengguna (Format: JPG, PNG). Kosongkan jika tidak ingin mengubah.
                        </FieldDescription>
                      )}
                      {/* Preview image - prioritas untuk file baru, fallback ke image lama */}
                      {value ? (
                        <img
                          src={URL.createObjectURL(value)}
                          alt="Preview"
                          className="mt-2 max-h-40 rounded-md object-cover"
                        />
                      ) : user.image ? (
                        <img
                          src={user.image}
                          alt="Current Image"
                          className="mt-2 max-h-40 rounded-md object-cover"
                        />
                      ) : null}
                    </Field>
                  )}
                />
                <Field orientation="vertical">
                  {userMutation.isPending ? (
                    <Button
                      disabled
                      className=" cursor-not-allowed mr-1 flex items-center"
                    >
                      <Spinner className="mr-2" />
                      Memproses...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className=" cursor-pointer mr-1 flex items-center"
                    >
                      <LuSave />
                      Simpan Perubahan
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className=" cursor-pointer flex items-center"
                    type="button"
                    onClick={() => form.reset()}
                  >
                    <RiResetRightLine />
                    Reset
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditUserModal;
