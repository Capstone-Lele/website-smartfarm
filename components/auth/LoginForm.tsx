"use client";

import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import Image from "next/image";
import { IoLockClosedOutline } from "react-icons/io5";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/lib/api/service/auth/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z
    .string()
    .min(8, { message: "Password harus terdiri dari minimal 8 karakter" }),
});

const LoginForm = () => {
  const route = useRouter();
  const [seePassword, setSeePassword] = useState(false);
  const loginMutation = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      toast.success("Login berhasil!");
      // timeout sebentar sebelum redirect
      await new Promise((resolve) => setTimeout(resolve, 1000));
      route.push("/dashboard");
    } catch (error: any) {
      toast.error("Login Gagal", {
        description: error?.message || "Login gagal. Silakan coba lagi.",
      });
    }
  };

  return (
    <section className="w-full h-full overflow-auto">
      <div className="mx-12 py-12 flex flex-col justify-between h-full">
        <div className="flex items-center gap-4 -mx-6 -mt-4">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={35}
            height={35}
            className=" rounded-md"
          />
          <h3 className=" font-semibold text-xl ">LeleKu</h3>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>
                <span className="text-2xl">Selamat Datang</span>
              </FieldLegend>
              <FieldDescription>
                Mohon masukkan email dan password yang valid untuk masuk ke akun
                anda.
              </FieldDescription>
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="checkout-7j9-email-43j">
                        Email
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <MdOutlineAlternateEmail />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="checkout-7j9-email-43j"
                          placeholder="Masukkan email anda"
                          {...field}
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="checkout-7j9-password-43j">
                        Password
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <IoLockClosedOutline />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="checkout-7j9-password-43j"
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
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
            <Field orientation="vertical">
              {loginMutation.isPending ? (
                <Button className="w-full cursor-pointer" disabled>
                  <Spinner className="mr-2" />
                  Loading ...
                </Button>
              ) : (
                <Button className="w-full cursor-pointer" type="submit">
                  Sign In
                </Button>
              )}
              <Button
                className="w-full cursor-pointer"
                variant="outline"
                type="button"
              >
                Kembali Ke Beranda
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <div className=" -mx-6 -mb-6">
          <span className="text-gray-400 text-sm">
            Copyright © {new Date().getFullYear()} Leleku. All rights reserved.
          </span>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
