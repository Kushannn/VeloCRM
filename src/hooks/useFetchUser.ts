import { UserType } from "@/lib/types";
import { useAppSelector } from "@/redux/hooks";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { setOrganization } from "@/redux/slices/orgSlice";

export default function useFetchUser() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const currentOrg = useAppSelector((state) => state.organization.currentOrg);
  const { isSignedIn, user: clerkUser } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAndStoreUser = async () => {
      if (isSignedIn && clerkUser && !reduxUser) {
        try {
          const res = await fetch("/api/get-user");

          if (!res.ok) {
            console.error("Failed to fetch user:", res.status);
            return;
          }

          const data = await res.json();
          const userData = data as UserType;

          dispatch(login(userData));

          // Set default org in Redux if not already set
          if (!currentOrg) {
            const defaultOrg =
              userData.ownedOrganizations?.[0] ??
              userData.membership?.[0]?.organization ??
              null;

            if (defaultOrg) {
              dispatch(setOrganization(defaultOrg));
            }
          }
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };

    fetchAndStoreUser();
  }, [isSignedIn, clerkUser, reduxUser]);
}
