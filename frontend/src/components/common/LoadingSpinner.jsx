const LoadingSpinner = ({ size }) => {
  const sizeClass = `loading-${size}`;

  return (
    <span className={`loading loading-spinner text-yellow-300  ${sizeClass}`} />
  );
};
export default LoadingSpinner;

//<span className="loading loading-spinner loading-lg animate-spin"></span>
