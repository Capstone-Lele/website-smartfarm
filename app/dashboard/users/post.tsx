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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { FiPlusCircle } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { LuSave } from "react-icons/lu";
import { RiResetRightLine } from "react-icons/ri";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { ROLE_LABEL } from "@/lib/constants/role";
import { useCreateUser } from "@/lib/api/service/users/useUser";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { Combobox } from "@/components/combobox";
import { usePool } from "@/lib/api/service/pools/usePool";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MdPool } from "react-icons/md";
import { toast } from "sonner";
import { poolsTranlate } from "@/lib/constants/category";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama pengguna wajib diisi" }),
  image: z
    .any()
    .refine(
      (file) => file instanceof File || (typeof window === "undefined" && file),
      {
        message: "Image pengguna wajib diisi",
      },
    )
    .refine(
      (file) =>
        file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "Format file harus JPG atau PNG",
      },
    ),
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter" })
    .regex(/^\S+$/, { message: "Password tidak boleh mengandung spasi" }),
  email: z.string().email({ message: "Email tidak valid" }),
  role: z.string().min(1, { message: "Role pengguna wajib diisi" }),
  permission: z.array(z.string()).min(1, "Minimal 1 permission harus dipilih"),
});

type FormData = z.infer<typeof formSchema>;

const PostUserModal = () => {
  const userMutation = useCreateUser();
  const [seePassword, setSeePassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchPool, setSearchPool] = useState("");
  const { data: poolData, isLoading: isPoolLoading } = usePool();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      password: "",
      image: undefined,
      permission: [] as string[],
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await userMutation.mutateAsync(data);
      form.reset();
      toast.success("Pengguna berhasil ditambahkan");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menambahkan pengguna", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  const pools = poolData?.data ?? [];
  const filteredPools = pools.filter((pool) =>
    pool.name.toLowerCase().includes(searchPool.toLowerCase()),
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Tambah Pengguna
      </SheetTrigger>
      <SheetContent className="h-screen overflow-auto w-full sm:max-w-3xl">
        <SheetHeader className="border-b">
          <SheetTitle>Tambah Pengguna</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk menambahkan Pengguna baru.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Two-column layout */}
            <div className="grid grid-cols-1 gap-4 items-start">
              {/* LEFT — form fields */}
              <div className="flex-1 min-w-0">
                <FieldSet>
                  <FieldGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="name">
                              Nama Pengguna
                            </FieldLabel>
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
                            <FieldLabel htmlFor="email">
                              Email Pengguna
                            </FieldLabel>
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
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="password"
                                placeholder="Masukkan password anda"
                                type={seePassword ? "text" : "password"}
                                {...field}
                              />
                              <InputGroupAddon
                                align={"inline-end"}
                                className="cursor-pointer"
                                onClick={() => setSeePassword(!seePassword)}
                              >
                                {seePassword ? <FaRegEye /> : <FaRegEyeSlash />}
                              </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : (
                              <FieldDescription>
                                Masukkan password pengguna.
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
                            <FieldLabel htmlFor="role">
                              Role Pengguna
                            </FieldLabel>
                            <Combobox
                              data={ROLE_LABEL}
                              onValueChange={field.onChange}
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
                            <FieldLabel htmlFor="image">
                              Image Pengguna
                            </FieldLabel>
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
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <Controller
                        name="permission"
                        control={form.control}
                        render={({ field, fieldState }) => {
                          const selectedIds: string[] = field.value ?? [];

                          const toggle = (id: string) => {
                            if (selectedIds.includes(id)) {
                              field.onChange(
                                selectedIds.filter((v) => v !== id),
                              );
                            } else {
                              field.onChange([...selectedIds, id]);
                            }
                          };

                          return (
                            <div className=" overflow-hidden">
                              {/* Header */}
                              <div className="flex justify-between bg-muted/60 px-3 py-2">
                                <div className="">
                                  <p className="text-xs font-semibold text-foreground">
                                    Akses Kolam
                                  </p>
                                  <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {selectedIds.length} kolam dipilih
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={
                                      selectedIds.length === pools.length
                                    }
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange(pools.map((p) => p.id));
                                      } else {
                                        field.onChange([]);
                                      }
                                    }}
                                  />
                                  <div className="text-xs font-semibold text-foreground">
                                    Semua Akses
                                  </div>
                                </div>
                              </div>

                              {/* Selected badges */}
                              {selectedIds.length > 0 && (
                                <div className="flex flex-wrap gap-1 px-2 py-2 bg-background">
                                  {selectedIds.map((id) => {
                                    const pool = pools.find((p) => p.id === id);
                                    return (
                                      <Badge
                                        key={id}
                                        variant="secondary"
                                        className="flex items-center gap-1 text-[10px] px-1.5 py-0.5"
                                      >
                                        <MdPool className="size-3 shrink-0" />
                                        <span className="truncate max-w-[80px]">
                                          {pool?.name ?? id}
                                        </span>
                                      </Badge>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Search Input */}
                              <div className="p-2 border-x border-t bg-muted/20">
                                <Input
                                  placeholder="Cari kolam berdasarkan nama..."
                                  value={searchPool}
                                  onChange={(e) =>
                                    setSearchPool(e.target.value)
                                  }
                                  className="h-8 text-xs bg-background"
                                />
                              </div>

                              {/* Checklist */}
                              <div className="divide-y relative">
                                {isPoolLoading ? (
                                  <div className="flex items-center justify-center py-6 text-muted-foreground text-xs gap-2 border-x border-b">
                                    <Spinner className="size-3" />
                                    Memuat...
                                  </div>
                                ) : filteredPools.length === 0 ? (
                                  <p className="text-center py-6 text-xs text-muted-foreground border-x border-b">
                                    Tidak ada kolam yang ditemukan, Tambahkan
                                    kolam dulu.
                                  </p>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 max-h-64 overflow-y-auto border-x border-b p-1">
                                    {filteredPools.map((pool) => {
                                      const checked = selectedIds.includes(
                                        pool.id,
                                      );
                                      return (
                                        <label
                                          key={pool.id}
                                          htmlFor={`pool-post-${pool.id}`}
                                          className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-muted/50 transition-colors border rounded-sm"
                                        >
                                          <Checkbox
                                            id={`pool-post-${pool.id}`}
                                            checked={checked}
                                            onCheckedChange={() =>
                                              toggle(pool.id)
                                            }
                                          />
                                          <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-medium truncate">
                                              {pool.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground capitalize">
                                              {poolsTranlate(pool.category)}
                                            </span>
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              {fieldState.invalid && (
                                <div className="px-3 pb-2">
                                  <FieldError errors={[fieldState.error]} />
                                </div>
                              )}
                            </div>
                          );
                        }}
                      />
                    </div>

                    <div className="flex flex-col-reverse justify-end sm:flex-row gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto cursor-pointer flex items-center justify-center"
                        type="button"
                        onClick={() => form.reset()}
                      >
                        <RiResetRightLine className="mr-2" />
                        Reset
                      </Button>
                      {userMutation.isPending ? (
                        <Button
                          disabled
                          className="w-full sm:w-auto cursor-not-allowed flex items-center justify-center"
                        >
                          <Spinner className="mr-2" />
                          Memproses...
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="w-full sm:w-auto cursor-pointer flex items-center justify-center"
                        >
                          <LuSave className="mr-2" />
                          Simpan
                        </Button>
                      )}
                    </div>
                  </FieldGroup>
                </FieldSet>
              </div>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PostUserModal;
