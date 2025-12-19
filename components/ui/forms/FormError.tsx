interface FormErrorProps {
  message?: string | null;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return <p className="text-red-500 text-sm">{message}</p>;
};
