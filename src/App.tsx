import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect } from 'react';

export function App() {
  return <Welcome />;
}

function Welcome() {
  useEffect(() => {
    sdk.actions.ready();
  });

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-center">
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl 2xl:text-6xl 4xl:text-7xl font-bold text-gray-900 font-sans">
          <span>On-Chain Wrapped</span>
        </h1>

        <p className="text-xl md:text-2xl 2xl:text-3xl 4xl:text-4xl text-gray-600">
          Your decentralized year in review is coming soon
        </p>

        {/* <div className="pt-6">
          <button className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-200 text-lg">
            Get Notified
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div> */}

        <p className="text-sm text-gray-500 pt-8">Follow us for updates</p>

        <div className="flex justify-center space-x-6 pt-2">
          {socialLinks.map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              aria-label={label}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

const socialLinks = [
  {
    href: "https://warpcast.com",
    label: "Farcaster",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"
          fill="currentColor"
        />
        <path
          d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"
          fill="currentColor"
        />
        <path
          d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    href: "https://x.com",
    label: "X (Twitter)",
    icon: (
      <svg
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];
