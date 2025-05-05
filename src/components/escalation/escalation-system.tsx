"use client";

import { getEscalations } from "@/lib/escalation-service";
import { Escalation, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import EscalationDetail from "./escalation-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import EscalationList from "./escalation-list";
import EscalationForm from "./escalation-form";

interface EscalationSystemProps {
  currentUser: User;
}

export default function EscalationSystem({
  currentUser,
}: EscalationSystemProps) {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [selectedEscalation, setSelectedEscalation] =
    useState<Escalation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "open" | "resolved">(
    "all"
  );

  useEffect(() => {
    //Load escalation from local storage
    const loadedEscalation = getEscalations(currentUser.id);
    setEscalations(loadedEscalation);
  }, [currentUser.id]);

  const handleEscalationCreated = (newEscalation: Escalation) => {
    setEscalations((prev) => [...prev, newEscalation]);
    setIsFormOpen(false);
  };

  const handleSelectedEscalation = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
  };

  const handleBackToList = () => {
    setSelectedEscalation(null);
  };

  const filteredEscalation = escalations.filter((escalation) => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return escalation.status !== "resolved";
    if (activeTab === "resolved") return escalation.status === "resolved";

    return true;
  });

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-teal-800">Escalations</h2>
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => setIsFormOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Escalation
          </Button>
        </div>
      </div>

      {selectedEscalation ? (
        <EscalationDetail
          escalation={selectedEscalation}
          onBack={handleBackToList}
        />
      ) : (
        <>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "all" | "open" | "resolved")
            }
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <EscalationList
                escalations={filteredEscalation}
                onSelectEscalation={handleSelectedEscalation}
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      <EscalationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onEscalationCreated={handleEscalationCreated}
        currentUser={currentUser}
      />
    </>
  );
}
