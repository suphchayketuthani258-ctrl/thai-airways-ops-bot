const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http'); // เพิ่มโมดูล http เพื่อสร้าง Server หลอก

// --- ส่วนของ Server เพื่อให้ Render ตรวจพบ Port และออนไลน์ 24 ชม. ---
http.createServer((req, res) => {
    res.write("Thai Airways Bot is Online 24/7!");
    res.end();
}).listen(8080); 
// ---------------------------------------------------------

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ดึง Token จาก Environment Variables ที่เราตั้งค่าไว้ใน Render
const TOKEN = process.env.TOKEN;

client.once('ready', () => {
    console.log(`CEO ครับ! บอท ${client.user.tag} ออนไลน์พร้อมดูแลสายการบินแล้ว!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const msg = message.content;

    // คำถามเรื่องเที่ยวบิน
    if (msg.includes('มีบินไหม') || msg.includes('มีไฟท์ไหม')) {
        message.reply("วันนี้มีเที่ยวบินครับ! ✈️ **TG401** เส้นทาง **SIN - BKK** เวลา **19:00:00** (A350-900) แนะนำให้เข้าแมพก่อน 30 นาทีนะครับ เพราะเซิร์ฟเวอร์อาจจะเต็มเร็วมาก!");
    }

    // คำถามเรื่องสมัครงาน
    if (msg.includes('สมัครงาน')) {
        message.reply("คุณสามารถสมัครงานผ่านเว็บไซต์ https://recruitment.thai-airways.pattaramet.dev/ ได้เลยนะครับ ยินดีต้อนรับสู่การบินไทยครับ!");
    }
});

client.login(TOKEN);
