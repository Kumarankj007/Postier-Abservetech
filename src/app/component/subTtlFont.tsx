import Image from "next/image";

export const SubTitle = (props: {
  img?: string;
  title: string;
  subTtlFont?: string;
  size?: string;
}) => {
  const {
    img,
    title,
    subTtlFont = "font-normal sm:text-[17px] text-[16px] text-[#004080]",
    size = "22",
  } = props;
  return (
    <b className={`block mb-4 ` + subTtlFont}>
      {img && img != "" && (
        <Image
          height={Number(size)}
          width={Number(size)}
          src={img}
          alt={img}
          className={`object-contain inline mr-1 h-[${size}px] w-[${size}px]`}
        />
      )}
      {title}
    </b>
  );
};
