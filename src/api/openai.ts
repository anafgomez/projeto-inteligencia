import OpenAI from "openai";

type Message = {
    role: 'user' | 'assistant'
    content: string
}

const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true
})

export async function sendMessage(messages: Message[]){
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages.map(message => ({role: message.role, content: message.content}))
    })

    return {
        role: response.choices[0].message.role,
        content: response.choices[0].message.content || ''
    }
}

