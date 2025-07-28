import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setProjects } from "@/redux/slices/projectSlice";
import { useAppSelector } from "@/redux/hooks";

export default function useFetchOrgMembers() {
  const projects = useAppSelector((state) => state.projects.projects ?? []);
  const dispatch = useDispatch();
  const orgId = Cookies.get("orgId");

  useEffect(() => {
    const fetchAndStoreProjects = async () => {
      console.log("Fetching the projects");

      if (!orgId) return;

      try {
        const res = await fetch(`/api/project/get-projects/${orgId}`);
        const data = await res.json();
        console.log("this is the data in the hook ", data);
        if (data.success) {
          dispatch(setProjects(data.projects));
        }
        console.log("The projects have been set", projects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchAndStoreProjects();
  }, [orgId, dispatch]);
}
