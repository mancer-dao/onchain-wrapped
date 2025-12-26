import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";
import { errors, type ErrorCode } from "./errors";
import { apiClient } from "./api-client";

function ErrorScreen({ code }: { code: ErrorCode }) {
  if (code === errors.NO_ERROR) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
          the Oracle said
        </h2>

        <p className="text-gray-500 mt-8">
          {code === errors.IMMATURE_ACCOUNT
            ? "You path have just started and your future holds infinite posibilities. Now go!"
            : "There is some obstacle that is blocking me from discovering your future. Come back later."}
        </p>
        {code !== errors.IMMATURE_ACCOUNT && (
          <p className="text-sm text-gray-300 mt-24">error code {code}</p>
        )}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
          the Oracle is looking inside
        </h2>

        <p className="text-sm text-gray-500 mt-8 animate-pulse">
          This may take up to 10 seconds...
        </p>
      </div>
    </div>
  );
}

function Slideshow({ predictions }: { predictions: string[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % predictions.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + predictions.length) % predictions.length,
    );
  };

  const currentPrediction = predictions[currentSlide];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 text-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-purple-900 font-bold text-sm">O</span>
          </div>
          <span className="font-semibold">Farcaster Oracle</span>
        </div>
        <div className="text-sm opacity-75">
          {currentSlide + 1} of {predictions.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl w-full text-center text-white">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <p className="text-lg md:text-xl leading-relaxed">
              {currentPrediction}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center p-6">
        <button
          type="button"
          onClick={prevSlide}
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition-colors duration-200 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Previous</span>
        </button>

        <div className="flex space-x-2">
          {Array(predictions.length)
            .fill(0)
            .map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full transition-colors duration-200 flex items-center space-x-2"
        >
          <span>Next</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function App() {
  const [userFid, setUserFid] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<ErrorCode>(errors.NO_ERROR);
  const [predictions, setPredictions] = useState<string[]>([]);

  useEffect(() => {
    sdk.actions.ready();

    const getUserContext = async () => {
      console.debug("Getting user context...");
      try {
        const context = await sdk.context;
        if (context?.user?.fid) {
          setUserFid(context.user.fid);
          console.debug("set user context:", context.user);
        }
      } catch (err) {
        console.error("Failed to get user context:", err);
      }
    };

    getUserContext();
  }, []);

  const fetchPredictions = async () => {
    if (!userFid) return;

    setIsLoading(true);

    try {
      const apiPromise = apiClient.api.predictions[":fid"].$post({
        param: { fid: userFid.toString() },
      });
      const loadingPromise = new Promise<void>((resolve) =>
        setTimeout(resolve, 5_000),
      );

      const [apiResponse] = await Promise.all([apiPromise, loadingPromise]);
      const data = await apiResponse.json();

      // Handle the response
      if (data.code) {
        setErrorCode(data.code);
        return;
      }

      // if (data.error) {
      //   console.error("API error:", data.error);
      //   setErrorCode(errors.UNKNOWN_ERROR);
      //   return;
      // }

      if (data.predictions) {
        setPredictions(data.predictions);
        console.debug("predictions set:", data.predictions);
      }
    } catch (err) {
      console.error("Error in fetchPredictions:", err);
      setErrorCode(errors.UNKNOWN_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (errorCode) {
    return <ErrorScreen code={errorCode} />;
  }

  if (predictions && predictions.length > 0) {
    return <Slideshow predictions={predictions} />;
  }

  return (
    <Welcome
      userFid={userFid}
      isLoading={isLoading}
      predictions={predictions}
      onFetchPredictions={fetchPredictions}
    />
  );
}

function Welcome({
  userFid,
  isLoading,
  onFetchPredictions,
}: {
  userFid: number | null;
  isLoading: boolean;
  predictions: any;
  onFetchPredictions: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl 2xl:text-6xl 4xl:text-7xl font-bold text-gray-900 mb-2">
          Farcaster Oracle
        </h1>

        <h2 className="text-xl md:text-2xl 2xl:text-3xl 4xl:text-4xl text-gray-600">
          Your decentralized prediction for year 2026
        </h2>

        <div className="pt-6">
          <button
            type="button"
            onClick={onFetchPredictions}
            disabled={!userFid || isLoading}
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors duration-200 text-lg"
          >
            {isLoading ? "Loading Predictions..." : "listen to my prediction"}
            {!isLoading && (
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
            )}
          </button>
        </div>

        <p className="text-sm text-gray-500 pt-8">
          {userFid ? `Your FID: ${userFid}` : "Loading user FID..."}
        </p>

        <p className="text-sm text-gray-500 pt-8 mt-4">Follow us for updates</p>

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
