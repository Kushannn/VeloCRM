import React from "react";

import { Chip } from "@heroui/chip";

function HomeSignedOut() {
  return (
    <>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center h-full flex-col ">
          <Chip
            variant="dot"
            color="warning"
            className="border-2 border-gray-800 p-6 text-md mb-10"
          >
            From Leads To Loyalty - Manage it all in one place
          </Chip>

          <div className="w-fit mx-auto text-center">
            <div className="text-6xl bg-clip-text text-transparent bg-gradient-to-b from-[#FCFCFC] via-[#B0B0B0] to-[#7B7B7B] leading-tight">
              Grow Faster, Work Smarter –<br />
              Your Ultimate CRM
            </div>

            <div className="mt-4 text-lg text-[#7B7B7B]">
              <div className="">
                Streamline customer relationships, automate workflows, and
              </div>
              <div className="text-center">
                gain valuable insights to make smarter decisions
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-4 pt-4 text-center"></div>
        <div className="border-t border-red-800 mt-4 pt-4 text-center"></div>
        <div className="border-t border-blue-800 mt-4 pt-4 text-center"></div>
        <div className="border-t border-violet-800 mt-4 pt-4 text-center"></div>
      </div>
    </>
  );
}

export default HomeSignedOut;
