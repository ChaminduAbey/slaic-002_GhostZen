import { ElectionDetailsView } from "@/components/election-details";
import { ManifestoComparator } from "@/components/manifesto-comparator";
import { PollCard } from "@/components/poll/poll-card";

export default function Page() {
    return <div className="flex max-w-4xl mx-auto px-5">
        <ElectionDetailsView />
    </div>
}