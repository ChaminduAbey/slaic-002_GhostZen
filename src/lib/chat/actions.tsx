import "server-only";

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue,
} from "ai/rsc";
import { openai } from "@ai-sdk/openai";

import OpenAI from "openai";

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
  Purchase,
} from "@/components/stocks";

import { z } from "zod";
import { Events } from "@/components/stocks/events";
import { StocksSkeleton } from "@/components/stocks/stocks-skeleton";
import { Stocks } from "@/components/stocks/stocks";
import { StockSkeleton } from "@/components/stocks/stock-skeleton";
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid,
  parseComparatorContent,
  getNews,
} from "@/lib/utils";
import { saveChat } from "@/app/actions";
import { SpinnerMessage, UserMessage } from "@/components/stocks/message";
import { Chat, Message } from "@/lib/types";
import { getServerAuthSession } from "@/server/auth";
import { PollCard } from "@/components/poll/poll-card";
import { ManifestoComparator } from "@/components/manifesto-comparator";
import { useEffect } from "react";
import { threadId } from "worker_threads";
import LaodingSkeleton from "@/components/ui/loading-skeleton";

import { zodResponseFormat } from "openai/helpers/zod";
import NewsCard from "@/components/ui/news-card";
import { ElectionDetailsView } from "@/components/election-details";
import { resolve } from "path";



