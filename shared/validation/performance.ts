import { z } from 'zod'

export const performanceMeasureSchema = z.object({
  name: z.string().min(1),
  duration: z.number().nonnegative(),
  thresholdMs: z.number().nonnegative(),
  exceededThreshold: z.boolean(),
  createdAt: z.string().datetime().optional()
})
