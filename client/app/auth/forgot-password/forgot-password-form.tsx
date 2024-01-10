"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import { useSupabase } from "@/components/providers/supabase-provider";
import { forgotPasswordFormSchema } from "@/utils/formSchemas";

interface ForgotPasswordFormProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  // Form definition
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPassword = async (
    values: z.infer<typeof forgotPasswordFormSchema>
  ) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      values.email,
      {
        redirectTo: `${location.origin}/auth/update-password`,
      }
    );

    if (error) {
      setIsLoading(false);
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to reset password.",
        description: `${error.message}.` || "Uh oh! Something went wrong.",
      });
    } else {
      setIsSuccess(true);
    }

    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "mx-auto flex flex-col w-[310px] justify-center space-y-6 md:w-[350px] -mt-14",
        className
      )}
    >
      <div className="text-left mb-2">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          Reset Your Password
        </h1>
        {!isSuccess ? (
          <p className="text-sm text-muted-foreground">
            Type in your email and we&apos;ll send you a link to reset your
            password.
          </p>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground"
          >
            A confirmation email to reset your password has been sent. Please
            check your inbox to change your password.
          </motion.p>
        )}
      </div>

      {!isSuccess && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(resetPassword)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-3">
                        <Label
                          className="font-normal text-muted-foreground"
                          htmlFor="email"
                        >
                          Email
                        </Label>
                        <Input
                          className="shadow-sm"
                          id="email"
                          placeholder="alan.turing@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="mt-3" />
              <Button
                disabled={isLoading}
                type="submit"
                className="h-10 shadow-xl w-full"
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Reset Email
              </Button>
            </div>
          </form>
        </Form>
      )}

      <p className="px-8 text-center text-sm text-muted-foreground w-full pt-2">
        Already have an account?{" "}
        <Link
          href={"/signin"}
          className="underline underline-offset-2 hover:text-muted-foreground text-black cursor-pointer"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
