import Image from 'next/image';
import { useState } from 'react';

const ImageWithFallback = ({ src, alt,width,height,className,defaultimg }:any) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(defaultimg ? defaultimg : '/svg/icon/adddoc.svg');
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      onError={handleError}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default ImageWithFallback
