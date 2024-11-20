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
  name: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  duration: z.coerce.number().gte(1, "Must be 18 and above"),
  // .min(1, { message: "Duration must be at lest 1 minute" })
  // .refine(isNumber)
  startTiming: z.string().refine(isValidTime),
  date: z.string().refine(isValidDate),
  quizcode: z.string(),
});

export function TestForm({
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
          name="duration"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTiming"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input placeholder={"eg. 12:30 PM"} {...field} />
              </FormControl>
              <FormDescription>Time format : HH:MM PM|AM</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input placeholder={"eg. 19/11/2024"} {...field} />
              </FormControl>
              <FormDescription>date format : DD/MM/YYYY</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quizcode"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Test Code</FormLabel>
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
