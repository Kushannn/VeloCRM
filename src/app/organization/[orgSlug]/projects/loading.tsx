"use client";

export default function Loading() {
  return (
    <div className="px-4 space-y-6 bg-[#09080f] min-h-screen animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-10 w-48 bg-[#1a1232] rounded-md mb-2" />
          <div className="h-4 w-32 bg-[#1a1232] rounded-md" />
        </div>

        <div className="h-11 w-36 bg-[#1a1232] rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-[#110f1a] border border-[#2a2040] rounded-xl px-5 py-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-[#2a2040]" />
                <div className="h-4 w-20 bg-[#2a2040] rounded" />
              </div>

              <div className="h-8 w-8 bg-[#2a2040] rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((card) => (
          <div
            key={card}
            className="bg-[#110f1a] border border-[#2a2040] rounded-xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-7 w-24 bg-[#2a2040] rounded-full" />
              <div className="h-8 w-8 bg-[#2a2040] rounded-lg" />
            </div>

            <div>
              <div className="h-6 w-3/4 bg-[#2a2040] rounded mb-2" />
              <div className="h-4 w-full bg-[#2a2040] rounded mb-1" />
              <div className="h-4 w-2/3 bg-[#2a2040] rounded" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((stat) => (
                <div
                  key={stat}
                  className="bg-[#0e0c17] border border-[#2a2040] rounded-xl px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#2a2040] rounded" />
                    <div className="flex-1">
                      <div className="h-3 w-12 bg-[#2a2040] rounded mb-2" />
                      <div className="h-5 w-8 bg-[#2a2040] rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#2a2040]">
              <div className="flex items-center">
                {[1, 2, 3].map((avatar) => (
                  <div
                    key={avatar}
                    className={`w-7 h-7 rounded-full bg-[#2a2040] border-2 border-[#09080f] ${
                      avatar !== 1 ? "-ml-2" : ""
                    }`}
                  />
                ))}
              </div>

              <div className="h-4 w-24 bg-[#2a2040] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
