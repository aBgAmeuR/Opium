import { Button } from "@opium/ui/components/button";
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@opium/ui/components/field";
import { Form } from "@opium/ui/components/form";
import { Spinner } from "@opium/ui/components/spinner";
import { toastManager } from "@opium/ui/components/toast";
import React from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  email: z.email(),
});

type Errors = Record<string, string | string[]>;

function submitForm(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const result = schema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    return { errors: fieldErrors as Errors };
  }

  return {
    errors: {} as Errors,
  };
}

export const MagicLinkForm = () => {
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const handleClearErrors = (next: Errors) => setErrors(next);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formEl = event.currentTarget;
    setLoading(true);
    const response = submitForm(event);
    setErrors(response.errors);
    setLoading(false);
    if (Object.keys(response.errors).length === 0) {
      const formData = new FormData(formEl);
      await authClient.signIn.magicLink(
        {
          email: formData.get("email") as string,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toastManager.add({
              title: "Sign in successful",
              description: "You will receive an email with a link to sign in",
              type: "success",
            });
          },
          onError: (error) => {
            toastManager.add({
              title: "Error",
              description: error.error.message || error.error.statusText,
              type: "error",
            });
          },
        }
      );
    }
  };

  return (
    <Form errors={errors} onClearErrors={handleClearErrors} onSubmit={onSubmit}>
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl disabled={loading} placeholder="Enter email" />
        <FieldError />
      </Field>
      <Button disabled={loading} type="submit">
        {loading ?? <Spinner />}
        {loading ? "Sending..." : "Send Magic Link"}
      </Button>
    </Form>
  );
};
