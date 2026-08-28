import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Lore Schwartz",
  description: "Design and photography portfolio of Lore Schwartz, a Montréal based filmmaker, designer and software engineer.",
  icons: {
    icon: [
      { url: "/favicon.png?v=2", type: "image/png", sizes: "32x32" },
    ],
  },
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
