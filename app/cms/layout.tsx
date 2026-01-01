import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen max-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto flex flex-col">
          <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm">
            <h1 className="text-xl font-semibold">Edit Content</h1>
            <SidebarTrigger />
          </header>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
