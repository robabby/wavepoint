"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}

export function ImageLightbox({
  images,
  currentIndex,
  onIndexChange,
  open,
  onOpenChange,
  productName,
}: ImageLightboxProps) {
  const hasMultipleImages = images.length > 1;

  const goToPrevious = useCallback(() => {
    if (hasMultipleImages) {
      onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    }
  }, [currentIndex, images.length, hasMultipleImages, onIndexChange]);

  const goToNext = useCallback(() => {
    if (hasMultipleImages) {
      onIndexChange(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    }
  }, [currentIndex, images.length, hasMultipleImages, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goToPrevious, goToNext]);

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/90 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        >
          {/* Hidden title for accessibility */}
          <DialogPrimitive.Title className="sr-only">
            {productName} - Image {currentIndex + 1} of {images.length}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Fullscreen image viewer. Use arrow keys to navigate between images.
          </DialogPrimitive.Description>

          {/* Close button */}
          <DialogPrimitive.Close
            className={cn(
              "absolute right-4 top-4 z-50 rounded-full p-2",
              "bg-background/80 text-muted-foreground",
              "transition-colors hover:bg-card hover:text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-black"
            )}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          {/* Previous button */}
          {hasMultipleImages && (
            <button
              onClick={goToPrevious}
              className={cn(
                "absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full p-2",
                "bg-background/80 text-muted-foreground",
                "transition-colors hover:bg-card hover:text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-black"
              )}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Image container */}
          <div className="relative h-[80vh] w-[90vw] max-w-5xl">
            <Image
              src={currentImage}
              alt={`${productName} - View ${currentIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next button */}
          {hasMultipleImages && (
            <button
              onClick={goToNext}
              className={cn(
                "absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full p-2",
                "bg-background/80 text-muted-foreground",
                "transition-colors hover:bg-card hover:text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-black"
              )}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Image counter / dot indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onIndexChange(index)}
                  className={cn(
                    "h-2 rounded-full transition-[width,background-color]",
                    index === currentIndex
                      ? "w-6 bg-[var(--color-gold)]"
                      : "w-2 bg-[var(--color-warm-gray)]/50 hover:bg-[var(--color-warm-gray)]"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={index === currentIndex ? "true" : undefined}
                />
              ))}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
