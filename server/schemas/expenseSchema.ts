import { z } from "zod";

export const addExpenseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),

  amount: z
    .number("Amount must be a number")
    .positive("Amount must be greater than 0")
    .multipleOf(0.01, "Amount can have at most 2 decimal places"),

  paidByMemberId: z.string().uuid("Invalid member ID"),

  splitMemberIds: z
    .array(z.string().uuid("Invalid member ID"))
    .min(1, "At least one member must be in the split")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Duplicate members in split are not allowed",
    ),
});
