/*
MIT License

Copyright (c) 2025 thatssjames

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const { evaluate } = require('mathjs');
const request = require('request');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = 'nope on a rope';
const filterWords = ["nigga", "nigger", "@everyone", "@here", "@", "discord.gg", "discord.com/invite"];

const PEXELS_API_URL = 'https://api.pexels.com/v1/search';
const PEXELS_API_KEY = 'nope on a rope';

function aireq(prompt) {
    return new Promise((resolve) => {
        const requestBody = {
            messages: [
                { role: 'user', content: prompt }
            ],
            model: "gemma2-9b-it"
        };

        const options = {
            url: GROQ_API_URL,
            method: 'POST',
            json: requestBody,
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        request(options, (error, response, body) => {
            if (error) {
                console.error('Error calling Groq API:', error);
                resolve({ success: false, message: 'There was an error communicating with Celery AI.' });
            } else if (response.statusCode === 200) {
                let aiResponse = body.choices[0]?.message?.content;
                //let containsFilteredWords = filterWords.some(word => new RegExp(word, 'gi').test(aiResponse));
                resolve({ success: true, response: aiResponse });
            } else {
                console.error('Error from Groq API:', body);
                resolve({ success: false, message: 'An error occurred while trying to make this request.' });
            }
        });
    });
}

function imagegen(query) {
    return new Promise((resolve) => {
        const options = {
            url: `${PEXELS_API_URL}?query=${query}&per_page=15`,
            method: 'GET',
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        };

        request(options, (error, response, body) => {
            console.log("Sending request to Pexels API...");
            if (error) {
                console.error('Error fetching images:', error);
                resolve({ success: false, message: 'An error occurred while fetching images with Celery AI.' });
            } else if (response.statusCode === 200) {
                const data = JSON.parse(body);
                const images = data.photos;
                console.log("Received response from Pexels API:", images.length);

                if (images.length === 0) {
                    resolve({ success: false, message: 'No images found for the given query.' });
                } else {
                    const randomIndex = Math.floor(Math.random() * images.length);
                    const randomImage = images[randomIndex].src.medium;
                    console.log("Random image selected:", randomImage);

                    resolve({ success: true, response: randomImage });
                }
            } else {
                console.error('Error from Pexels API:', body);
                resolve({ success: false, message: 'An error occurred while fetching images with Celery AI.' });
            }
        });
    });
}

function math(expression) {
    return { success: true, response: evaluate(expression) }
}

module.exports = {
    aireq,
    imagegen,
    math
};
