const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- 1. ระบบรักษาการออนไลน์ (Keep-Alive) ---
// ปรับให้ใช้พอร์ตอัตโนมัติจาก Render เพื่อป้องกันพอร์ตชน
const port = process.env.PORT || 8080; 
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.write("Thai Airways Virtual AI is Online! | พนักงานต้อนรับพร้อมปฏิบัติหน้าที่");
    res.end();
}).listen(port, () => {
    console.log(`Web Service กำลังทำงานที่พอร์ต: ${port}`);
});

// --- 2. ตั้งค่าบอท Discord ---
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // สำคัญมาก: ต้องเปิดใน Discord Developer Portal ด้วย
    ]
});

// --- 3. ดึงค่าจาก Environment Variables ---
const TOKEN = process.env.TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

client.once('ready', () => {
    console.log(`CEO ครับ! บอท ${client.user.tag} ออนไลน์พร้อมดูแลสายการบินไทยแล้ว!`);
});

// --- 4. ระบบประมวลผลคำถามด้วย AI ---
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = `คุณคือ "พนักงานต้อนรับฝ่ายปฏิบัติการบิน" ของสายการบินไทย (Thai Airways Virtual) ใน Roblox
        ข้อมูลบริษัท:
        - CEO คือ คุณ Ruffino (หรือคุณบุญเหลือ)
        - เที่ยวบินวันนี้: TG401 เส้นทาง SIN-BKK เวลา 19:19:00 (A350-900)
        - ระบบสมัครงาน: https://recruitment.thai-airways.pattaramet.dev/
        
        กติกาการตอบ:
        1. ตอบเป็นภาษาไทยที่สุภาพ มี "ครับ/ค่ะ"
        2. แม้ผู้ใช้พิมพ์ผิดให้พยายามเดาความต้องการ
        3. ถ้าถามเรื่องที่ไม่เกี่ยวข้อง ให้ตอบสุภาพว่า "ผมดูแลได้เฉพาะข้อมูลการบินและการสมัครงานครับ"
        
        คำถาม: "${message.content}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        await message.reply(response.text());

    } catch (error) {
        console.error("AI Error:", error);
        if (message.content.includes('สมัครงาน')) {
            message.reply("ตอนนี้ระบบ AI ขัดข้องชั่วคราว แต่คุณสามารถสมัครงานได้ที่นี่ครับ: https://recruitment.thai-airways.pattaramet.dev/");
        }
    }
});

// ตรวจสอบ TOKEN ก่อน Login เพื่อป้องกัน Error ตั้งแต่เริ่ม
if (!TOKEN) {
    console.error("Error: ไม่พบ TOKEN ใน Environment Variables!");
} else {
    client.login(TOKEN).catch(err => {
        console.error("Discord Login Error:", err.message);
        console.error("CEO ครับ! รหัส TOKEN อาจจะไม่ถูกต้อง กรุณาเช็คในหน้า Bot ของ Discord Portal อีกครั้งครับ");
    });
}
