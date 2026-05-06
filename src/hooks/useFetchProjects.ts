import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setProjects } from "@/redux/slices/projectSlice";

export default function useFetchProjects() {
  const dispatch = useDispatch();
  const orgId = Cookies.get("orgId");

  useEffect(() => {
    const fetchAndStoreProjects = async () => {
      if (!orgId) return;

      try {
        const res = await fetch(`/api/project/get-projects/${orgId}`);
        const data = await res.json();
        if (data.success) {
          dispatch(setProjects(data.projects));
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchAndStoreProjects();
  }, [orgId, dispatch]);
}
