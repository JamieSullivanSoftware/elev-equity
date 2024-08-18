import { sendEmail } from "../../utils/email";

import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const fullname = formData.get("fullname") as string | null;
  const company = formData.get("company") as string | null;
  const email = formData.get("email") as string | null;
  const message = formData.get("message") as string | null;

  if (!fullname || !company || !email || !message) {
    throw new Error("Missing required fields");
  }

  try {
    await sendEmail({
      to: 'jamiesullivan523@gmail.com',
      subject: `Inquiry from ${fullname} at ${company}`,
      template: {
        name: "inquiry",
        params: {
          fullname,
          company,
          email,
          message
        }
      }
    });
  } catch (error) {
    throw new Error("Failed to send email");
  }

  return new Response('Email sent successfully', { status: 200 });
};