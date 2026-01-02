"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { oAuthSignIn, signIn, signUp } from "@/auth/nextjs/action";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type AuthPageProps = React.ComponentProps<"form"> & {
  type: "sign-in" | "sign-up" | string;
};

const formSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password should atleast be of 8 characters")
    .max(16, "Password should not exceeds 16 characters"),
});

export function AuthPage({ type, className, ...props }: AuthPageProps) {
  const [error, setError] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (type === "sign-in") {
      const error = await signIn(data);
      setError(error);
    } else {
      const temp = {
        email: data.email,
        password: data.password,
        name: "random",
      };
      const error = await signUp(temp);
      setError(error);
    }
  }
  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {error && <p className="text-destructive">{error}</p>}
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {type === "sign-in"
              ? "Login to your account"
              : "Create your account"}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to{" "}
            {type === "sign-in" ? "login to" : "create"} your account
          </p>
        </div>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="m@example.com"
                autoComplete="off"
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                {type === "sign-in" ? (
                  <Link
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                ) : (
                  ""
                )}
              </div>
              <Input
                {...field}
                id="password"
                aria-invalid={fieldState.invalid}
                placeholder=""
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit">
            {type === "sign-in" ? "Login" : "Create"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            onClick={async () => await oAuthSignIn("DISCORD")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.6 18.6 0 0 0-5.487 0a12 12 0 0 0-.617-1.23A.08.08 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.1.1 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055a20 20 0 0 0 5.993 2.98a.08.08 0 0 0 .084-.026a14 14 0 0 0 1.226-1.963a.074.074 0 0 0-.041-.104a13 13 0 0 1-1.872-.878a.075.075 0 0 1-.008-.125q.19-.14.372-.287a.08.08 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.08.08 0 0 1 .079.009q.18.148.372.288a.075.075 0 0 1-.006.125q-.895.515-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.08.08 0 0 0 .084.028a20 20 0 0 0 6.002-2.981a.08.08 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028M8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38c0-1.312.956-2.38 2.157-2.38c1.21 0 2.176 1.077 2.157 2.38c0 1.312-.956 2.38-2.157 2.38m7.975 0c-1.183 0-2.157-1.069-2.157-2.38c0-1.312.955-2.38 2.157-2.38c1.21 0 2.176 1.077 2.157 2.38c0 1.312-.946 2.38-2.157 2.38" />
            </svg>
            Continue with Discord
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={async () => await oAuthSignIn("GITHUB")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Continue with GitHub
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={async () => await oAuthSignIn("GOOGLE")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </Button>

          <FieldDescription className="text-center">
            {type === "sign-in" ? "Don't " : "Already "}
            have an account?{" "}
            {type === "sign-in" ? (
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            ) : (
              <Link
                href="/auth/sign-in"
                className="underline underline-offset-4"
              >
                Sign in
              </Link>
            )}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
