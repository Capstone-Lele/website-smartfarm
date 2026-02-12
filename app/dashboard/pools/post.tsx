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
import { useCreatePool } from "@/lib/api/service/pools/usePool";
import { toast } from "sonner";
import { POOLS_CATEGORY } from "@/lib/constants/category";
import { Combobox } from "@/components/combobox";
import { TbRectangularPrism } from "react-icons/tb";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { he } from "zod/v4/locales";

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

const PostKolamModal = () => {
  const poolMutation = useCreatePool();
  const [isCirclePool, setIsCirclePool] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      length: "" as any,
      width: "" as any,
      height: "" as any,
      diameter: "" as any,
    },
  });

  useEffect(() => {
    if (isCirclePool) {
      form.setValue("length", undefined);
      form.setValue("width", undefined);
    } else {
      form.setValue("diameter", undefined);
    }
  }, [isCirclePool]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
      const res = await poolMutation.mutateAsync(dataPrep);
      form.reset();
      toast.success("Pool berhasil ditambahkan");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menambahkan pool", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Tambah Kolam
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader className="border-b">
          <SheetTitle>Tambah Kolam</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk menambahkan kolam baru.
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

export default PostKolamModal;
