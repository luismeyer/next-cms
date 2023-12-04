import { api } from "next-cms";

import { config } from "@/cms";

export const { GET, POST, PUT } = api(config);
