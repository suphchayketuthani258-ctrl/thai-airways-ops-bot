require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');

// สร้าง Web Server เล็กๆ เพื่อให้ Render ไม่ตัดการเชื่อมต่อ
const app = express();
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Thai Airways Virtual AI is Active!'));
app.listen(port, () => console.log(`Web Service is running on port: ${port}`));

// ตั้งค่า AI Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ตั้งค่า Discord Bot พร้อม Intents ที่จำเป็น
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`CEO Ruffino ครับ! บอท ${client.user.tag} ออนไลน์พร้อมดูแลสายการบินไทยแล้ว!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        const result = await model.generateContent(message.content);
        const response = await result.response;
        message.reply(response.text());
    } catch (error) {
        console.error('AI Error:', error);
    }
});

// ดึง TOKEN จาก Environment Variables
const token = process.env.TOKEN;
if (!token) {
    console.error("Error: ไม่พบ TOKEN ในระบบ!");
    process.exit(1);
}

client.login(token).catch(err => {
    console.error('Discord Login Error:', err);
});
