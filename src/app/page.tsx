import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import SearchInput from '@/components/search-input';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default async function Page() {
  // const data = await getRecentTracks();
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="w-full">
          <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <SearchInput />
          </header>
          <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
            <div className="flex-1 overflow-auto">
              <DataTable />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
