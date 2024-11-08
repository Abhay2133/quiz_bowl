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
 * { testId, name, order, easyQ, mediumQ, hardQ }
 */
const formSchema = z.object({
  name: z.string().min(2, { message: "name must be larger" }),
  // order: z.coerce.number().gte(0, "Must be Natural number"),
  easyQ: z.coerce.number().gte(-1, "Must be whole number"),
  mediumQ: z.coerce.number().gte(-1, "Must be whole number"),
  hardQ: z.coerce.number().gte(-1, "Must be whole number"),
});

export function RoundForm({
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
              <FormLabel>Round name</FormLabel>
              <FormControl>
                <Input placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="easyQ"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Easy Questions</FormLabel>
              <FormControl>
                <Input placeholder={""} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mediumQ"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Medium Questions</FormLabel>
              <FormControl>
                <Input placeholder={"eg. 19/11/2024"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hardQ"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Hard QUestions</FormLabel>
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
