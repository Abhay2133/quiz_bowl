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
 * { quizId, name, order, easyQ, mediumQ, hardQ }
 */

export type Answer = "OPTION1" | "OPTION2" | "OPTION3" | "OPTION4";
export type QuestionType = "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

export type FormType = {
  question: string;
  answer: Answer;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  link?: string;
};

const formSchema = z.object({
  question: z.string().min(2, { message: "question must be larger" }),
  answer: z.string().min(2, { message: "answer must be larger" }),
  option1: z.string().min(2, { message: "option must be larger" }),
  option2: z.string().min(2, { message: "option must be larger" }),
  option3: z.string().min(2, { message: "option must be larger" }),
  option4: z.string().min(2, { message: "option must be larger" }),
  type: z.string().min(2, { message: "type must be larger" }),
  link: z.string().optional(),
  difficulty: z.string().min(2)
});

export function QuestionForm({
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
          name={"question"}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea placeholder={"Type your Question Here"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Answer</FormLabel>
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
                      <SelectLabel>answer</SelectLabel>
                      <SelectItem value="OPTION1">OPTION1</SelectItem>
                      <SelectItem value="OPTION2">OPTION2</SelectItem>
                      <SelectItem value="OPTION3">OPTION3</SelectItem>
                      <SelectItem value="OPTION4">OPTION4</SelectItem>
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
          name="option1"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Option 1</FormLabel>
              <FormControl>
                <Input placeholder={"Option-1"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="option2"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Option 2</FormLabel>
              <FormControl>
                <Input placeholder={"Option-2"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="option3"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Option 3</FormLabel>
              <FormControl>
                <Input placeholder={"Option-3"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="option4"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Option 4</FormLabel>
              <FormControl>
                <Input placeholder={"Option-4"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Level of Difficulty</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select lvl of difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Difficulty</SelectLabel>
                      <SelectItem value="EASY">EASY</SelectItem>
                      <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                      <SelectItem value="HARD">HARD</SelectItem>
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
          name="type"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type</SelectLabel>
                      <SelectItem value="TEXT">Text</SelectItem>
                      <SelectItem value="IMAGE">Image</SelectItem>
                      <SelectItem value="AUDIO">Audio</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
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
          name="link"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder={"Link to file (optional)"} {...field} />
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
