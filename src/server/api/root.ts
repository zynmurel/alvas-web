import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { productRouter } from "./routers/product";
import { categoryRouter } from "./routers/category";
import { settingsRouter } from "./routers/settings";
import { cashierRouter } from "./routers/cashier";
import { riderRouter } from "./routers/rider";
import { transactionRouter } from "./routers/transaction";
import { dashboardRouter } from "./routers/dashboard";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  product : productRouter,
  category : categoryRouter,
  settings : settingsRouter,
  cashier : cashierRouter,
  rider : riderRouter,
  transaction  : transactionRouter,
  dashboard : dashboardRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
