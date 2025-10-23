import DasboardWrapper from "./DasboardWrapper";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`font-sans h-screen w-full flex relative`}>
      <DasboardWrapper>{children}</DasboardWrapper>
    </div>
  );
}
