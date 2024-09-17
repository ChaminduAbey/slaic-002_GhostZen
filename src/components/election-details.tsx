"use client"

import { Card, CardContent } from "./ui/card"
import { motion } from "framer-motion"

export function ElectionDetailsView() {
    const electionData = [{
        title: "Step 1",
        image: "/graphics/election-step1.png",
        subTitle: "Go to the polling booth and wait in queue."
    }, {
        title: "Step 2",
        image: "/graphics/election-step2.png",
        subTitle: "Take your ballet and go the voting window."
    }, {
        title: "Step 3",
        image: "/graphics/election-step3.png",
        subTitle: "Mark your vote secretly."
    }, {
        title: "Step 4",
        image: "/graphics/election-step4.png",
        subTitle: "Put you ballet paper into the voting box."
    },]
    return <div className="grid grid-cols-2 items-center justify-center gap-4"
    // transition={{
    //     staggerChildren: 0.2
    // }}
    >
        {electionData.map((data, index) => {
            return <ElectionCard index={index} {...data} />
        })}
    </ div>
}

function ElectionCard({ index, title, subTitle, image }: { index: number, title: string, subTitle: string, image: string }) {
    return <motion.div
        initial={{
            opacity: 0,
            translateY: 100
        }}
        animate={{
            opacity: 1,
            translateY: 0,
        }}
        transition={{
            duration: 1,
            delay: index * 0.7
        }}


        className="  justify-self-start">
        <motion.div
            whileHover={{
                scale: 1.05
            }}
        >
            <Card className=" w-full p-4 rounded-[16px]">
                <CardContent className="flex flex-col space-y-3">
                    <h1 className="font-medium">
                        {title}
                    </h1>
                    <p className="text-sm">
                        {subTitle}
                    </p>
                    <img className="bg-[#FBECFF] p-2 rounded-[16px]" src={image} alt="" />
                </CardContent>
            </Card>
        </motion.div>
    </motion.div>
}