export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`font-sans h-screen w-full gradient-section flex items-center justify-center`}
    >
      <div className="w-[50%] max-w-xl mx-auto shadow-sm rounded-2xl bg-white p-4 min-h-[400px] flex-col items-center">
        {children}
      </div>
    </div>
  );
}
