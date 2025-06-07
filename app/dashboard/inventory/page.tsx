
import { createClient } from "@/utils/supabase/server"

export default async function Page() {
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        </div>
      </div>
    </div>
  )
}
