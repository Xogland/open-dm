
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      {/*<Script
        strategy="beforeInteractive"
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      />*/}
      {children}
    </>
  );
}
