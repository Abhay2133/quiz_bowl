"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { isNumber, isValidDate, isValidTime } from "@/util/validators";
import { convertToISODate, convertToISODateTime } from "@/util/datetime";
import { useState } from "react";

/**
 * { name, duration, startTiming, date, quizcode }
 */
const formSchema = z.object({
  name: z.string().min(1),
  user1name: z.string().min(1),
  user2name: z.string().min(1),
  user1email: z.string().email(),
  user2email: z.string().email(),
});

export function TeamForm({
  handleSubmit,
  defaultData,
}: {
  handleSubmit: any;
  defaultData: any;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultData,
  });
  const [errMsg, setErrMsg] = useState("");

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name={"name"}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>{"Test name"}</FormLabel>
              <FormControl>
                <Input placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user1name"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Participant I name</FormLabel>
              <FormControl>
                <Input placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user2name"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Participant II name</FormLabel>
              <FormControl>
                <Input placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user1email"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Participant I email</FormLabel>
              <FormControl>
                <Input placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user2email"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Participant II Email</FormLabel>
              <FormControl>
                <Input placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button type="submit">Submit</Button>
      </form>
      <div>{errMsg}</div>
    </Form>
  );
}
