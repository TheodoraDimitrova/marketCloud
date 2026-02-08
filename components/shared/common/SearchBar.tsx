"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/forms/input";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/lib/types/product";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (value: string) => void;
  products: Product[];
  searchTerm: string;
}

const SearchBar = ({ onSearch, products, searchTerm: externalSearchTerm }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Update local state when external search term changes
  useEffect(() => {
    setSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

  // Get suggestions from products
  const getSuggestions = useCallback(
    (value: string): Product[] => {
      if (!value.trim() || !products.length) return [];

      try {
        const searchLower = value.toLowerCase().trim();
        const matches = products.filter((product) => {
          if (!product || !product.name) return false;
          const nameMatch = product.name.toLowerCase().includes(searchLower);
          const brandMatch =
            product.brand?.toLowerCase().includes(searchLower) || false;
          const descriptionMatch =
            product.description?.toLowerCase().includes(searchLower) || false;
          return nameMatch || brandMatch || descriptionMatch;
        });

        // Return unique products, limit to 10 for better UX
        const uniqueMatches = Array.from(
          new Map(matches.map((p) => [p._id, p])).values()
        ).slice(0, 10);
        return uniqueMatches;
      } catch (error) {
        console.error("Error getting suggestions:", error);
        return [];
      }
    },
    [products]
  );

  // Update suggestions when search term changes
  useEffect(() => {
    if (searchTerm.trim() && products.length > 0) {
      try {
        const newSuggestions = getSuggestions(searchTerm);
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
      } catch (error) {
        console.error("Error in suggestions effect:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, getSuggestions, products.length]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onSearch(newValue);
  };

  const handleSuggestionClick = (product: Product) => {
    setSearchTerm(product.name);
    setShowSuggestions(false);
    onSearch(product.name);
  };

  return (
    <div>
      <div className="container w-[80%] md:max-w-[650px] md:w-full mx-auto my-10 md:my-20">
        <div ref={searchRef} className="relative mt-4 w-full">
          <div className="relative w-full">
            <Input
              className={`p-3 pl-12 pr-12 bg-white w-full placeholder:text-gray-400 placeholder:text-base border border-gray-200 focus:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md ${
                showSuggestions && searchTerm.trim()
                  ? "rounded-t-xl rounded-b-none border-b-0"
                  : "rounded-xl"
              }`}
              placeholder="Search our Store"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            <Search className="absolute inset-y-0 left-4 w-5 h-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Autocomplete Suggestions */}
          <AnimatePresence>
            {showSuggestions && searchTerm.trim() && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 w-full bg-white border border-t-0 border-gray-400 rounded-b-xl shadow-2xl max-h-96 overflow-hidden z-50"
              >
                <div className="max-h-96 overflow-y-auto">
                  {suggestions.length > 0 ? (
                    <div className="py-2">
                      {suggestions.map((product) => {
                    if (!product || !product._id || !product.slug?.current)
                      return null;

                    // Get image URL with proper error handling
                    let imageUrl: string | null = null;
                    try {
                      if (product.images && product.images.length > 0 && product.images[0]) {
                        const firstImage = product.images[0];
                        // Check if image has the correct structure
                        if (firstImage && firstImage.asset) {
                          // Support both direct asset reference and nested ref
                          const assetRef = firstImage.asset._ref || 
                            (typeof firstImage.asset === 'object' && 'ref' in firstImage.asset 
                              ? (firstImage.asset as { ref?: string }).ref 
                              : undefined);
                          if (assetRef) {
                            imageUrl = urlFor(firstImage, { quality: 75, format: "webp", width: 56, height: 56 });
                          }
                        }
                      }
                    } catch (error) {
                      console.error("Error generating image URL for product:", product.name, error, product.images?.[0]);
                      imageUrl = null;
                    }

                    return (
                      <Link
                        key={product._id}
                        href={`/product/${product.slug.current}`}
                        onClick={() => handleSuggestionClick(product)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 border-b border-gray-100 last:border-b-0 group cursor-pointer hover:shadow-sm"
                      >
                        <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 ring-1 ring-gray-200 group-hover:ring-gray-300 group-hover:scale-105 transition-all duration-200">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={product.name || "Product"}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                console.error("Image failed to load:", imageUrl);
                                // Hide image on error
                                const target = e.target as HTMLImageElement;
                                if (target.parentElement) {
                                  target.parentElement.style.display = "none";
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-400 font-medium">No img</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors duration-200">
                            {product.name || "Unknown Product"}
                          </div>
                          {product.brand && (
                            <div className="text-sm text-gray-500 truncate mt-0.5 group-hover:text-gray-600 transition-colors duration-200">
                              {product.brand}
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                      })}
                    </div>
                  ) : (
                    <div className="px-6 py-8 text-center">
                      <p className="text-gray-800 font-semibold mb-2 text-base">
                        No results found
                      </p>
                      <p className="text-sm text-gray-500">
                        Try searching with different keywords or check your spelling
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
