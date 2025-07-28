// import { UserType } from "@/lib/types";
// import { useAppSelector } from "@/redux/hooks";
// import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";
import { setOrganization } from "@/redux/slices/orgSlice";

export default function useFetchOrganization() {
  // const reduxUser = useAppSelector((state) => state.auth.user);
  // const { isSignedIn, user: clerkUser } = useUser();
  const dispatch = useDispatch();
  const orgId = Cookies.get("orgId");

  useEffect(() => {
    const fetchAndStoreOrganization = async () => {
      if (orgId) {
        try {
          const res = await fetch(
            `/api/organization/get-organization/${orgId}`
          );
          const data = await res.json();
          if (data.success) {
            dispatch(setOrganization(data.organization));
          }
        } catch (err) {
          console.error("Error fetching organization:", err);
        }
      }
    };

    fetchAndStoreOrganization();
  }, [orgId, dispatch]);
}
