"use client"
import { ElectionDetailsView } from "@/components/election-details";
import { ManifestoComparator } from "@/components/manifesto-comparator";
import { PollCard } from "@/components/poll/poll-card";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";



export default function Page() {
  const addResultMutation = api.electionResult.addResult.useMutation()
  return <div className="flex max-w-4xl mx-auto px-5">
    <Button onClick={() => {
      addResultMutation.mutateAsync({
        location: "Colombo"
      })
    }}>
      Add Result for Colombo
    </Button>
    <Button onClick={() => {
      addResultMutation.mutateAsync({
        location: "Galle"
      })
    }}>
      Add Result for Galler
    </Button>
  </div>
}
