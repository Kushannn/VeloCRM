import { OrganizationType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserMemberType = {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

interface OrganizationState {
  currentOrg: OrganizationType | null;
  members: UserMemberType[];
}

const initialState: OrganizationState = {
  currentOrg: null,
  members: [],
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganization(state, action: PayloadAction<OrganizationType>) {
      state.currentOrg = action.payload;
    },
    clearOrganization(state) {
      state.currentOrg = null;
    },
    setOrganizationMembers(state, action: PayloadAction<UserMemberType[]>) {
      state.members = action.payload;
    },
  },
});

export const { setOrganization, clearOrganization, setOrganizationMembers } =
  organizationSlice.actions;

export default organizationSlice.reducer;
