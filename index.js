require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');

// ตั้งค่า Express เพื่อให้ Render ไม่ตัดการทำงาน
const app = express();
const port = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Thai Airways Virtual AI is running!'));
app.listen(port, () => console.log(`Web Service กำลังทำงานที่พอร์ต: ${port}`));

// ตั้งค่า AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ตั้งค่า Discord Bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`CEO ครับ! บอท ${client.user.tag} พร้อมดูแลสายการบินไทยแล้ว!`);
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

// ตรวจสอบ Token ก่อน Login
const token = process.env.TOKEN;
if (!token) {
    console.error("Error: ไม่พบ TOKEN ใน Environment Variables!");
    process.exit(1);
}

client.login(token).catch(err => {
    console.error('Discord Login Error:', err);
});
