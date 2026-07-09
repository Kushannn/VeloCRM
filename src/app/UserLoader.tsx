"use client";

import useFetchUser from "@/hooks/useFetchUser";

export default function UserLoader() {
  useFetchUser();

  return null;
}
