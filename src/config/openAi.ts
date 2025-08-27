import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
    baseURL: process.env.NEXT_PUBLIC_OPAN_AI_BASE_URL,
    dangerouslyAllowBrowser: true,
})

export default openai;