"use client"
import { ComparatorContent } from "@/lib/types";
import { Separator } from "./ui/separator"

export function ManifestoComparator({ comparisonData }: { comparisonData: ComparatorContent[] }) {
    return <div className="flex w-full space-x-4" >
        {comparisonData.map((data, index) => (
            <Manifesto key={index} {...data} />
        ))}
    </div>
}


function Manifesto(data: ComparatorContent) {

    let imageUrl = "";
    let politicalParty = "";
    let bgColor = "";

    if (data.candidate.includes("Ranil")) {
        imageUrl = "graphics/poll-card-ranil.png";
        politicalParty = "Puluwan Sri Lanka";
        bgColor = "bg-[#54BA43]";

    } else if (data.candidate.includes("Sajith")) {
        imageUrl = "graphics/poll-card-sajith.png";
        politicalParty = "Samagi Jana Sandanaya";
        bgColor = "bg-[#0CBF7F]";

    } else if (data.candidate.includes("Anura")) {
        imageUrl = "graphics/poll-card-anura.png";
        politicalParty = "National People's Party";
        bgColor = "bg-[#9A0B25]";
    }

    // const cleanContent = data.content.replace(/【.*?】/g, '').split('\n').map((line, index) => {
    //     if ((line.startsWith('- **') && line.endsWith('**')) || (line.startsWith('**') && line.endsWith('**'))) {
    //         const title = line.replace(/-?\s*\*\*/g, '').trim();  
    //         return (
    //             <h3 key={index} className="font-bold text-lg mt-4 mb-2">
    //                 {title}
    //             </h3>
    //         );
    //     } else {
    //         return (
    //             <li key={index} className="text-base leading-6 mb-2">
    //                 {line.replace('-', '').trim()}
    //             </li>
    //         );
    //     }
    // });

    const cleanContent = data.content.replace(/【.*?】/g, '').split('\n').map((line, index) => {
        if (/^\d+\.\s\*\*/.test(line)) {
            const title = line.replace(/^\d+\.\s*\*\*/g, '').replace(/\*\*$/, '').trim();  // Remove number and '**'
            return (
                <h3 key={index} className="font-bold text-lg mt-4 mb-2">
                    {title}
                </h3>
            );
        }
        else if ((line.startsWith('- **') && line.endsWith('**')) || (line.startsWith('**') && (line.endsWith('**') || line.endsWith('**  ')))) {
            const title = line.replace(/-?\s*\*\*/g, '').trim();  // Remove '- **' or '**'
            return (
                <h3 key={index} className="font-bold text-lg mt-4 mb-2">
                    {title}
                </h3>
            );
        } 
        else if (line.startsWith('   -')) {
            return (
                <li key={index} className="text-base leading-6 ml-8 mb-2">
                    {line.replace('   -', '').trim()}
                </li>
            );
        } else if (line.startsWith('-')) {
            return (
                <li key={index} className="text-base leading-6 mb-2">
                    {line.replace('-', '').trim()}
                </li>
            );
        } else {
            return line; 
        }
    });

    return (
        <div className="flex-1 flex flex-col space-y-4 bg-[#D8D9CD] rounded-[16px] p-4">
            <div className="flex space-x-4 items-center">
                <div className={`h-24 w-24 ${bgColor} rounded-full`}>
                    <img
                        className="rounded-full h-full w-full object-cover"
                        src={imageUrl}
                        alt=""
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <h2 className="font-bold text-[24px]">{data.candidate}</h2>
                    <p className="font-light text-sm">{politicalParty}</p>
                </div>
            </div>
            <Separator />

            <div className="flex flex-col">
                {cleanContent}
            </div>
        </div>
    );
}
