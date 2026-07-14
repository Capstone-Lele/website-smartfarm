"use client";

import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { useVerifyOtp } from "@/lib/api/service/auth/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MdOutlineArrowBack } from "react-icons/md";

interface OtpFormProps {
  email: string;
}

const OTP_LENGTH = 6;

const OtpForm = ({ email }: OtpFormProps) => {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyOtpMutation = useVerifyOtp();

  const handleChange = (index: number, value: string) => {
    // Hanya izinkan angka
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-fokus ke input berikutnya
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Jika kosong, pindah ke input sebelumnya
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newDigits = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);

    // Fokus ke input terakhir yang terisi atau akhir
    const lastIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      toast.error("Masukkan 6 digit OTP terlebih dahulu.");
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({ otp, email });
      toast.success("Verifikasi berhasil! Mengalihkan ke dashboard...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("OTP tidak valid", {
        description: error?.message || "Kode OTP salah atau sudah kedaluwarsa.",
      });
      // Reset semua digit jika gagal
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleBack = () => {
    router.push("/login");
  };

  const isComplete = digits.every((d) => d !== "");

  return (
    <section className="w-full h-full overflow-auto">
      <div className="mx-4 sm:mx-12 py-12 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center gap-4 sm:-mx-6 -mt-4">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={35}
            height={35}
            className="rounded-md"
          />
          <h3 className="font-semibold text-xl">Leleku</h3>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">Verifikasi OTP</h2>
            <p className="text-sm text-gray-500">
              Masukkan 6 digit kode OTP yang telah dikirimkan ke{" "}
              <span className="font-medium text-gray-700">{email}</span>
            </p>
          </div>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3 sm:gap-4">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                id={`otp-digit-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                className={`
                  w-11 h-14 sm:w-13 sm:h-16 text-center text-xl font-bold
                  border-2 rounded-lg outline-none transition-all duration-200
                  ${digit
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 bg-gray-50 text-gray-800"
                  }
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  focus:bg-white caret-primary
                `}
                aria-label={`Digit OTP ke-${index + 1}`}
                autoComplete="one-time-code"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {verifyOtpMutation.isPending ? (
              <Button className="w-full cursor-pointer" disabled>
                <Spinner className="mr-2" />
                Memverifikasi...
              </Button>
            ) : (
              <Button
                className="w-full cursor-pointer"
                type="submit"
                disabled={!isComplete}
              >
                Verifikasi OTP
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer flex items-center gap-2"
              onClick={handleBack}
            >
              <MdOutlineArrowBack className="text-base" />
              Kembali ke Login
            </Button>
          </div>

          <p className="text-center text-xs text-gray-400">
            Tidak menerima kode? Periksa folder spam atau coba login kembali.
          </p>
        </form>

        {/* Footer */}
        <div className="sm:-mx-6 -mb-6">
          <span className="text-gray-400 text-sm">
            Copyright © {new Date().getFullYear()} Leleku. All rights reserved.
          </span>
        </div>
      </div>
    </section>
  );
};

export default OtpForm;