async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content,
      },
    ],
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    // model: openai("gpt-3.5-turbo"),
    // initial: <SpinnerMessage />,
    // system: `\
    // You are a election related conversation bot. 
    // You and the user can dicuss regarding the political parties election, take a poll for the party they will vote for, in the UI.

    // Messages inside [] means that it's a UI element or a user event. For example:
    // - "[User was shown poll]" means that an UI of the poll was shown to user.
    // - "[User was shown comparator in the UI between Ranil and Anura]" mean the an UI of the manifesto comparator was shown to the user

    // If the user requests to vote in the poll, call \`showPoll\` to show the poll UI.
    // If user want to compare a the political manifesto of canditates, call \'showManifestoComparator'\ to show the comparator UI
    // If the user wants to see the manifesto of a candidate, call \'showManifesto\' to show the manifesto UI
    // If the user wants to read or fact check a news article, call \'newsReader\' to show the news article
    // If the user complete another impossible task or unrelated task, respond that you are a demo and cannot do that.


    // Besides that, you can also chat with users and explain to me them any things they are not clear.`,

    model: openai("gpt-4o"),
    initial: <SpinnerMessage />,
    system: `\

    Role:
    You are a election related conversation chat bot.

    Instructions:
    You and the user can dicuss regarding the 2024 Sri Lanka Presidential Election.

    There are 3 main candidates for 2024 Sri Lanka Presidential Election and their basic information.

    1. Name: Ranil Wickramasinghe, Political Party: Puluwan Sri Lanka
    Ranil Wickremesinghe, born on 24 March 1949 in Colombo, is the current and ninth President of Sri Lanka. Educated at Royal College, Colombo, and the University of Ceylon (now University of Colombo), he has led the United National Party (UNP) since 1994. Wickremesinghe has served as Prime Minister of Sri Lanka six times, making him a prominent figure in the country's political landscape. He has been named the presidential candidate for the Puluwan Sri Lanka party for the 2024 Sri Lankan presidential election.

    2. Name: Anura Kumara, Political Party: National People's Power
    Anura Kumara Dissanayake, born on 24 November 1968 in Thambuthegama, Sri Lanka, graduated from the University of Kelaniya in 1995 with a degree in physical science. He is the current leader of the Janatha Vimukthi Peramuna (JVP) since 2014 and of the National People's Power (NPP) since 2019. A Member of Parliament for the Colombo District, he was a presidential candidate in 2019 and has been named the NPP's candidate for the 2024 Sri Lankan presidential election.

    3. Name: Sajith Premadasa, Political Party: Samagi Jana Sandanaya
    Sajith Premadasa, born on 12 January 1967 in Colombo, entered politics after his father's assassination in 1993, joining the United National Party (UNP). Premadasa holds a degree in economics, politics, and international relations from the London School of Economics and the University of London. He has been named the presidential candidate for the Samagi Jana Sandanaya (SJS) for the 2024 Sri Lankan presidential election.
    
    -------------------------


    Here is a breif idea about the candidates manifesto:
    1. Ranil Wickranasinghe
    Ranil Wickremesinghe's manifesto emphasizes reform in education, healthcare, economic development, and governance. His education policies prioritize vocational training, offering youth job placements and allowances. In healthcare, he focuses on improving access for marginalized communities, especially plantation workers, and advocates for digital health systems. His economic vision includes transforming Sri Lanka into an export-driven economy, with a focus on agriculture, tourism, and modernizing key sectors like fisheries and manufacturing. He also outlines plans for environmental sustainability, promoting renewable energy and protecting biodiversity. Governance reforms include anti-corruption measures, digitalization, and policies for social justice and reconciliation.

    2. Anura Kumara
    Anura Kumara Dissanayake's manifesto focuses on education reform, healthcare, economic development, environmental sustainability, and social justice. It advocates for early childhood education, expanding vocational education, and increasing investment in public universities. The healthcare plan emphasizes universal healthcare, digitizing patient records, and improving public health. His economic vision includes supporting local production, entrepreneurship, and sustainable agriculture. Environmental goals center on renewable energy, reforestation, and resource conservation. Social policies promote gender equality, social protection for vulnerable families, and anti-corruption reforms, with an emphasis on governance transparency and accountability.

    3. Sajith Premadasa
    Sajith Premadasa's manifesto highlights reforms in education, healthcare, economic development, and governance. It advocates for modernizing education through digital platforms and STEEAM curricula, expanding vocational training, and improving higher education standards. Healthcare reforms focus on universal healthcare with initiatives like "Husma" and "Suraksha," emphasizing preventive care. Economic policies prioritize supporting MSMEs, modernizing agriculture with smart technology, and promoting digital infrastructure. Environmental goals include transitioning to 70% renewable energy by 2030. Governance reforms emphasize anti-corruption, judicial efficiency, and digitalizing government services. Social policies focus on empowering women, promoting equality, and improving public services.
    
    -------------------------

    The presidential electrion will be held on Saturday, 21st of September 2024.

    Steps:

    1. If the user requests to vote in the poll or to see the winning prediction of the election, call \`showPoll\` to show the poll UI.
    2. If user want to compare a the political manifesto or a particular part of manifesto of canditates , call \'showManifestoComparator'\ to show the comparator UI
    3. If the user wants to see the manifesto of a specific candidate or a particular part of manifesto, call \'showManifesto\' to show the manifesto UI
    4. If the user wants to read or fact check a news articles related to 2024 Sri Lanka Presidential Election or related to Sri Lanka Politics, call \'newsReader\' to show the news article UI
    5. If the users wants to know how to vote in the election, call \'
    6. If the user asked a general question related to the 2024 presidential election or general question about candidate, respond with a suitable answer.
    7. If the user complete another impossible task or unrelated task, respond that Sorry, I am designed only to help you with the 2024 Sri Lanka Presidential Election.

    8. Messages inside [] means that it's a UI element or a user event. For example:
    - "[User was shown poll]" means that an UI of the poll was shown to user.
    - "[User was shown comparator in the UI]" mean the an UI of the manifesto comparator was shown to the user

    End Goal:
    Help users to get a better understanding of the upcoming 2024 Sri Lanka Presidential Election, winning predictions, news article fact check & read and candidates and their manifesto.
    
    Narrow:
    1. You are not allowed to talk about anything other than the 2024 Sri Lanka Presidential Election.
    2. You cannot talk about any other country's election.
    3. You cannot provide false information about the election.
    `,

    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          suggestions: [
            "Compared to Theravada economy by Ranil, what are the measures will be taken for the economy by Anura.",
            "What are the economic and education vision of Anura Kumara?"
          ],
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content,
            },
          ],
        });
      } else {
        textStream.update(delta);
      }

      // console.log(aiState.get().messages);
      return textNode;
    },
    tools: {
      showElectionInstructions: {
        description: "Show user the election instruction ui",
        parameters: z.object({}),
        generate: async function* ({ }) {

          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            suggestions: ['What are the education qualifications of Ranil'],
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "showElectionInstructions",
                    toolCallId,
                    args: {},
                  },
                ],
              },
              {
                id: nanoid(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "showElectionInstructions",
                    toolCallId,
                    result: `User was shown instructions on how to take part in the election. 
                    The steps shown are,
                    1. Go to the polling booth and wait in queue
                    2. Take your ballet paper and go the voting window
                    3. Mark your vote secretly
                    4. Put you ballet paper into the voting box
                    `,
                  },
                ],
              },
            ],
          });

          return (
            <BotCard>
              <ElectionDetailsView />
            </BotCard>
          );
        },
      },
      showPoll: {
        description: "Show user the poll ui for upcoming election",
        parameters: z.object({}),
        generate: async function* ({ }) {
          // yield (
          //   <BotCard>
          //     <LaodingSkeleton loadingTitles={['Starting Poll...']} />
          //   </BotCard>
          // );

          // await sleep(1000);

          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "showPoll",
                    toolCallId,
                    args: {},
                  },
                ],
              },
              {
                id: nanoid(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "showPoll",
                    toolCallId,
                    result: "User was shown poll",
                  },
                ],
              },
            ],
          });

          return (
            <BotCard>
              <PollCard />
            </BotCard>
          );
        },
      },
      showManifestoComparator: {
        description:
          "Show users the manifesto comparator between political parties",
        parameters: z.object({}),
        generate: async function* ({ }) {
          yield (
            <BotCard>
              <LaodingSkeleton
                loadingTitles={['Analyzing Candidates', 'Comparing Manifestos', 'Organizing Data', 'Finalizing Results', 'Almost There!']}
              />
            </BotCard>
          );

          const toolCallId = nanoid();

          const openai = new OpenAI();

          const thread = await openai.beta.threads.create();
          const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: aiState.get().messages.at(-1)?.content.toString()!,
          });

          const run = await openai.beta.threads.runs.create(thread.id, {
            // assistant_id: "asst_48uDzWrOVKweM0rjthgdfygv",
            assistant_id: "asst_1Ff1uvH8D5pS9nDyC7WlULKN", //Politikk Test
          });

          const checkStatusAndPrintMessages = async (
            threadId: string,
            runId: string,
          ) => {
            let runStatus = await openai.beta.threads.runs.retrieve(
              threadId,
              runId,
            );
            if (runStatus.status === "completed") {
              let messages = await openai.beta.threads.messages.list(threadId);

              console.log((messages.data[0]?.content[0] as any).text.value);
              return (messages.data[0]?.content[0] as any).text.value;
            } else {

              // wait 1 second
              await new Promise((resolve) => {
                setTimeout(() => {
                  resolve("");
                }, 1000)
              })

              return await checkStatusAndPrintMessages(threadId, runId)
              console.log("Run is not completed yet.");
            }
          };

          function waitForResponse(
            threadId: string,
            runId: string,
            delay: number,
          ): Promise<string> {
            return new Promise((resolve) => {
              const response = checkStatusAndPrintMessages(threadId, runId);
              resolve(response);
            });
          }

          async function handleResponse(threadId: string, runId: string) {
            const response = await waitForResponse(threadId, runId, 300);
            const data = parseComparatorContent(response);
            return data;
          }

          const data = await handleResponse(thread.id, run.id);
          console.log(data);

          aiState.done({
            ...aiState.get(),
            suggestions: ["What is the agricultural vision by Sajith",
              "What are the steps should I follow to vote?",
            ],
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "showManifestoComparator",
                    toolCallId,
                    args: {},
                  },
                ],
              },
              {
                id: nanoid(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "showManifestoComparator",
                    toolCallId,
                    result:
                      "User was shown comparator in the UI between Ranil and Anura",
                  },
                ],
              },
            ],
          });

          return (
            <BotCard>
              <ManifestoComparator comparisonData={data} />
            </BotCard>
          );
        },
      },



      showManifesto: {
        description:
          "Show users the manifesto of a candidate",
        parameters: z.object({}),
        generate: async function* ({ }) {
          yield (
            <BotCard>
              <LaodingSkeleton
                loadingTitles={['Analyzing Candidate', 'Analyzing Manifesto', 'Organizing Data', 'Finalizing Results', 'Almost There!']}
              />
            </BotCard>
          );

          // await sleep(1000);

          const toolCallId = nanoid();

          const openai = new OpenAI();

          const thread = await openai.beta.threads.create();
          const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: aiState.get().messages.at(-1)?.content.toString()!,
          });

          const run = await openai.beta.threads.runs.create(thread.id, {
            // assistant_id: "asst_48uDzWrOVKweM0rjthgdfygv",
            assistant_id: "asst_1Ff1uvH8D5pS9nDyC7WlULKN", //Politikk Test
          });

          const checkStatusAndPrintMessages = async (
            threadId: string,
            runId: string,
          ) => {
            let runStatus = await openai.beta.threads.runs.retrieve(
              threadId,
              runId,
            );
            if (runStatus.status === "completed") {
              let messages = await openai.beta.threads.messages.list(threadId);

              console.log((messages.data[0]?.content[0] as any).text.value);
              return (messages.data[0]?.content[0] as any).text.value;
            } else {
              // wait for 1 second 
              // wait 1 second
              await new Promise((resolve) => {
                setTimeout(() => {
                  resolve("");
                }, 300)
              })

              return await checkStatusAndPrintMessages(threadId, runId)

              console.log("Run is not completed yet.");
            }
          };

          function waitForResponse(
            threadId: string,
            runId: string,
            delay: number,
          ): Promise<string> {
            return new Promise(async (resolve) => {

              const response = await checkStatusAndPrintMessages(threadId, runId);
              resolve(response);

            });
          }

          async function handleResponse(threadId: string, runId: string) {
            const response = await waitForResponse(threadId, runId, 30000);
            const data = parseComparatorContent(response);
            return data;
          }

          const data = await handleResponse(thread.id, run.id);
          console.log(data);

          aiState.done({
            ...aiState.get(),
            suggestions: ["What are the steps should I follow to vote?", "I want to take part in the poll"],
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "showManifesto",
                    toolCallId,
                    args: {},
                  },
                ],
              },
              {
                id: nanoid(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "showManifesto",
                    toolCallId,
                    result:
                      "User was shown a manifesto",
                  },
                ],
              },
            ],
          });

          return (
            <BotCard>
              <ManifestoComparator comparisonData={data} />
            </BotCard>
          );
        },
      },
      newsReader: {
        description:
          "Show users the trusted news article related to the query",
        parameters: z.object({}),
        generate: async function* ({ }) {
          yield (
            <BotCard>
              <LaodingSkeleton
                loadingTitles={['Searching for News', 'Filtering News']}
              />
            </BotCard>
          );

          const toolCallId = nanoid();

          const data = await getNews(aiState.get().messages.at(-1)?.content.toString()!);

          if (data.length === 0) {
            aiState.done({
              ...aiState.get(),
              suggestions: ['What is the current situation of the election', 'What are the anti corruption measures by Anura and Saith'],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolName: "newsReader",
                      toolCallId,
                      args: {},
                    },
                  ],
                },
                {
                  id: nanoid(),
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolName: "newsReader",
                      toolCallId,
                      result:
                        "No relevant news articles found",
                    },
                  ],
                },
              ],
            });
            return (
              <BotCard>
                <div className="flex">
                  No articles were found
                </div>
              </BotCard>
            );
          }

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolName: "newsReader",
                    toolCallId,
                    args: {},
                  },
                ],
              },
              {
                id: nanoid(),
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    toolName: "newsReader",
                    toolCallId,
                    result:
                      "User was shown news articles",
                  },
                ],
              },
            ],
          });

          console.log(data);

          return (
            <BotCard>
              <NewsCard data={data} />
            </BotCard>
          );
        },
      },
    },


  });

  return {
    id: nanoid(),
    display: result.value,
  };
}


