"use client";

import { useFormik } from "formik";
import { loginValidationSchema } from "@/lib/validationSchemas";

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
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
                value={loginFormik.values.email}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loginFormik.touched.email && loginFormik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {loginFormik.touched.email && loginFormik.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {loginFormik.errors.email}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={loginFormik.handleChange}
                onBlur={loginFormik.handleBlur}
                value={loginFormik.values.password}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loginFormik.touched.password && loginFormik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="••••••"
              />
              {loginFormik.touched.password && loginFormik.errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {loginFormik.errors.password}
                </div>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loginFormik.isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
            >
              {loginFormik.isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don&apos;t have any account!{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
