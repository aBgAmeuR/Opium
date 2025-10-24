import type { ReactNode } from "react";
import { Resend } from "resend";

export * from "./templates/magic-link-template";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailOptions = {
  to: string;
  subject: string;
  template: ReactNode;
};

export const sendEmail = async ({ to, subject, template }: EmailOptions) => {
  const { data, error } = await resend.emails.send({
    from: "Opium <onboarding@opuim.antoinejosset.fr>",
    to: [to],
    subject,
    react: template,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
