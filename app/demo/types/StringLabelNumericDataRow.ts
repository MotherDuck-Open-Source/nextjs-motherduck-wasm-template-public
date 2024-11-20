import { z } from 'zod';

export const zStringLabelNumericDataRow = z.object({
    label: z.string().nullable().transform((val) => val ?? undefined),
    value: z.number(),
});

export type StringLabelNumericDataRow = z.infer<typeof zStringLabelNumericDataRow>;
