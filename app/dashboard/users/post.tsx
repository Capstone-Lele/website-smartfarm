"use client";
import React, { useState } from "react";
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
import {
  useCreateUnit,
  useUnit,
} from "@/lib/api/service/master-data/unit/useUnit";
import { toast } from "sonner";
import { useCreateProduct } from "@/lib/api/service/master-data/product/useProduct";
import { useCategory } from "@/lib/api/service/master-data/category/useCategory";
import { Combobox } from "@/components/combobox";
import { Unit } from "@/types/master-data/unit.types";
import { TYPE_PRODUCT } from "@/lib/constants/type-product";
import { ROLE_LABEL } from "@/lib/constants/role";
import { useCreateUser } from "@/lib/api/service/users/useUser";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama pengguna wajib diisi" }),
  image: z
    .any()
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "Format file harus JPG atau PNG",
      },
    ),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  role: z.string().min(1, { message: "Role pengguna wajib diisi" }),
});

const PostUserModal = () => {
  const userMutation = useCreateUser();
  const [seePassword, setSeePassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      password: "",
      image: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Submitting form with data:", data);
    try {
      console.log("Submitting form with data:", data);
      const res = await userMutation.mutateAsync(data);
      form.reset();
      console.log("User created:", res);
      toast.success("Pengguna berhasil ditambahkan");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menambahkan pengguna", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Tambah Pengguna
      </SheetTrigger>
      <SheetContent className=" h-screen overflow-auto">
        <SheetHeader className="border-b">
          <SheetTitle>Tambah Pengguna</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk menambahkan Pengguna baru.
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
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="password">Password Baru</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="password"
                          placeholder="Masukkan password anda"
                          type={seePassword ? "text" : "password"}
                          {...field}
                        />
                        <InputGroupAddon
                          align={"inline-end"}
                          className=" cursor-pointer"
                          onClick={() => setSeePassword(!seePassword)}
                        >
                          {seePassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan password baru. Kosongkan jika tidak ingin
                          mengubah.
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
                          Masukkan image pengguna (Format: JPG, PNG).
                        </FieldDescription>
                      )}
                      {/* Preview image */}
                      {value && (
                        <div className="border p-2 rounded-md">
                          <img
                            src={URL.createObjectURL(value)}
                            alt="Preview"
                            className="mt-2 max-h-40 rounded-md object-cover"
                          />
                        </div>
                      )}
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
                      Simpan
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

export default PostUserModal;
