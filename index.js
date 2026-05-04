const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// นำ Token ที่ได้จากหน้า Developer Portal มาใส่ตรงนี้
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