import { router } from "../trpc";
import { publicRouter } from "./public/_router";
import { viewerRouter } from "./viewer/_router";

export const appRouter = router({
  viewer: viewerRouter,
  public: publicRouter,
});

export type AppRouter = typeof appRouter;
