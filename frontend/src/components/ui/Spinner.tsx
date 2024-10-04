const Spinner = ({ text }: { text?: string }) => {
  return (
    <div className="flex h-full items-center justify-center space-y-2 align-middle">
      <div className="mr-2 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent lg:h-8 lg:w-8 lg:border-4"></div>
      <span className="text-text-secondary font-medium">{text}</span>
    </div>
  );
};
export default Spinner;
