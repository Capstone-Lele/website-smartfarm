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
      return val;
    },
    z.union([
      z.coerce
        .number({ error: `${fieldName} harus berupa angka` })
        .positive({ message: `${fieldName} harus lebih besar dari 0` })
        .max(1000, { message: `${fieldName} terlalu besar` }),
      z.undefined(),
    ]),
  );

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama kolam wajib diisi" }),
  category: z.string().min(1, { message: "Kategori wajib diisi" }),
  length: optionalPositiveNumber("Panjang"),
  width: optionalPositiveNumber("Lebar"),
  height: optionalPositiveNumber("Tinggi"),
  diameter: optionalPositiveNumber("Diameter"),
});

const EditPoolModal = ({ pool }: { pool: Pool }) => {
  const { data:dataPool, isLoading, error } = usePool();
  const poolMutation = useUpdatePool();
  const [isCirclePool, setIsCirclePool] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pool.name,
      category: pool.category,
      length: pool.length ?? ("" as any),
      width: pool.width ?? ("" as any),
      height: pool.height ?? ("" as any),
      diameter: pool.diameter ?? ("" as any),
    },
  });

  useEffect(() => {
    form.reset({
      name: pool.name,
      category: pool.category,
      length: pool.length ?? ("" as any),
      width: pool.width ?? ("" as any),
      height: pool.height ?? ("" as any),
      diameter: pool.diameter ?? ("" as any),
    });
  }, [pool, form]);

  useEffect(() => {
    if (pool.diameter) {
      setIsCirclePool(true);
    } else {
      setIsCirclePool(false);
    }
  }, [pool]);

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
      diameter: isCirclePool ? data.diameter : undefined,
      length: !isCirclePool ? data.length : undefined,
      width: !isCirclePool ? data.width : undefined,
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
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan kategori kolam.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <div className="space-y-2">
                  <FieldLabel>Tipe Kolam</FieldLabel>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div
                      onClick={() => {
                        setIsCirclePool(true);
                      }}
                      className={`flex flex-col border rounded-md items-center gap-2 p-2 cursor-pointer hover:bg-primary-surface ${isCirclePool ? "bg-primary-surface" : ""}`}
                    >
                      <LuCylinder size={30} />
                      <span>Kolam Bundar</span>
                    </div>
                    <div
                      onClick={() => {
                        setIsCirclePool(false);
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
                            type="number"
                            step="0.01"
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
                              type="number"
                              step="0.01"
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
                              type="number"
                              step="0.01"
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
                          type="number"
                          step="0.01"
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
                <Field orientation="vertical">
                  {poolMutation.isPending ? (
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

export default EditPoolModal;
