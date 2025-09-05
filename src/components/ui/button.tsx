import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = "submit",
  ...props
}) => {
  return (
    <button
      type={type}
      className="flex w-full justify-center rounded-md bg-[#1466b7] px-3 py-2 text-sm 
                 font-semibold text-white transition-all duration-300 ease-in-out 
                 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 
                 active:scale-95 disabled:opacity-50 
                 disabled:cursor-not-allowed focus-visible:outline-2 
                 focus-visible:outline-offset-2 focus-visible:outline-blue-500
                 cursor-pointer animate-fadeIn"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
