import { NextRequest, NextResponse } from "next/server";

// Discord Bot Configuration
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

// Logs Server Configuration
const LOGS_GUILD_ID = '1474733000330707085';

// Channel IDs
const LOG_CHANNELS: Record<string, string> = {
  exam: '1474733524564316160', // exam-results
  login: '', // Will be created by bot
  store: '', // Will be created by bot
  activity: '', // Will be created by bot
  errors: '', // Will be created by bot
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing type or data" },
        { status: 400 }
      );
    }

    // Send log to Discord
    await sendLogToDiscord(type, data);

    return NextResponse.json(
      { success: true, message: "Log sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in logs API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function sendLogToDiscord(type: string, data: any) {
  try {
    let channelId = LOG_CHANNELS[type] || LOG_CHANNELS.exam;
    
    // Get channel ID from Discord API if not in cache
    const channelsResponse = await fetch(
      `https://discord.com/api/v10/guilds/${LOGS_GUILD_ID}/channels`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    if (!channelsResponse.ok) {
      console.error('Failed to fetch channels');
      return;
    }

    const channels = await channelsResponse.json();
    
    // Find channel by name
    const channelMap: Record<string, string> = {
      'exam': 'exam-results',
      'login': 'login-logs',
      'store': 'store-purchases',
      'activity': 'website-activity',
      'errors': 'errors'
    };
    
    const targetChannel = channels.find((ch: any) => ch.name === channelMap[type]);
    if (targetChannel) {
      channelId = targetChannel.id;
    }

    let embed: any = {
      color: 0x0099ff,
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Trust State Logs'
      }
    };

    switch(type) {
      case 'login':
        embed.title = '🔐 تسجيل دخول';
        embed.color = 0x0099ff;
        embed.fields = [
          { name: '👤 المستخدم', value: `<@${data.discordId}> (${data.username})`, inline: true },
          { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: true }
        ];
        break;

      case 'store_purchase':
        embed.title = '🛒 عملية شراء';
        embed.color = 0xffa500;
        embed.fields = [
          { name: '👤 المستخدم', value: `<@${data.discordId}> (${data.username})`, inline: true },
          { name: '📦 المنتج', value: data.product, inline: true },
          { name: '💰 السعر', value: `${data.price} ريال`, inline: true },
          { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: false }
        ];
        break;

      case 'activity':
        embed.title = '📊 نشاط الموقع';
        embed.color = 0x7289da;
        embed.fields = [
          { name: '👤 المستخدم', value: `<@${data.discordId}> (${data.username})`, inline: true },
          { name: '📍 النشاط', value: data.activity, inline: true },
          { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: false }
        ];
        break;

      case 'error':
        embed.title = '⚠️ خطأ في الموقع';
        embed.color = 0xff0000;
        embed.fields = [
          { name: '❌ الخطأ', value: data.error, inline: false },
          { name: '📍 الموقع', value: data.location || 'Unknown', inline: true },
          { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: false }
        ];
        break;

      default:
        embed.title = '📋 سجل عام';
        embed.fields = [
          { name: '📍 النوع', value: type, inline: true },
          { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: true }
        ];
    }

    await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ embeds: [embed] }),
      }
    );
    
    console.log(`📊 Log sent: ${type}`);
  } catch (error) {
    console.error('Error sending log to Discord:', error);
  }
}
