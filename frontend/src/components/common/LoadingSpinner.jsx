const LoadingSpinner = ({ size }) => {
  const sizeClass = `loading-${size}`;

  return <span className={`loading loading-spinner ${sizeClass}`} />;
};
export default LoadingSpinner;

//<span className="loading loading-spinner loading-lg text-purple-500 animate-spin"></span>
