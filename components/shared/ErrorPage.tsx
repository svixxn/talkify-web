type Props = {
  message: string;
  description?: string;
};

const ErrorPage = ({ message, description }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-10">
      <span className="text-2xl text-red-400">{message}</span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorPage;
