import { postRouter } from "@/server/api/routers/admin/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { productRouter } from "./routers/admin/product";
import { categoryRouter } from "./routers/admin/category";
import { settingsRouter } from "./routers/admin/settings";
import { cashierRouter } from "./routers/admin/cashier";
import { riderRouter } from "./routers/admin/rider";
import { transactionRouter } from "./routers/admin/transaction";
import { dashboardRouter } from "./routers/admin/dashboard";
import { cashierOrderRouter } from "./routers/cashier/orders";

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
  dashboard : dashboardRouter,
  user_cashier : {
    order : cashierOrderRouter
  }
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
