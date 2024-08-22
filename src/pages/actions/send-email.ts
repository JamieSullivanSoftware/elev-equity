import { sendEmail } from "../../utils/email";

import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const formData = await request.formData();
  const fullname = formData.get("fullname") as string | null;
  const company = formData.get("company") as string | null;
  const email = formData.get("email") as string | null;
  const message = formData.get("message") as string | null;
  const errors = {
    fullname: '',
    company: '',
    email: '',
    message: ''
  };

  if (typeof fullname !== 'string' || fullname.length <= 1) {
    errors.fullname += 'Please enter your name.';
  }
  if (typeof company !== 'string' || company.length <= 1) {
    errors.company += 'Please enter your company name.';
  }
  if (
    typeof email !== 'string' ||
    email.length <= 1 ||
    !validateEmail(email)
  ) {
    errors.email += 'Please enter a valid email.';
  }
  if (typeof message !== 'string' || message.length <= 9) {
    errors.message += 'Please enter your message.';
  }

  const hasErrors = Object.values(errors).some((msg) => msg);

  if (hasErrors) {
    Object.entries(errors).forEach(([key, value]) => {
      cookies.set(key, value, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
    })
    return redirect("/");
    return new Response(JSON.stringify({
      message: "success",
      status: 200,
    }));
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

  cookies.set("status", "Success!!!", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });

  return redirect("/");

  // return new Response('Email sent successfully', { status: 200 });
};

const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};