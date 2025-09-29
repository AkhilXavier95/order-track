import React from "react";
import { FieldProps } from "formik";

type FormFieldProps = {
  label: string;
  type: string;
  id: string;
  formik: FieldProps;
  placeholder?: string;
};

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  id,
  formik,
  placeholder
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[id]}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          formik.touched[id] && formik.errors[id]
            ? "border-red-500"
            : "border-gray-300"
        }`}
      />
      {formik.touched[id] && formik.errors[id] && (
        <div className="text-red-500 text-sm mt-1">{formik.errors[id]}</div>
      )}
    </div>
  );
};

export default FormField;
