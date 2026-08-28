import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Lore Schwartz",
  description: "Design and photography portfolio of Lore Schwartz, the a Montreal based filmaker and software engineer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
