"use server";
import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { SessionPayload, DecryptedSession } from "@/types/session.types";
import { cookies } from "next/headers";

const secretKey = process.env.KEY_ENCRYPT_SESSION as string;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  const expiredAt =
    new Date(payload.expires_at.replace(" ", "T")).getTime() / 1000;

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiredAt)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

export async function getCookiesToken() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(process.env.COOKIE_NAME as string)?.value;

  if (!cookieValue) {
    return null;
  }
  const token = await decrypt(cookieValue);

  if (!token) {
    return null;
  }
  return token;
}

export async function getCookieDecryptedSession() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(process.env.COOKIE_NAME as string)?.value;

  console.log("Cookie Value:", cookieValue);

  if (!cookieValue) {
    return null;
  }
  const token = await decrypt(cookieValue);

  if (!token) {
    return null;
  }
  console.log("Decrypted Token:", token);
  const decoded = decodeJwt(token.token || "") as DecryptedSession;

  return decoded;
}

export async function createSession(token: string, expires_at: string) {
  const cookie = await cookies();
  const session = await encrypt({ token, expires_at });

  cookie.set(process.env.COOKIE_NAME as string, session, {
    httpOnly: false,
    secure: false,
    expires: new Date(expires_at),
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession() {
  const cookie = await cookies();
  cookie.delete(process.env.COOKIE_NAME as string);
}
