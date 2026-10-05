import { onRequestDelete as __api_advise_ts_onRequestDelete } from "/home/abdullah-jutt/Pictures/runtime-systems-source_5d274f91/functions/api/advise.ts"
import { onRequestGet as __api_advise_ts_onRequestGet } from "/home/abdullah-jutt/Pictures/runtime-systems-source_5d274f91/functions/api/advise.ts"
import { onRequestHead as __api_advise_ts_onRequestHead } from "/home/abdullah-jutt/Pictures/runtime-systems-source_5d274f91/functions/api/advise.ts"
import { onRequestOptions as __api_advise_ts_onRequestOptions } from "/home/abdullah-jutt/Pictures/runtime-systems-source_5d274f91/functions/api/advise.ts"
import { onRequestPatch as __api_advise_ts_onRequestPatch } from "/home/abdullah-jutt/Pictures/runtime-systems-source_5d274f91/functions/api/advise.ts"
import { onRequestPost as __api_advise_ts_onRequestPost } from "/home/abdullah-jutt/Pictures/runtime-systems-source_5d274f91/functions/api/advise.ts"
import { onRequestPut as __api_advise_ts_onRequestPut } from "/home/abdullah-jutt/Pictures/runtime-systems-source_5d274f91/functions/api/advise.ts"

export const routes = [
    {
      routePath: "/api/advise",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_advise_ts_onRequestDelete],
    },
  {
      routePath: "/api/advise",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_advise_ts_onRequestGet],
    },
  {
      routePath: "/api/advise",
      mountPath: "/api",
      method: "HEAD",
      middlewares: [],
      modules: [__api_advise_ts_onRequestHead],
    },
  {
      routePath: "/api/advise",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_advise_ts_onRequestOptions],
    },
  {
      routePath: "/api/advise",
      mountPath: "/api",
      method: "PATCH",
      middlewares: [],
      modules: [__api_advise_ts_onRequestPatch],
    },
  {
      routePath: "/api/advise",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_advise_ts_onRequestPost],
    },
  {
      routePath: "/api/advise",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_advise_ts_onRequestPut],
    },
  ]