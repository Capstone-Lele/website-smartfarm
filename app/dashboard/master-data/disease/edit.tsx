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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LuSave } from "react-icons/lu";
import { RiResetRightLine } from "react-icons/ri";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { Disease } from "@/types/master-data/disease.types";
import { toast } from "sonner";
import { useUpdateDisease, useDisease } from "@/lib/api/service/master-data/disease/useDisease";
import ButtonEditColumn from "@/components/button-column/button-edit-column";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama penyakit wajib diisi" }),
  description: z.string().min(1, { message: "Deskripsi penyakit wajib diisi" }),
});

const EditDiseaseModal = ({ disease }: { disease: Disease }) => {
  const diseaseMutation = useUpdateDisease();
  const { data: diseaseData } = useDisease();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: disease.name,
      description: disease.description || "",
    },
  });
  const { isDirty } = form.formState;

  useEffect(() => {
    form.reset({
      name: disease.name,
      description: disease.description || "",
    });
  }, [disease, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const isDuplicate = diseaseData?.data?.some(
      (d) => d.name.toLowerCase() === data.name.toLowerCase() && d.id !== disease.id
    );

    if (isDuplicate) {
      form.setError("name", {
        type: "manual",
        message: "Nama penyakit sudah ada",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);

      const res = await diseaseMutation.mutateAsync({
        id: disease.id,
        data: formData as any,
      });
      form.reset();
      toast.success(res.message || "Penyakit berhasil diubah");
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Gagal mengedit penyakit", {
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
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Edit Penyakit</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk mengedit penyakit.
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
                      <FieldLabel htmlFor="name">Nama Penyakit</FieldLabel>
                      <Input
                        id="name"
                        autoComplete="off"
                        placeholder="Contoh: Berak Putih"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan nama penyakit.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                      <Textarea
                        id="description"
                        placeholder="Deskripsi tentang penyakit ini"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan deskripsi penyakit.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Field orientation="vertical">
                  {diseaseMutation.isPending ? (
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
                      <LuSave className="mr-2" />
                      Simpan Perubahan
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className=" cursor-pointer flex items-center"
                    type="button"
                    onClick={() => form.reset()}
                  >
                    <RiResetRightLine className="mr-2" />
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

export default EditDiseaseModal;
