"use client";

import { useFormik } from "formik";
import { signupValidationSchema } from "@/lib/validationSchemas";
import SubmitButton from "@/component/SubmitButton";
import FormField from "@/component/FormField";

export default function Register() {
  const signupFormik = useFormik({
    initialValues: {
      fullName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: signupValidationSchema,
    onSubmit: async (values) => {
      console.log("Signup:", values);
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Sign Up
          </h2>
          <form onSubmit={signupFormik.handleSubmit} className="space-y-4">
            <FormField
              label="Full name"
              type="text"
              id="fullName"
              formik={signupFormik}
            />
            <FormField
              label="Last name"
              type="text"
              id="lastName"
              formik={signupFormik}
            />
            <FormField
              label="Email"
              type="email"
              id="email"
              formik={signupFormik}
            />
            <FormField
              label="Password"
              type="password"
              id="password"
              formik={signupFormik}
              placeholder="••••••"
            />
            <FormField
              label="Confirm password"
              type="password"
              id="confirmPassword"
              formik={signupFormik}
              placeholder="••••••"
            />
            <SubmitButton
              isSubmitting={signupFormik.isSubmitting}
              text="Sign Up"
              submittingText="Creating account..."
            />
          </form>
        </div>
      </div>
    </div>
  );
}
