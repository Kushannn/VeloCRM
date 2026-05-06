"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import useFetchOrganization from "@/hooks/useFetchOrganization";
import useFetchOrgMembers from "@/hooks/useFetchOrgMembers";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import AddLead from "@/components/addLead/AddLead";
import { useEffect, useState } from "react";
import { LeadType } from "@/lib/types";

export default function LeadPage() {
  const user = useAppSelector((state) => state.auth.user);

  useFetchOrganization();
  useFetchOrgMembers();

  const organization = useAppSelector((state) => state.organization.currentOrg);
  const orgMembers = useAppSelector((state) => state.organization.members);

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  const [currentLeads, setCurrentLeads] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCurrentLeads = async () => {
      console.log("Inside the function");
      setLoading(true);
      if (!organization) return;

      try {
        console.log("Fetching the leads");
        const res = await fetch(
          `/api/organization/${organization.id}/leads/get-leads`
        );
        const data = await res.json();
        if (data.success) {
          setCurrentLeads(data.leads);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching leads", error);
      } finally {
        setLoading(false);
      }
    };

    getCurrentLeads();
  }, []);

  useEffect(() => {
    console.log("currentLeads", currentLeads);
  });

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div>
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl">Leads</h1>
              <p className="text-sm sm:text-base">
                Check all the current leads here!
              </p>
            </div>
            <Button
              className="h-8 bg-gradient-to-r from-[#893168] to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-md shadow-purple-500/20"
              onClick={() => setIsAddLeadModalOpen(true)}
            >
              <Plus /> <span>Add New Lead</span>
            </Button>
          </div>

          {loading && (
            <>
              <div>Loading your leads</div>
            </>
          )}

          {currentLeads.length > 0 && !loading ? (
            <>
              {currentLeads.map((lead: LeadType) => {
                return (
                  <div className="flex justify-center items-center">
                    <Card className="border-white border-1 h-20 bg-red w-[80%] mt-5 transition-transform transform hover:scale-105 hover:shadow-2xl">
                      <CardBody>
                        <div className="text-white flex flex-row justify-evenly items-center">
                          <div>
                            <p>{lead.name}</p>
                          </div>
                          <div>
                            <p>{lead.email}</p>
                          </div>
                          <div>
                            Source
                            <p>{lead.source}</p>
                          </div>
                          <div>
                            Assigned To
                            <p>Kushan</p>
                          </div>
                          <div>{lead.status}</div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div>No leads yet!</div>
            </>
          )}
        </div>
      </div>

      <AddLead
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        organizationId={organization?.id!}
      />
    </>
  );
}
