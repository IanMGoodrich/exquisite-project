import Image from "next/image";
import type { ComponentProps } from "react";
import './image.css'
type ImageProps = ComponentProps<typeof Image>;

const ImageWrapper = ({
  className,
  src,
  alt,
  ...props
}: ImageProps & {
  className?: string;
  variant?: "profile" | "story" | "thumbnail" | "display" | "circle";
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      className={`custom-image-component ${className || ""}`}
      loading="lazy"
      variant={props.variant}
      {...props}
    />
  );
};

export default ImageWrapper;