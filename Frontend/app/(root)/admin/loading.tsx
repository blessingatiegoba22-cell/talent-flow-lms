import { LoadingScreen } from "@/components/shared/loading-screen";

export default function AdminLoading() {
  return (
    <LoadingScreen
      title="Loading admin workspace"
      description="Preparing users, courses, reports, and workspace controls."
    />
  );
}
