import "./globals.css";

export const metadata = {
  title: "Real Ecommerce Profit",
  description: "Ecommerce profit calculator — real profit & break-even ROAS."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
