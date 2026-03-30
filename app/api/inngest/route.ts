import { serve } from "inngest/next"
import { inngest } from "@/lib/inngest"
import { bossCheckFunction } from "@/app/inngest/functions/bossCheck"

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [bossCheckFunction],
})