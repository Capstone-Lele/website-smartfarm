"use client";
import React from "react";
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
import { useCreateKolam } from "@/lib/api/service/kolam/useKolam";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama kolam wajib diisi" }),
  kategori: z.string().min(1, { message: "Kategori wajib diisi" }),
  ukuran: z.string().min(1, { message: "Ukuran wajib diisi" }),
  kondisi: z.string().min(1, { message: "Kondisi wajib diisi" }),
  siklus: z.string().min(1, { message: "Siklus wajib diisi" }),
  ikan: z.number().min(0, { message: "Jumlah ikan minimal 0" }),
  kematian: z.number().min(0, { message: "Kematian minimal 0" }),
  umur: z.string().min(1, { message: "Umur wajib diisi" }),
  status_air: z.string().min(1, { message: "Status air wajib diisi" }),
});

const PostKolamModal = () => {
  const kolamMutation = useCreateKolam();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      kategori: "",
      ukuran: "",
      kondisi: "",
      siklus: "",
      ikan: 0,
      kematian: 0,
      umur: "",
      status_air: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting form with data:", data);
      const res = await kolamMutation.mutateAsync(data);
      form.reset();
      console.log("Kolam created:", res);
      toast.success("Kolam berhasil ditambahkan");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menambahkan kolam", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Tambah Kolam
      </SheetTrigger>
      <SheetContent>
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
