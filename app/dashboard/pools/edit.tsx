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
import { Kolam } from "@/types/kolam.types";
import { toast } from "sonner";
import { useUpdateKolam } from "@/lib/api/service/kolam/useKolam";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama kolam wajib diisi" }),
  kategori: z.string().min(1, { message: "Kategori wajib diisi" }),
  ukuran: z.string().min(1, { message: "Ukuran wajib diisi" }),
  kondisi: z.string().min(1, { message: "Kondisi wajib diisi" }),
  siklus: z.string().min(1, { message: "Siklus wajib diisi" }),
  ikan: z.coerce.number().min(0, { message: "Jumlah ikan minimal 0" }),
  kematian: z.coerce.number().min(0, { message: "Kematian minimal 0" }),
  umur: z.string().min(1, { message: "Umur wajib diisi" }),
  status_air: z.string().min(1, { message: "Status air wajib diisi" }),
});

const EditKolamModal = ({ kolam }: { kolam: Kolam }) => {
  const kolamMutation = useUpdateKolam();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: kolam.name,
      kategori: kolam.kategori,
      ukuran: kolam.ukuran,
      kondisi: kolam.kondisi,
      siklus: kolam.siklus,
      ikan: kolam.ikan,
      kematian: kolam.kematian,
      umur: kolam.umur,
      status_air: kolam.status_air,
    },
  });

  useEffect(() => {
    form.reset({
      name: kolam.name,
      kategori: kolam.kategori,
      ukuran: kolam.ukuran,
      kondisi: kolam.kondisi,
      siklus: kolam.siklus,
      ikan: kolam.ikan,
      kematian: kolam.kematian,
      umur: kolam.umur,
      status_air: kolam.status_air,
    });
  }, [kolam, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await kolamMutation.mutateAsync({ id: kolam.id, data });
      form.reset();
      toast.success(res.message || "Kolam berhasil diubah");
    } catch (error: any) {
      toast.error("Gagal mengedit kolam", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="h-8 w-8 p-0 cursor-pointer hover:bg-primary-surface text-black flex items-center justify-center rounded-md">
        <TbPencilMinus />
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
                  name="kategori"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="kategori">Kategori</FieldLabel>
                      <Input
                        id="kategori"
                        autoComplete="off"
                        placeholder="Contoh: Pembesaran"
                        {...field}
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
                <Controller
                  name="ukuran"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="ukuran">Ukuran</FieldLabel>
                      <Input
                        id="ukuran"
                        autoComplete="off"
                        placeholder="Contoh: 10m x 5m"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan ukuran kolam.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="kondisi"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="kondisi">Kondisi</FieldLabel>
                      <Input
                        id="kondisi"
                        autoComplete="off"
                        placeholder="Contoh: Aktif Budidaya"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan kondisi kolam.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="siklus"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="siklus">Siklus</FieldLabel>
                      <Input
                        id="siklus"
                        type="date"
                        autoComplete="off"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan tanggal siklus.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="ikan"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="ikan">Jumlah Ikan</FieldLabel>
                      <Input
                        id="ikan"
                        type="number"
                        autoComplete="off"
                        placeholder="Contoh: 20000"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan jumlah ikan.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="kematian"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="kematian">Kematian</FieldLabel>
                      <Input
                        id="kematian"
                        type="number"
                        autoComplete="off"
                        placeholder="Contoh: 150"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan jumlah kematian ikan.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="umur"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="umur">Umur</FieldLabel>
                      <Input
                        id="umur"
                        autoComplete="off"
                        placeholder="Contoh: 2 bulan"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>Masukkan umur ikan.</FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="status_air"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="status_air">Status Air</FieldLabel>
                      <Input
                        id="status_air"
                        autoComplete="off"
                        placeholder="Contoh: Baik"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan status kualitas air.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Field orientation="vertical">
                  {kolamMutation.isPending ? (
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

export default EditKolamModal;
