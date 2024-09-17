import { ManifestoComparator } from "@/components/manifesto-comparator";
import { PollCard } from "@/components/poll/poll-card";

export default function Page() {
  return (
    <div className="mx-auto flex max-w-4xl px-5">
      <ManifestoComparator />
    </div>
  );
}
