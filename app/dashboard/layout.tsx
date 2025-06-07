
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const supabase = await createClient();
    const { data: userData, error } = await supabase.auth.getUser();


    return ( 
        <main className="min-h-screen flex flex-col items-center bg-gray-50">
            <SidebarProvider>
                <AppSidebar user={{
                    name: userData.user?.user_metadata?.name ?? 'User Name',
                    email: userData.user?.email ?? 'Email',
                    avatar: 'string'
                }} variant="inset" />
                <SidebarInset>
                    <SiteHeader siteHeader={'pathName.toString()'} />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </main>
    );
}
