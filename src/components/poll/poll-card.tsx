'use client'

import dynamic from 'next/dynamic'
import { Button } from '../ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'
import { PollResult } from "./poll-result"
import { useActions, useAIState, useUIState } from 'ai/rsc'

export const PollCard = () => {
    const [isVoted, setIsVoted] = React.useState(false)
    const { voteForCandidate } = useActions()

    const onVote = () => {
        setTimeout(() => {
            setIsVoted(true)
            voteForCandidate("Ranil")
        }, 3000)
    }

    return <AnimatePresence mode="popLayout">
        {isVoted && <PollResult />}

        {isVoted == false && <motion.div
            layoutId='poll-card'
            className="flex flex-col items-center w-full"
            initial={{
                opacity: 0.0,
                y: 10
            }}
            animate={{
                opacity: 1.0,
                y: 0
            }}
            exit={{
                opacity: 0.0,
                y: 10
            }}

        >
            <h1 className="text-[24px] font-bold ">Make Your Vote</h1>
            <div className="flex w-full space-x-2 ">
                <PollItem
                    name='RANIL'
                    image='/graphics/poll-card-ranil.png'
                    backgroundColor='#54BA43'
                    nameColor='#153601'
                    imageWidth='80%'
                    onVoted={onVote}
                />
                <PollItem
                    name='ANURA'
                    image='/graphics/poll-card-anura.png'
                    backgroundColor='#9A0B25'
                    nameColor='#2F0014'
                    imageWidth='100%'
                    onVoted={onVote}
                />
                <PollItem
                    name='SAJITH'
                    image='/graphics/poll-card-sajith.png'
                    backgroundColor='#0CBF7F'
                    nameColor='#0A3103'
                    imageWidth='100%'
                    onVoted={onVote}
                />
            </div>
        </motion.div>}
    </AnimatePresence>

}



function PollItem({
    name,
    image,
    backgroundColor,
    nameColor,
    imageWidth,
    onVoted
}: {
    name: string,
    image: string,
    backgroundColor: string,
    nameColor: string,
    imageWidth: string,
    onVoted: () => void
}) {
    const [isSelected, setIsSelected] = React.useState(false)

    const onClick = () => {
        setIsSelected(true)
        onVoted()
    }



    return <motion.div className="relative w-full rounded-[5px]"
        whileHover={isSelected ? "" : "hover"}
        style={{
            backgroundImage: `url(/graphics/poll-card-background.png)`,
            backgroundSize: "cover",
            aspectRatio: "604/884",
            backgroundColor: backgroundColor
        }}
    >
        <motion.div className="absolute w-full h-full"
            initial={{
                backgroundColor: "#000000a3",
            }}
            animate={isSelected ? "selected" : ""}

            variants={{
                selected: {
                    backgroundColor: "#00000000"
                }
            }}
        >

        </motion.div>

        <div className="flex absolute w-full justify-center bottom-[67%]">
            <motion.p className=' font-bold text-4xl'
                style={{
                    color: nameColor
                }}
                animate={isSelected ? "selected" : ""}
                initial={{
                    opacity: 0.0,
                    y: 10
                }}
                variants={{
                    selected: {
                        opacity: 1.0,
                        y: 0
                    }
                }}
            >
                {name}
            </motion.p>
        </div>

        <img className="absolute bottom-0 left-0 "
            style={{
                width: imageWidth
            }}
            src={image}
        />

        <div className=""></div>



        <div className="absolute bottom-4 flex w-full">
            <motion.div className="flex w-full justify-center"
                animate={{
                    opacity: 0.0,
                    y: 10
                }}
                initial={{
                    opacity: 0.0,
                    y: 10
                }}
                variants={{
                    hover: {
                        opacity: 1.0,
                        y: 0
                    }
                }}
            >
                <Button onClick={onClick} className='bg-[#1C9645] hover:bg-[#1C9645A3]'>
                    Vote for {name}
                </Button>
            </motion.div>
        </div>


    </motion.div>
}