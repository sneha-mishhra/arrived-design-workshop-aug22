import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

export const HAPPILY_API_BASE_URL = process.env.HAPPILY_API_BASE_URL;

export const happilyClient = createClient<paths>({
  baseUrl: HAPPILY_API_BASE_URL,
});
