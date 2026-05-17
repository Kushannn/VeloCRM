import React from "react";

import { Chip } from "@heroui/chip";
import { Card } from "@heroui/react";
import { Clock } from "lucide-react";

import baseImage from "../../public/baseImage1.jpg";

function HomeSignedOut() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center h-screen flex-col ">
          <Chip
            variant="dot"
            color="warning"
            className="border-2 border-gray-800 p-6 text-md mb-10"
          >
            From Leads To Loyalty - Manage it all in one place
          </Chip>

          <div className="w-fit mx-auto text-center">
            <div className="text-6xl bg-clip-text text-transparent bg-linear-to-b from-[#FCFCFC] via-[#B0B0B0] to-[#7B7B7B] leading-tight">
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
        <div className=" mt-4 pt-4 text-center h-screen">
          <div className="flex flex-row">
            <Card
              // isBlurred
              className="w-[30%] mx-auto bg-[#141414] rounded-lg backdrop-blur-lg"
            >
              <Card.Content className="p-6">
                <span>
                  <Clock />
                </span>

                <span className="text-md bg-clip-text text-transparent bg-linear-to-b from-[#FCFCFC]  to-[#7B7B7B] leading-tight mt-8 mb-3">
                  Real-Time Analytics & Reporting
                </span>

                <span className="text-[#7B7B7B]">
                  Get a comprehensive view of your business performance with
                  live mertrics , sales trends
                </span>
              </Card.Content>
            </Card>
            <Card className="w-[30%] mx-auto bg-[#141414] backdrop-blur-lg rounded-lg">
              <Card.Content className="p-6">
                <span>
                  <Clock />
                </span>

                <span className="text-md bg-clip-text text-transparent bg-linear-to-b from-[#FCFCFC]  to-[#7B7B7B] leading-tight mt-8 mb-3">
                  Real-Time Analytics & Reporting
                </span>

                <span className="text-[#7B7B7B]">
                  Get a comprehensive view of your business performance with
                  live mertrics , sales trends
                </span>
              </Card.Content>
            </Card>
            <Card className="w-[30%] mx-auto bg-[#141414] rounded-lg backdrop-blur-lg">
              <Card.Content className="p-6">
                <span>
                  <Clock />
                </span>

                <span className="text-md bg-clip-text text-transparent bg-linear-to-b from-[#FCFCFC]  to-[#7B7B7B] leading-tight mt-8 mb-3">
                  Real-Time Analytics & Reporting
                </span>

                <span className="text-[#7B7B7B]">
                  Get a comprehensive view of your business performance with
                  live mertrics , sales trends
                </span>
              </Card.Content>
            </Card>
          </div>

          <Card className="mx-auto bg-[#141414] mt-8 w-[92vw] backdrop-blur-lg rounded-lg">
            <Card.Content className="p-6 flex flex-row justify-around">
              <div className="ml-14 mt-8 w-[40%]">
                <div className="text-md bg-clip-text text-transparent bg-linear-to-b from-[#FCFCFC]  to-[#7B7B7B] leading-tight mt-5 mb-3 text-4xl">
                  Workflow with a <br /> Smart CRM
                </div>
                <span className="text-[#7B7B7B]">
                  Streamline your operations with an intelligent <br /> CRM that
                  automates tasks, tracks leads
                </span>

                <div>
                  <div className="mt-10 flex items-start gap-4">
                    {/* Vertical Gradient Line */}
                    <span className="w-0.5 h-22 bg-linear-to-b from-[#FCFCFC] via-[#B0B0B0] to-[#7B7B7B]" />

                    <div>
                      <div className="bg-clip-text text-transparent bg-linear-to-b from-[#FCFCFC]  to-[#7B7B7B] leading-tight mb-3">
                        Sales & Lead Tracking
                      </div>
                      <span className="text-[#7B7B7B]">
                        Access all customer interactions, history and <br />
                        preferences in one place for better relationships.
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mt-10 flex items-start gap-4">
                    {/* Vertical Gradient Line */}
                    <span className="w-0.5 h-7 bg-linear-to-b from-[#FCFCFC] via-[#B0B0B0] to-[#7B7B7B]" />

                    <div>
                      <div className="bg-clip-text text-transparent bg-linear-to-b from-[#FCFCFC]  to-[#7B7B7B] leading-tight mb-3">
                        Task & Team Collaboration
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mt-10 flex items-start gap-4">
                    {/* Vertical Gradient Line */}
                    <span className="w-0.5 h-7 bg-linear-to-b from-[#FCFCFC] via-[#B0B0B0] to-[#7B7B7B]" />

                    <div>
                      <div className="bg-clip-text text-transparent bg-linear-to-b from-[#FCFCFC]  to-[#7B7B7B] leading-tight mb-3">
                        360° Team Management
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src={baseImage.src}
                  alt="Base Image"
                  className="w-full h-100 object-cover mt-8 rounded-lg"
                />
              </div>
            </Card.Content>
          </Card>
        </div>
        <div className="border-t border-blue-800 mt-52 pt-4 h-screen">
          <div className="mt-5 text-left ml-10">
            <span className="text-4xl bg-clip-text text-transparent bg-linear-to-b from-[#FCFCFC] via-[#B0B0B0] to-[#7B7B7B] leading-tight">
              The Smart Workflow For <br /> Business Success
            </span>
            <div className="mt-4 text-[#7B7B7B]">
              Achieve efficiency and growth with a smart workflow system <br />
              that keeps your team organized and productive.
            </div>
          </div>
        </div>
        <div className="border-t border-violet-800 mt-4 pt-4 text-center h-[100h]"></div>
      </div>
    </>
  );
}

export default HomeSignedOut;
