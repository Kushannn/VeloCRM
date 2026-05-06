import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setSelectedProject } from "@/redux/slices/projectSlice";

export default function useFetchSingleProject(projectId: string) {
  const dispatch = useDispatch();
  const orgId = Cookies.get("orgId");

  useEffect(() => {
    const fetchAndStoreProjects = async () => {
      if (!orgId || !projectId) return;

      try {
        const res = await fetch(`/api/project/${projectId}/get-project`);
        const data = await res.json();
        if (data.success) {
          dispatch(setSelectedProject(data.project));
        }
      } catch (error) {
        console.log("Error getting the project", error);
      }
    };

    fetchAndStoreProjects();
  }, [orgId, dispatch]);
}
