"use client";
import React, { useEffect, useState } from "react";
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
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoLockClosedOutline } from "react-icons/io5";
import { getDirtyValues } from "@/lib/utils/get-dirty-value";

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
    )
    .optional(),
  password: z.string().optional(),
  email: z.string().email({ message: "Email tidak valid" }),
});

const EditUserModal = ({ user }: { user: User }) => {
  const userMutation = useUpdateUser();
  const [seePassword, setSeePassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      image: undefined,
    },
  });
  const { isDirty, dirtyFields } = form.formState;

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      password: "",
      image: undefined,
    });
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const dirtyData = getDirtyValues(dirtyFields, data) as z.infer<
      typeof formSchema
    >;
    // console.log("Dirty Data:", dirtyData);
    try {
      const res = await userMutation.mutateAsync({
        id: user.id,
        data: dirtyData,
      });
      form.reset();
      toast.success(res.message || "Pengguna berhasil diubah");
    } catch (error: any) {
      toast.error("Gagal mengedit pengguna", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="">
        <ButtonEditColumn />
      </SheetTrigger>
      <SheetContent
        className="h-screen overflow-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
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
                          Masukkan image pengguna (Format: JPG, PNG). Kosongkan
                          jika tidak ingin mengubah.
                        </FieldDescription>
                      )}
                      {/* Preview image - prioritas untuk file baru, fallback ke image lama */}
                      <div className="border p-2 rounded-md">
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
                      </div>
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
                      disabled={!isDirty}
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
