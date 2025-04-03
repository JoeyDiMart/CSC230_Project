import { useEffect } from "react";
import Sidebar from "../components/Dashboard/sidebar";

export default function DashboardPage() {
  useEffect(() => {
    const root = document.getElementById("root");

    if (root) {
      // Store original styles
      const originalPadding = root.style.padding;
      const originalMargin = root.style.margin;

      // Override them
      root.style.padding = "0";
      root.style.margin = "0";

      // Cleanup function when the component unmounts
      return () => {
        root.style.padding = originalPadding;
        root.style.margin = originalMargin;
      };
    }
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="flex h-full">
        <Sidebar />
      </div>
    </div>
  );
}
