const ProductPageSkeleton = () => {
  return (
    <div className="container mx-auto p-2 md:p-6 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-2 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-2 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Image Skeleton */}
        <div className="flex justify-center place-items-start p-4 md:p-0">
          <div className="w-full max-w-[400px] h-[350px] bg-gray-200 rounded-[10px] shadow-lg"></div>
        </div>

        {/* Right side - Product Details Skeleton */}
        <div className="flex flex-col justify-start max-w-md p-2 md:p-6">
          {/* Title and Wishlist Button */}
          <div className="flex items-center justify-between gap-4 mb-1">
            <div className="h-7 w-3/4 bg-gray-200 rounded"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          </div>

          {/* Brand */}
          <div className="h-4 w-24 bg-gray-200 rounded mt-1"></div>

          {/* Description */}
          <div className="h-4 w-full bg-gray-200 rounded mt-2"></div>
          <div className="h-4 w-5/6 bg-gray-200 rounded mt-1"></div>

          {/* Rating */}
          <div className="flex gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-3">
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
          </div>

          {/* Price and Package */}
          <div className="flex justify-between my-6">
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="mt-6 flex items-center justify-around">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="w-12 h-10 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 w-40 bg-gray-200 rounded"></div>
          </div>

          {/* Product Details Section */}
          <div className="mt-8">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/5 bg-gray-200 rounded mt-1"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <div className="h-5 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="mt-12 container mx-auto px-2 md:px-6">
        <div className="h-7 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-12 container mx-auto px-2 md:px-6">
        <div className="h-7 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="w-full aspect-[3/4] bg-gray-200"></div>
              <div className="p-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPageSkeleton;
