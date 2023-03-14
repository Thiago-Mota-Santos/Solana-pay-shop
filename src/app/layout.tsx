export const metadata = {
  title: "Solana Pay Store",
  description: "Compre itens na minha loja usando SolanaPlay",
  openGraph: {},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
