import { useEffect } from "react";

interface UseBodyScrollLockOptions {
  disabledPaths?: string[];
  currentPath?: string;
}

export const useBodyScrollLock = (
  isOpen: boolean,
  options?: UseBodyScrollLockOptions
) => {
  useEffect(() => {
    if (options?.disabledPaths && options?.currentPath) {
      if (
        options.disabledPaths.some((path) =>
          options.currentPath?.startsWith(path)
        )
      ) {
        document.body.style.overflow = "";
        return;
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, options?.disabledPaths, options?.currentPath]);
};
