import { UserType } from "@/lib/types";
import { useAppSelector } from "@/redux/hooks";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";

export default function useFetchUser() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const { isSignedIn, user: clerkUser } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAndStoreUser = async () => {
      if (isSignedIn && clerkUser && !reduxUser) {
        try {
          const res = await fetch("/api/get-user");
          const data = await res.json();

          const userData = data as UserType;
          Cookies.set("userToken", userData.id, { expires: 7 });

          let resolvedOrgId = "";
          if (userData.membership?.organizationId) {
            resolvedOrgId = userData.membership.organizationId;
          } else if (
            userData.ownedOrganizations &&
            userData.ownedOrganizations.length > 0
          ) {
            resolvedOrgId = userData.ownedOrganizations[0].id;
          }

          if (resolvedOrgId) {
            Cookies.set("orgId", resolvedOrgId, { expires: 7 });
          }

          dispatch(login(userData));
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };

    fetchAndStoreUser();
  }, [isSignedIn, clerkUser, reduxUser]);
}
