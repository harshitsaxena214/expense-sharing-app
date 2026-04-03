import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(50, "Group name too long"),
});

export const ghostMemberSchema = z.object({
  name: z.string().min(1, "Member name is required").max(30, "Name too long"),
});
