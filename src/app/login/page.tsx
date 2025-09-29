"use client";

import { useFormik } from "formik";
import { loginValidationSchema } from "@/lib/validationSchemas";
import SubmitButton from "@/component/SubmitButton";
import FormField from "@/component/FormField";

export default function Login() {
  const loginFormik = useFormik({
    initialValues: {
      email: "signshome90@gmail.com",
      password: ""
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Login values:", values);
      } catch (error) {
        console.error("Login error:", error);
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          <form onSubmit={loginFormik.handleSubmit} className="space-y-4">
            <FormField
              label="Email"
              type="email"
              id="email"
              formik={loginFormik}
            />
            <FormField
              label="Password"
              type="password"
              id="password"
              formik={loginFormik}
              placeholder="••••••"
            />
            <SubmitButton
              isSubmitting={loginFormik.isSubmitting}
              text="Login"
              submittingText="Logging in..."
            />
          </form>
        </div>
      </div>
    </div>
  );
}
