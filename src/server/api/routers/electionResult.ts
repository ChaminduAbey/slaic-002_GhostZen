import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { nanoid } from "nanoid";

const results: {
  id: string,
  location: string,
  anura: number,
  ranil: number,
  sajith: number
}[] = [
  ]



export const electionResultRouter = createTRPCRouter({
  addResult: publicProcedure
    .input(z.object({
      location: z.enum(["Colombo", "Galle"]),

    }))
    .mutation(async ({ ctx, input }) => {
      if (input.location === "Colombo") {
        results.push({
          id: nanoid(),
          location: input.location,
          anura: 123,
          ranil: 66,
          sajith: 23
        })
      } else if (input.location === "Galle") {
        results.push({
          id: nanoid(),
          location: input.location,
          anura: 100,
          ranil: 50,
          sajith: 50
        })
      }
    }),

  getNewResult: publicProcedure.query(async ({ ctx }) => {
    if (results.length === 0) {
      return null
    }

    return results[results.length - 1]
  }),

  getResults: publicProcedure.query(async ({ ctx }) => {
    return results
  })
});
