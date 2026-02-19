"use client";
import DefaultCard from "@/components/card/default-card";
import React, { useEffect, useState } from "react";
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
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { LuSave } from "react-icons/lu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import z from "zod";
import { useUserInfo } from "@/lib/api/service/auth/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { getAvatarUrl } from "@/lib/utils/avatar";
import { getDirtyValues } from "@/lib/utils/get-dirty-value";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RiResetRightLine } from "react-icons/ri";
import { useGetUserById, useUpdateUser } from "@/lib/api/service/users/useUser";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import ProfileSettingSkeleton from "@/components/sekeleton/profile-setting-skeleton";
import { toast } from "sonner";
import { getCookieDecryptedSession } from "@/lib/session";

const formSchema = z
  .object({
    name: z.string().min(1, "Nama pengguna wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: "Password minimal 6 karakter",
      }),
    role: z.string(),
    image: z
      .any()
      .refine(
        (file) =>
          !file || ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
        {
          message: "Format file harus JPG atau PNG",
        },
      ),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords tidak cocok",
    path: ["confirmPassword"],
  });

const page = () => {
  //   const { data, isLoading } = useUserInfo();
  const [idUser, setIdUser] = useState<string | null>(null);
  const { data, isLoading } = useGetUserById(idUser || "");
  const userMutation = useUpdateUser();
  const [tempImageValue, setTempImageValue] = useState<File | null>(null);
  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const userData = data?.data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      password: "",
      image: undefined,
      role: userData?.role || "",
      confirmPassword: "",
    },
  });
  const { isDirty, dirtyFields } = form.formState;

  useEffect(() => {
    const getIdUser = async () => {
      const idUser = await getCookieDecryptedSession();
      console.log("User ID:", idUser?.id);
      setIdUser(idUser?.id || null);
    };

    getIdUser();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const dirtyData = getDirtyValues(dirtyFields, values) as z.infer<
      typeof formSchema
    >;

    try {
      const res = await userMutation.mutateAsync({
        id: userData?.id || "",
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

  useEffect(() => {
    if (data) {
      form.reset({
        name: userData?.name || "",
        email: userData?.email || "",
        password: "",
        image: undefined,
        role: userData?.role || "",
        confirmPassword: "",
      });
    }
  }, [data, form]);

  if (isLoading) {
    return <ProfileSettingSkeleton />;
  }

  return (
    <>
      <DefaultCard>
        <div>
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="image"
                  control={form.control}
                  render={({
                    field: { onChange, value, ...field },
                    fieldState,
                  }) => (
                    <Field className="col-span-full">
                      <div className="flex flex-row items-center w-full gap-6">
                        {/* Preview image - prioritas untuk file baru, fallback ke image lama */}
                        <div className="mr-4">
                          {tempImageValue ? (
                            <Image
                              src={URL.createObjectURL(tempImageValue)}
                              alt="Preview"
                              className="mt-2 max-h-40 border border-primary rounded-full object-cover"
                              width={160}
                              height={160}
                            />
                          ) : userData?.image ? (
                            <Image
                              src={userData.image}
                              alt="Current Image"
                              className="mt-2 max-h-40 border border-primary rounded-full object-cover"
                              width={160}
                              height={160}
                            />
                          ) : (
                            <Image
                              src={getAvatarUrl(userData?.name || "User")}
                              alt="No Image"
                              className="mt-2 max-h-40 border border-primary rounded-full object-cover"
                              width={160}
                              height={160}
                            />
                          )}
                        </div>
                        <div className="space-y-3">
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
                              setTempImageValue(file || null);
                            }}
                            {...field}
                          />
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              Masukkan image (Format: JPG, PNG). Kosongkan jika
                              tidak ingin mengubah.
                            </FieldDescription>
                          )}
                        </div>
                      </div>
                    </Field>
                  )}
                />

                {/* Kolom Kiri */}
                <div className="space-y-6">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="name">Nama </FieldLabel>
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
                            Masukkan nama lengkap .
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
                        <FieldLabel htmlFor="email">Email </FieldLabel>
                        <Input
                          id="email"
                          autoComplete="off"
                          placeholder="Contoh: budi@gmail.com"
                          type="email"
                          className="bg-slate-100"
                          disabled
                          {...field}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>
                            Email tidak dapat diubah.
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
                        <FieldLabel htmlFor="role">Role </FieldLabel>
                        <Input
                          id="role"
                          autoComplete="off"
                          placeholder="Contoh: budi@gmail.com"
                          type="text"
                          disabled
                          className="bg-slate-100"
                          {...field}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>
                            Role tidak dapat diubah.
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-6">
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="password">
                          Password Baru
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="password"
                            placeholder="Masukkan password "
                            type={seePassword ? "text" : "password"}
                            autoComplete="new-password"
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
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="confirmPassword">
                          Konfirmasi Password Baru
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="confirmPassword"
                            placeholder="Masukkan password "
                            autoComplete="new-password"
                            type={seeConfirmPassword ? "text" : "password"}
                            {...field}
                          />
                          <InputGroupAddon
                            align={"inline-end"}
                            className=" cursor-pointer"
                            onClick={() =>
                              setSeeConfirmPassword(!seeConfirmPassword)
                            }
                          >
                            {seeConfirmPassword ? (
                              <FaRegEye />
                            ) : (
                              <FaRegEyeSlash />
                            )}
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>
                            Masukkan password baru.
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                  <Field className="">
                    <div className="flex flex-row items-center gap-2 mt-8 justify-end">
                      <Button
                        variant="outline"
                        className=" cursor-pointer flex items-center"
                        type="button"
                        onClick={() => form.reset()}
                      >
                        <RiResetRightLine />
                        Reset
                      </Button>
                      {userMutation.isPending ? (
                        <Button
                          disabled
                          className=" cursor-not-allowed mr-1 flex items-center w-fit"
                        >
                          <Spinner className="mr-2" />
                          Memproses...
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={!isDirty}
                          className=" cursor-pointer mr-1 flex items-center w-fit"
                        >
                          <LuSave />
                          Simpan
                        </Button>
                      )}
                    </div>
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      </DefaultCard>
    </>
  );
};

export default page;
