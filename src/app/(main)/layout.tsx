import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`font-sans h-screen w-full flex`}>
      <Sidebar />

      <div className="w-[82%] flex flex-col bg-secondary/10 py-5">
        <DashboardNavbar />
        <div className="flex-grow overflow-y-scroll mt-2 px-4">{children}</div>
      </div>
    </div>
  );
}
