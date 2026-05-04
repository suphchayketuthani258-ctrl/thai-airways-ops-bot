const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- Keep-Alive Server ---
http.createServer((req, res) => {
    res.write("Thai Airways Bot with Gemini AI is Online!");
    res.end();
}).listen(8080);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ดึงค่าจาก Environment Variables ใน Render
const TOKEN = process.env.TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

client.once('ready', () => {
    console.log(`CEO ครับ! บอท AI ${client.user.tag} พร้อมให้บริการแล้ว!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // สั่งให้ AI รู้จักบทบาทและการบินไทยของคุณ
        const prompt = `คุณคือ "พนักงานต้อนรับส่วนหน้า" ของสายการบินไทย (Thai Airways) ใน Roblox
        ข้อมูลสำคัญ:
        - เที่ยวบินวันนี้: TG401 (SIN-BKK) เวลา 19:19:00 ใช้เครื่อง A350-900 (ปฐมฤกษ์วันที่ 10 เมษายน 2569)
        - สมัครงาน: https://recruitment.thai-airways.pattaramet.dev/
        - บุคลิก: สุภาพ พูดจาเพราะ ลงท้ายด้วย 'ครับ/ค่ะ' เสมอ
        - ถ้าคนถามเรื่องอื่นที่ไม่เกี่ยวกับการบิน ให้ตอบแบบสุภาพว่า "ผมสามารถช่วยเหลือข้อมูลเรื่องเที่ยวบินและการสมัครงานได้ครับ"
        
        คำถามจากผู้ใช้: "${message.content}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        await message.reply(response.text());

    } catch (error) {
        console.error(error);
        message.reply("ขออภัยครับ CEO ระบบสมอง AI ขัดข้องนิดหน่อย ลองใหม่อีกครั้งนะครับ!");
    }
});

client.login(TOKEN);
