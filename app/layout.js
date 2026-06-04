import './globals.css';

export const metadata = {
  title: 'AirDosa - AI-Powered Instant Dosa Delivery Drones',
  description:
    'Get piping-hot, crispy dosas baked in-flight and delivered to your doorstep in under 180 seconds via AI-powered supersonic drones. Welcome to the future of South Indian foodtech.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          name="description"
          content="Get piping-hot, crispy dosas baked in-flight and delivered to your doorstep in under 180 seconds via AI-powered supersonic drones. Welcome to the future of South Indian foodtech."
        />
        <meta
          name="keywords"
          content="AirDosa, dosa delivery drone, foodtech, Indian startup, AI dosa, instant delivery, Bengaluru foodtech"
        />
        <meta name="author" content="AirDosa Labs" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

      </head>
      <body>{children}</body>
    </html>
  );
}

