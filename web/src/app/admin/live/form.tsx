"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { Textarea } from "@/components/ui/textarea";

/**
 * 
 * name
liveQuizcode
quizData
activeRoundIndex
activeQuestionIndex
isAnswerAllowed
status
timeLimit
liveAnswers
quizId
quiz
positiveScore
negativeScore
 */

const formSchema = z.object({
  name: z.string().min(1),
  isAnswerAllowed: z.string(),
  status: z.string(),
  timeLimit: z.coerce.number(),
  positiveScore: z.coerce.number(),
  negativeScore: z.coerce.number(),
});

export function LiveQuizForm({
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder={"Live Quiz Name"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAnswerAllowed"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Answer Allowed</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Answer Allowed</SelectLabel>
                      <SelectItem value="true">TRUE</SelectItem>
                      <SelectItem value="false">FALSE</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>STATUS</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="NOT_STARTED">NOT_STARTED</SelectItem>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="FINISHED">FINISHED</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeLimit"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Time Limit</FormLabel>
              <FormControl>
                <Input placeholder={"in seconds"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="positiveScore"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Positive Score</FormLabel>
              <FormControl>
                <Input placeholder={"+ve score"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="negativeScore"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Negative Score</FormLabel>
              <FormControl>
                <Input placeholder={"-ve score"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
