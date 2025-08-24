const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      {text && (
        <p className={`text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Inline loader for buttons or small spaces
export const InlineLoader = ({ size = 'small' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]}`}></div>
  );
};

// Full page loader
export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="loading-spinner h-12 w-12 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

// Skeleton loader for product cards
export const ProductCardSkeleton = () => {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2 w-16"></div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
        <div className="h-8 bg-gray-200 rounded mb-3 w-20"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="flex space-x-2">
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;