import { ProjectType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  projects: ProjectType[] | null;
  selectedProject: ProjectType | null;
}

const initialState: ProjectState = {
  projects: null,
  selectedProject: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<ProjectType[]>) {
      state.projects = action.payload;
    },
    clearProjects(state) {
      state.projects = null;
    },
    updateProject(state, action: PayloadAction<ProjectType>) {
      if (!state.projects) return;
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
      // Optionally add else: state.projects.push(action.payload);
    },
    setSelectedProject(state, action: PayloadAction<ProjectType>) {
      state.selectedProject = action.payload;
    },
  },
});

export const { setProjects, clearProjects, updateProject, setSelectedProject } =
  projectsSlice.actions;

export default projectsSlice.reducer;
