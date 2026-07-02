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
import { LuCylinder, LuSave } from "react-icons/lu";
import { RiResetRightLine } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { TbPencilMinus } from "react-icons/tb";
import { Pool } from "@/types/pool.types";
import { toast } from "sonner";
import { usePool, useUpdatePool } from "@/lib/api/service/pools/usePool";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { TbRectangularPrism } from "react-icons/tb";
import { POOLS_CATEGORY } from "@/lib/constants/category";
import { Combobox } from "@/components/combobox";

const optionalPositiveNumber = (fieldName: string) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const str = String(val).trim();
      if (str === "") return undefined;
      const num = Number(str);
      if (isNaN(num)) return str; // kembalikan string agar zod bisa lempar error "harus berupa angka"
      return num;
    },
    z.union([
      z
        .number({ error: `${fieldName} harus berupa angka` })
        .positive({ message: `${fieldName} harus lebih besar dari 0` })
        .max(1000, { message: `${fieldName} terlalu besar` }),
      z.undefined(),
    ]),
  );

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Nama kolam wajib diisi" }),
    category: z.string().min(1, { message: "Kategori wajib diisi" }),
    type: z.enum(["bundar", "persegi"]),
    length: optionalPositiveNumber("Panjang"),
    width: optionalPositiveNumber("Lebar"),
    height: optionalPositiveNumber("Tinggi"),
    diameter: optionalPositiveNumber("Diameter"),
  })
  .superRefine((data, ctx) => {
    if (data.type === "bundar") {
      if (data.diameter === undefined) {
        ctx.addIssue({
          path: ["diameter"],
          code: z.ZodIssueCode.custom,
          message: "Diameter wajib diisi untuk kolam bundar",
        });
      }
      if (data.height === undefined) {
        ctx.addIssue({
          path: ["height"],
          code: z.ZodIssueCode.custom,
          message: "Tinggi wajib diisi untuk kolam bundar",
        });
      }
    } else if (data.type === "persegi") {
      if (data.length === undefined) {
        ctx.addIssue({
          path: ["length"],
          code: z.ZodIssueCode.custom,
          message: "Panjang wajib diisi untuk kolam persegi",
        });
      }
      if (data.width === undefined) {
        ctx.addIssue({
          path: ["width"],
          code: z.ZodIssueCode.custom,
          message: "Lebar wajib diisi untuk kolam persegi",
        });
      }
      if (data.height === undefined) {
        ctx.addIssue({
          path: ["height"],
          code: z.ZodIssueCode.custom,
          message: "Tinggi wajib diisi untuk kolam persegi",
        });
      }
    }
  });

