import React from "react";

type SubmitButtonProps = {
  isSubmitting: (href: string) => boolean;
  text: string;
  submittingText: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  text,
  submittingText
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
    >
      {isSubmitting ? submittingText : text}
    </button>
  );
};
export default SubmitButton;
