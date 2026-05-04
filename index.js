const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. ระบบรักษาการออนไลน์ (Keep-Alive) สำหรับ Render ---
http.createServer((req, res) => {
    res.write("Thai Airways Virtual AI is Online!");
    res.end();
}).listen(8080); // พอร์ต 8080 ตามที่เซ็ตใน Render Settings

// --- 2. ตั้งค่าบอท Discord ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// --- 3. ดึงค่าจาก Environment Variables ---
const TOKEN = process.env.TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

client.once('ready', () => {
    console.log(`CEO ครับ! บอท ${client.user.tag} พร้อมดูแลสายการบินไทยแล้ว!`);
});

// --- 4. ระบบประมวลผลคำถามด้วย AI ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        // ใช้โมเดล Flash ที่ตอบเร็วและฉลาดสำหรับภาษาไทย
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // กำหนดบทบาทและข้อมูลการบินของคุณ
        const prompt = `คุณคือ "พนักงานต้อนรับฝ่ายปฏิบัติการบิน" ของสายการบินไทย (Thai Airways Virtual) ใน Roblox
        ข้อมูลบริษัท:
        - CEO คือ คุณ Ruffino (หรือคุณบุญเหลือ)
        - เที่ยวบินวันนี้: TG401 เส้นทาง SIN-BKK เวลา 19:19:00 (A350-900)
        - ระบบสมัครงาน: https://recruitment.thai-airways.pattaramet.dev/
        
        กติกาการตอบ:
        1. ตอบเป็นภาษาไทยที่สุภาพ มี "ครับ/ค่ะ"
        2. แม้ผู้ใช้พิมพ์ผิดหรือพิมพ์ภาษาไทยไม่ชัดเจน ให้พยายามเดาความต้องการ (เช่น "สมัคงาน" คือเรื่องการสมัครงาน)
        3. ถ้าถามเรื่องที่ไม่เกี่ยวกับการบิน ให้ตอบสุภาพว่า "ผมดูแลได้เฉพาะข้อมูลการบินและการสมัครงานครับ"
        
        คำถาม: "${message.content}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        await message.reply(response.text());

    } catch (error) {
        console.error("AI Error:", error);
        // ถ้า AI มีปัญหา ให้ใช้คำตอบสำรอง (Fallback)
        if (message.content.includes('สมัครงาน')) {
            message.reply("ตอนนี้ระบบ AI ขัดข้องชั่วคราว แต่คุณสามารถสมัครงานได้ที่นี่ครับ: https://recruitment.thai-airways.pattaramet.dev/");
        }
    }
});

client.login(TOKEN);