const EditPoolModal = ({ pool }: { pool: Pool }) => {
  const { data: dataPool, isLoading, error } = usePool();
  const poolMutation = useUpdatePool();
  const [isOpen, setIsOpen] = useState(false);

  const initialType = pool.diameter ? "bundar" : "persegi";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pool.name,
      category: pool.category,
      type: initialType as "bundar" | "persegi",
      length: pool.length ?? ("" as any),
      width: pool.width ?? ("" as any),
      height: pool.height ?? ("" as any),
      diameter: pool.diameter ?? ("" as any),
    },
  });

  const poolType = form.watch("type");
  const isCirclePool = poolType === "bundar";

  useEffect(() => {
    form.reset({
      name: pool.name,
      category: pool.category,
      type: pool.diameter ? "bundar" : "persegi",
      length: pool.length ?? ("" as any),
      width: pool.width ?? ("" as any),
      height: pool.height ?? ("" as any),
      diameter: pool.diameter ?? ("" as any),
    });
  }, [pool, form]);

  useEffect(() => {
    if (isCirclePool) {
      form.setValue("length", undefined);
      form.setValue("width", undefined);
      form.clearErrors(["length", "width"]);
    } else {
      form.setValue("diameter", undefined);
      form.clearErrors(["diameter"]);
    }
  }, [isCirclePool]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // check if pool with the same name already exists    const nameExists = dataPool?.some(
    const nameExists = dataPool?.data?.some(
      (p: Pool) =>
        p.name.toLowerCase() === data.name.toLowerCase() && p.id !== pool.id,
    );
    if (nameExists) {
      toast.error("Nama kolam sudah digunakan", {
        description: "Silakan gunakan nama lain.",
      });
      return;
    }
    const dataPrep = {
      name: data.name,
      category: data.category,
      height: data.height,
      diameter: data.type === "bundar" ? data.diameter : undefined,
      length: data.type === "persegi" ? data.length : undefined,
      width: data.type === "persegi" ? data.width : undefined,
    };
    try {
      Object.entries(dataPrep).forEach(([key, value]) => {
        if (value === undefined) {
          delete dataPrep[key as keyof typeof dataPrep];
        }
      });
      const res = await poolMutation.mutateAsync({
        id: pool.id,
        data: dataPrep,
      });
      form.reset();
      toast.success(res.message || "Kolam berhasil diubah");
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Gagal mengedit kolam", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <ButtonEditColumn />
      </SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader className="border-b">
          <SheetTitle>Edit Kolam</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk mengedit kolam.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="name">Nama Kolam</FieldLabel>
                      <Input
                        id="name"
                        autoComplete="off"
                        disabled
                        placeholder="Contoh: Kolam A"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan nama kolam.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="category">Kategori</FieldLabel>
                      <Combobox
                        data={POOLS_CATEGORY}
                        onValueChange={field.onChange}
                        name="category"
                        selectedValue={field.value}
                        disable={pool.cycle === "active_cultivation"}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          {pool.cycle === "active_cultivation"
                            ? "Tidak bisa mengubah kategori kolam karena sedang dalam masa budidaya."
                            : "Masukkan kategori kolam."}
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <div className="space-y-2">
                  <FieldLabel>Tipe Kolam</FieldLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div
                      onClick={() => {
                        form.setValue("type", "bundar");
                      }}
                      className={`flex flex-col border rounded-md items-center gap-2 p-2 cursor-pointer hover:bg-primary-surface ${isCirclePool ? "bg-primary-surface" : ""}`}
                    >
                      <LuCylinder size={30} />
                      <span>Kolam Bundar</span>
                    </div>
                    <div
                      onClick={() => {
                        form.setValue("type", "persegi");
                      }}
                      className={`flex flex-col border rounded-md items-center gap-2 p-2 cursor-pointer hover:bg-primary-surface ${!isCirclePool ? "bg-primary-surface" : ""}`}
                    >
                      <TbRectangularPrism size={30} />
                      <span>Kolam Persegi</span>
                    </div>
                  </div>
                  <FieldDescription>
                    Pilih tipe kolam yang akan ditambahkan.
                  </FieldDescription>
                </div>
                {isCirclePool ? (
                  <Controller
                    name="diameter"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="diameter">Diameter (m)</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="diameter"
                            type="text"
                            inputMode="decimal"
                            placeholder="Contoh: 5.5"
                            {...field}
                          />
                          <InputGroupAddon align={"inline-end"}>
                            <Separator orientation="vertical" className="h-6" />
                            meter
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>
                            Masukkan diameter kolam dalam meter.
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                ) : (
                  <>
                    <Controller
                      name="length"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="length">Panjang (m)</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              id="length"
                              type="text"
                              inputMode="decimal"
                              placeholder="Contoh: 10.0"
                              {...field}
                            />
                            <InputGroupAddon align={"inline-end"}>
                              <Separator
                                orientation="vertical"
                                className="h-6"
                              />
                              meter
                            </InputGroupAddon>
                          </InputGroup>
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              Masukkan panjang kolam dalam meter.
                            </FieldDescription>
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="width"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="width">Lebar (m)</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              id="width"
                              type="text"
                              inputMode="decimal"
                              placeholder="Contoh: 5.0"
                              {...field}
                            />
                            <InputGroupAddon align={"inline-end"}>
                              <Separator
                                orientation="vertical"
                                className="h-6"
                              />
                              meter
                            </InputGroupAddon>
                          </InputGroup>
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              Masukkan lebar kolam dalam meter.
                            </FieldDescription>
                          )}
                        </Field>
                      )}
                    />
                  </>
                )}
                <Controller
                  name="height"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="height">Tinggi (m)</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="height"
                          type="text"
                          inputMode="decimal"
                          placeholder="Contoh: 1.5"
                          {...field}
                        />
                        <InputGroupAddon align={"inline-end"}>
                          <Separator orientation="vertical" className="h-6" />
                          meter
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan tinggi kolam dalam meter.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <div className="flex flex-col-reverse justify-end sm:flex-row gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto cursor-pointer flex items-center justify-center"
                    type="button"
                    onClick={() =>
                      form.reset({
                        name: pool.name,
                        category: pool.category,
                        type: pool.diameter ? "bundar" : "persegi",
                        length: pool.length ?? ("" as any),
                        width: pool.width ?? ("" as any),
                        height: pool.height ?? ("" as any),
                        diameter: pool.diameter ?? ("" as any),
                      })
                    }
                  >
                    <RiResetRightLine className="mr-2" />
                    Reset
                  </Button>
                  {poolMutation.isPending ? (
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
                      Simpan Perubahan
                    </Button>
                  )}
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditPoolModal;
