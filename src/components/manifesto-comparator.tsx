"use client"
import { Separator } from "./ui/separator"

export function ManifestoComparator() {
    return <div className="flex w-full space-x-4" >
        <Manifesto />
        <Manifesto />
    </div>
}

function Manifesto() {
    return (
        <div className="flex-1 flex flex-col space-y-4 bg-[#D8D9CD] rounded-[16px] p-4">
            <div className="flex space-x-4 items-center">
                <div className="h-24 w-24 bg-[#54BA43] rounded-full">
                    <img
                        className="rounded-full h-full w-full object-cover"
                        src="graphics/poll-card-ranil.png"
                        alt=""
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <h2 className="font-bold text-[24px]">Ranil Wickramsinghe</h2>
                    <p className="font-light text-base">Puluwan Sri Lanka</p>
                </div>
            </div>
            <Separator />

            <div className="flex flex-col">
                <p className="font-medium text-lg">Five-Year Mission</p>
                <ul

                    className="list-disc px-5 text-sm space-y-1"
                >
                    <li>Ranil Wickremesinghe expresses his commitment to rebuilding Sri Lanka post-crisis, despite significant challenges, such as political and economic instability.</li>
                    <li>Ranil Wickremesinghe expresses his commitment to rebuilding Sri Lanka post-crisis, despite significant challenges, such as political and economic instability.</li>
                    <li>Ranil Wickremesinghe expresses his commitment to rebuilding Sri Lanka post-crisis, despite significant challenges, such as political and economic instability.</li>
                </ul>
            </div>
        </div>
    );
}
