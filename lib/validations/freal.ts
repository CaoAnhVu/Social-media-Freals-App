import * as z from "zod";

export const FrealValidation = z.object({
  freal: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  freal: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});
