import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI, AIState } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage, } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  const exampleMessages = [
    {
      heading: 'Compared to the',
      subheading: 'Theravada economy by Ranil, what are the measures will be taken for the economy by Anura?',
      message: `Compared to Theravada economy by Ranil, what are the measures will be taken for the economy by Anura?`
    },
    {
      heading: 'What are the',
      subheading: 'economic and education vision of Anura Kumara?',
      message: 'economic and education vision of Anura Kumara?'
    },
    {
      heading: 'When will the ',
      subheading: ' presidential election happen?',
      message: 'When will the  presidential election happen?'
    },

    {
      heading: 'What are the',
      subheading: ` steps should i follow to vote?`,
      message: `What are the  steps should i follow to vote?`
    }
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-background from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${index > 1 && 'hidden md:block'
                  }`}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        {false && messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <SuggestionsPanel scrollToBottom={scrollToBottom} />

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

function SuggestionsPanel({ scrollToBottom }: { scrollToBottom: () => void }) {
  const [messages, setMessages] = useUIState<typeof AI>()
  const [aiState] = useAIState()
  const { submitUserMessage, } = useActions()
  console.log((aiState as AIState).suggestions)

  const suggestions = (aiState as AIState).suggestions

  return <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0 mb-2">
    {/* {
      aiState.suggestions?.length > 0 && (
        
      )
    } */}

    {suggestions.map((suggestion, index) => (
      <div
        key={index}
        className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${index > 1 && 'hidden md:block'
          }`}
        onClick={async () => {
          setMessages(currentMessages => [
            ...currentMessages,
            {
              id: nanoid(),
              display: <UserMessage>{suggestion}</UserMessage>
            }
          ])

          const responseMessage = await submitUserMessage(
            suggestion
          )

          setMessages(currentMessages => [
            ...currentMessages,
            responseMessage
          ])

          scrollToBottom()
        }}
      >
        <div className="text-sm font-semibold">{suggestion}</div>
      </div>
    ))}
  </div>
}
