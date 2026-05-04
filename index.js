const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http'); // เพิ่มระบบ Web Server เล็กๆ

// --- ส่วนที่ช่วยให้ Render ไม่ Error และออนไลน์ 24 ชม. ---
http.createServer((req, res) => {
    res.write("Thai Airways Bot is Online!");
    res.end();
}).listen(8080); 
// ---------------------------------------------------

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.TOKEN;

client.once('ready', () => {
    console.log(`CEO ครับ! บอท ${client.user.tag} ออนไลน์พร้อมดูแลสายการบินแล้ว!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    const msg = message.content;

    if (msg.includes('มีบินไหม') || msg.includes('มีไฟท์ไหม')) {
        message.reply("วันนี้มีเที่ยวบินครับ! ✈️ **TG401** เส้นทาง **SIN - BKK** เวลา **19:00:00** (A350-900) แนะนำให้เข้าแมพก่อน 30 นาทีนะครับ!");
    }

    if (msg.includes('สมัครงาน')) {
        message.reply("คุณสามารถสมัครงานผ่านเว็บไซต์ https://recruitment.thai-airways.pattaramet.dev/ ได้เลยนะครับ!");
    }
});

client.login(TOKEN);
