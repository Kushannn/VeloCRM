"use client";

import useFetchUser from "@/hooks/useFetchUser";
import { setOrganization } from "@/redux/slices/orgSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

export default function UserLoader() {
  useFetchUser();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const currentOrg = useAppSelector((state) => state.organization.currentOrg);

  useEffect(() => {
    if (!currentOrg && user) {
      const ownedOrg = user.ownedOrganizations?.[0];
      const memberOrg = user.membership?.[0]?.organization;

      const defaultOrg = ownedOrg ?? memberOrg ?? null;

      if (defaultOrg) {
        dispatch(setOrganization(defaultOrg));
      }
    }
  }, [user]);

  return null;
}
