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
import { Unit } from "@/types/master-data/unit.types";
import { toast } from "sonner";
import { useUpdateUnit } from "@/lib/api/service/master-data/unit/useUnit";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import { getDirtyValues } from "@/lib/utils/get-dirty-value";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama satuan wajib diisi" }),
});

const EditUnitModal = ({ unit }: { unit: Unit }) => {
  const unitMutation = useUpdateUnit();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: unit.name,
    },
  });
  const { isDirty, dirtyFields } = form.formState;

  useEffect(() => {
    form.reset({
      name: unit.name,
    });
  }, [unit, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const dirtyData = getDirtyValues(dirtyFields, data) as z.infer<
      typeof formSchema
    >;
    try {
      const res = await unitMutation.mutateAsync({
        id: unit.id,
        data: dirtyData,
      });
      form.reset();
      toast.success(res.message || "Satuan berhasil diubah");
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Gagal mengedit satuan", {
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
          <SheetTitle>Edit Satuan</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk mengedit satuan.
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
                      <FieldLabel htmlFor="name">Nama Satuan</FieldLabel>
                      <Input
                        id="name"
                        autoComplete="off"
                        placeholder="Contoh: kg"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan nama satuan barang.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Field orientation="vertical">
                  {unitMutation.isPending ? (
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

export default EditUnitModal;