async function voteForCandidate(candiateName: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'system',
        content: `[User has voted ${candiateName}. User is now shown the results for poll. The results are for Anura - 207, Ranil - 305, Sajith - 60]`
      }
    ],
    suggestions: ["Break down the results of the poll",
      "What are the steps should I follow to vote?",
    ],
  })
}

async function clearChat() {
  'use server'

  const aiState = getMutableAIState<typeof AI>()


  aiState.done({
    ...aiState.get(),
    messages: [
    ],
    suggestions: [
    ],
  })
}

export type AIState = {
  chatId: string
  messages: Message[],
  suggestions: string[]
}

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    voteForCandidate,
    clearChat
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [], suggestions: [] },
  onGetUIState: async () => {
    'use server'

    const session = await getServerAuthSession();

    if (session && session.user) {
      const aiState = getAIState() as Chat;

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState);
        return uiState;
      }
    } else {
      return;
    }
  },
  onSetAIState: async ({ state }) => {
    "use server";

    const session = await getServerAuthSession();

    if (session && session.user) {
      const { chatId, messages } = state;

      const createdAt = new Date();
      const userId = session.user.id as string;
      const path = `/chat/${chatId}`;

      const firstMessageContent = messages[0]!.content as string;
      const title = firstMessageContent.substring(0, 100);

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path,
      };

      await saveChat(chat);
    } else {
      return;
    }
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== "system")
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === "tool" ? (
          message.content.map((tool) => {
            return tool.toolName === "listStocks" ? (
              <BotCard>
                {/* TODO: Infer types based on the tool result*/}
                {/* @ts-expect-error */}
                <Stocks props={tool.result} />
              </BotCard>
            ) : tool.toolName === "showStockPrice" ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Stock props={tool.result} />
              </BotCard>
            ) : tool.toolName === "showStockPurchase" ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Purchase props={tool.result} />
              </BotCard>
            ) : tool.toolName === "getEvents" ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Events props={tool.result} />
              </BotCard>
            ) : null;
          })
        ) : message.role === "user" ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === "assistant" &&
          typeof message.content === "string" ? (
          <BotMessage content={message.content} />
        ) : null,
    }));
};