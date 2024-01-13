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

import { useSupabase } from "@/lib/providers/supabase-provider";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";

interface UpdatePasswordFormProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const updatePasswordFormSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function UpdatePasswordForm({ className }: UpdatePasswordFormProps) {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const [passwordShown, setPasswordShown] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  // Form definition
  const form = useForm<z.infer<typeof updatePasswordFormSchema>>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const updatePassword = async (
    values: z.infer<typeof updatePasswordFormSchema>
  ) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setIsLoading(false);
      console.error(error);
      toast({
        variant: "destructive",
        title: "There was an error updating your password.",
        description: `${error.message}.` || "Uh oh! Something went wrong.",
      });
    } else {
      setIsSuccess(true);
      await supabase.auth.signOut();
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
            Type in a new secure password and press save to update your
            password.
          </p>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            Your password has been successfully changed!
          </motion.p>
        )}
      </div>

      {!isSuccess && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(updatePassword)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-3">
                        <Label
                          className="font-normal text-muted-foreground"
                          htmlFor="password"
                        >
                          New password
                        </Label>
                        <div className="relative">
                          <Input
                            className="shadow-sm pr-10"
                            id="password"
                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            type={passwordShown ? "text" : "password"}
                            disabled={isLoading}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPasswordShown((prev) => !prev)}
                            className="absolute right-2 px-2 h-6 top-1/2 transform -translate-y-1/2"
                          >
                            {passwordShown ? (
                              <EyeOpenIcon className="h-4 w-4 text-gray-400" />
                            ) : (
                              <EyeNoneIcon className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
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
                Save New Password
              </Button>
            </div>
          </form>
        </Form>
      )}

      <p className="text-sm text-muted-foreground w-full pt-2">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="underline underline-offset-2 hover:text-muted-foreground text-black cursor-pointer"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
