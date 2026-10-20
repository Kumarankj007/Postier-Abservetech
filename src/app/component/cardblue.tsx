export default function Cardblue(props: {
  children?: React.ReactNode;
  altStyle?: string;
  curved?: boolean;
}) {
  const { children = <></>, altStyle = "", curved = false } = props;
  return (
    <div
      className={
        (curved ? "rounded-3xl" : "rounded-xl") +
        ` ${altStyle} border-2 border-[#004080] w-full duration-200`
      }
    >
      {children}
    </div>
  );
}
