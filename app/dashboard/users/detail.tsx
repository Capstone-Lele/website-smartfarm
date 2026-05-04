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
import { User, UserDetail } from "@/types/user.types";
import { useGetUserById } from "@/lib/api/service/users/useUser";
import { usePool } from "@/lib/api/service/pools/usePool";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ROLE_LABEL } from "@/lib/constants/role";
import { formatDate } from "@/lib/utils/format-date";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { poolsTranlate } from "@/lib/constants/category";

const DetailUserSheet = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: userDetailResponse, isLoading: isUserDetailLoading } =
    useGetUserById(user.id, isOpen);
  const { data: poolData } = usePool();

  const userDetail: UserDetail | undefined = userDetailResponse?.data?.[0];
  const pools = poolData?.data ?? [];

  const role = ROLE_LABEL.find(
    (r) => r.value === (userDetail?.role || user.role),
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div>
          <ButtonDetailColumn
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
          />
        </div>
      </SheetTrigger>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Detail Pengguna</SheetTitle>
          <SheetDescription>
            Informasi lengkap mengenai profil dan akses pengguna.
          </SheetDescription>
        </SheetHeader>

        {isUserDetailLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] gap-3">
            <Spinner className="size-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Memuat data...
            </span>
          </div>
        ) : (
          <div className="px-4 pb-8 space-y-8">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-5">
              <img
                src={
                  userDetail?.image || user.image || "/placeholder-image.png"
                }
                alt={userDetail?.name || user.name}
                className="size-40 object-cover border bg-muted "
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-tight">
                Informasi Profil
              </h4>
              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Nama</span>
                  <span className="font-medium capitalize">
                    {userDetail?.name || user.name}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">
                    {userDetail?.email || user.email}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Peran</span>
                  <Badge variant="outline" className="capitalize px-2">
                    {role?.label || userDetail?.role || user.role}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="gap-1.5 px-2">
                    {!user.deletedAt && (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )}
                    {user.deletedAt ? "Non-Aktif" : "Aktif"}
                  </Badge>
                </div>
                <Separator />
              </div>
            </div>

            {/* Permissions Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-tight">
                Akses Kolam ({userDetail?.permission?.length || 0})
              </h4>

              {userDetail?.permission && userDetail.permission.length > 0 ? (
                <div className="flex flex-col space-y-3 pt-2 max-h-[200px] overflow-y-auto pr-2">
                  {userDetail.permission.map((poolId, index) => {
                    const pool = pools.find((p) => p.id === poolId);
                    return (
                      <React.Fragment key={poolId}>
                        <div className="flex justify-between items-center text-sm gap-4">
                          <span className="font-medium truncate">
                            {pool?.name || "Kolam Tidak Ditemukan"}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize whitespace-nowrap">
                            {pool
                              ? poolsTranlate(pool.category)
                              : "ID: " + poolId}
                          </span>
                        </div>
                        <Separator />
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-md border border-dashed bg-muted/50 text-center text-sm text-muted-foreground">
                  Tidak ada akses kolam yang diberikan.
                </div>
              )}
            </div>

            {/* Timestamps Section */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-tight">
                Riwayat Sistem
              </h4>
              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Waktu Dibuat</span>
                  <span className="font-medium">
                    {formatDate(userDetail?.createdAt || user.createdAt)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Terakhir Diubah</span>
                  <span className="font-medium">
                    {formatDate(userDetail?.updatedAt || user.updatedAt)}
                  </span>
                </div>
                <Separator />
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default DetailUserSheet;
