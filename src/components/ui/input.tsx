import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ElementType;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  icon: IconComponent,
  ...props
}) => {
  const baseInputClasses = `
    block w-full rounded-md bg-white/5 py-1.5 text-sm text-white 
    outline-1 outline-white/10 placeholder:text-gray-500 
    focus:outline-2 focus:outline-blue-500 transition
  `;

  const inputWithIconClasses = `${baseInputClasses} ${
    IconComponent ? "pl-10" : "px-3"
  }`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-100">
        {label}
      </label>
      <div className="relative mt-2">
        {IconComponent && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <IconComponent
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required
          autoComplete={id}
          className={inputWithIconClasses}
          placeholder={label}
          {...props}
        />
      </div>
    </div>
  );
};

export default InputField;
