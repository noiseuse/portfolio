import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Lore Schwartz",
  description: "Design and photography portfolio of Lore Schwartz, a Montréal based filmmaker, designer and software engineer.",
  openGraph: {
    images: [
      {
        url: "/photography/traction/19.jpg",
        width: 600,
        height: 400,
        alt: "Lore Schwartz Portfolio",
      },
    ]
  }
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
