export default function Loading() {
  return (
    <>
      <style>
        {`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                50%, 100% { /* Adjust this percentage to control the speed of rotation */
                  transform: rotate(180deg);
                }
              }
            `}
      </style>
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 animate-spin ease-linear"
          style={{
            animation: `spin 1.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite`,
          }}
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        <h1 className="text-3xl font-semibold">Entropy</h1>
      </div>
    </>
  );
}
