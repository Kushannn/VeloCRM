import { UserType } from "@/lib/types";
import { useAppSelector } from "@/redux/hooks";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";
import {
  setOrganization,
  setOrganizationMembers,
} from "@/redux/slices/orgSlice";

export default function useFetchOrgMembers() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const { isSignedIn, user: clerkUser } = useUser();
  const dispatch = useDispatch();
  const orgId = Cookies.get("orgId");

  useEffect(() => {
    const fetchAndStoreOrgMembers = async () => {
      if (orgId) {
        try {
          const res = await fetch(
            `/api/organization/get-organization-members/${orgId}`
          );
          const data = await res.json();

          if (data.success) {
            dispatch(setOrganizationMembers(data.members));
          }
        } catch (error) {
          console.log("Error fetching organization members", error);
        }
      }
    };

    fetchAndStoreOrgMembers();
  }, [orgId, dispatch]);
}
