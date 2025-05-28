import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
export async function queryLLM(prompt) {
    const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
        model: 'mistral-large-latest',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    }, {
        headers: {
            Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data.choices[0].message.content;
}
