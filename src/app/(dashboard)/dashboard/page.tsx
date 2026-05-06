import MainDasboardSignedIn from "@/components/dashboards/MainDashboardSignedIn";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName || "";
  const todayShort = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  return <MainDasboardSignedIn firstName={firstName} todayShort={todayShort} />;
}
