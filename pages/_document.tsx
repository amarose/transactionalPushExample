import { Html, Head, Main, NextScript } from 'next/document'

declare global {
  interface Window {
    dataLayer: Array<any>;
    gtag: (...args: any[]) => void;
  }
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script charSet="UTF-8" src="https://s-eu-1.pushpushgo.com/js/651ff5c87582a8ac33d89ec6.js" async={true}></script>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3FV871C4QN"></script>
        <script
        dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){ dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', 'G-3FV871C4QN');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
