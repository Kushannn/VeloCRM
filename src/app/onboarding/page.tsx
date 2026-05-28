import { InviteModal } from "@/components/InviteUserModal";

export default function OnboardingPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#09080f]">
      <InviteModal />

      <div className="bg-[#110f1a] border border-[#2a2040] rounded-2xl p-8 max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-medium text-[#e8e4f0]">Welcome 👋</h1>
        <p className="text-[#7c6fa0] text-sm">
          You're not part of any organization yet.
        </p>
        <a href="/onboarding/create-org">Create an Organization</a>
        <p className="text-[#4d3d7a] text-xs">
          Or ask your admin to invite you via email.
        </p>
      </div>
    </div>
  );
}
