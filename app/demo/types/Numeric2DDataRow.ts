import { z } from 'zod';

export const zNumeric2DDataRow = z.object({
    label: z.number().nullable().transform((val) => val ?? undefined),
    value: z.number(),
});

export type Numeric2DDataRow = z.infer<typeof zNumeric2DDataRow>;
