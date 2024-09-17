"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { FrealValidation } from "@/lib/validations/freal";
import { createFreal } from "@/lib/actions/freal.actions";

interface Props {
  userId: string;
}

function PostFreal({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof FrealValidation>>({
    resolver: zodResolver(FrealValidation),
    defaultValues: {
      freal: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof FrealValidation>) => {
    await createFreal({
      text: values.freal,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form className="mt-10 flex flex-col justify-start gap-10" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="freal"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">Content</FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          Post Freal
        </Button>
      </form>
    </Form>
  );
}

export default PostFreal;
