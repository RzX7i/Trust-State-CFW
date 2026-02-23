import { NextRequest, NextResponse } from "next/server";

// Discord Bot Configuration
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const ADMIN_ROLE_ID = process.env.ADMIN_ROLE_ID;

// Logs Server Configuration
const LOGS_GUILD_ID = '1474733000330707085';
const LOGS_CHANNEL_ID = '1474733524564316160';
const READY_FOR_INTERVIEW_ROLE_ID = '1474038142301638844';

// Function to send log to logs server
async function sendLogToLogsServer(
  discordId: string,
  discordUsername: string,
  score: number,
  correctAnswers: number,
  totalQuestions: number,
  passed: boolean
) {
  try {
    const embed = {
      title: passed ? '🎉 نجاح في الاختبار!' : '❌ رسوب في الاختبار',
      color: passed ? 0x00ff00 : 0xff0000,
      fields: [
        { name: '👤 المستخدم', value: `<@${discordId}> (${discordUsername})`, inline: true },
        { name: '📝 النتيجة', value: `${correctAnswers}/${totalQuestions} (${score}%)`, inline: true },
        { name: '✅ الحالة', value: passed ? 'تم إعطاء رتبة Ready for interview' : 'لم يجتاز الاختبار (مطلوب 70%)', inline: true },
        { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: false }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Trust State Logs'
      }
    };

    await fetch(
      `https://discord.com/api/v10/channels/${LOGS_CHANNEL_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ embeds: [embed] }),
      }
    );
  } catch (error) {
    console.error('Error sending log:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { discordId, discordUsername, score, passed } = body;

    // Validate required fields
    if (!discordId || !discordUsername || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user passed the exam (commented out for testing)
    // if (!passed) {
    //   return NextResponse.json(
    //     { message: "User did not pass the exam", success: false },
    //     { status: 200 }
    //   );
    // }

    // Check if environment variables are set
    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID || !ADMIN_ROLE_ID) {
      console.log("Discord environment variables not set");
      return NextResponse.json(
        { 
          message: "Discord integration not configured. Please contact admin.",
          success: false,
          discordId,
          discordUsername,
          score
        },
        { status: 200 }
      );
    }

    // Calculate correct answers count
    const totalQuestions = 10; // Adjust based on your questions count
    const correctAnswers = Math.round((score / 100) * totalQuestions);

    // Send log to logs server (for both pass and fail)
    await sendLogToLogsServer(discordId, discordUsername, score, correctAnswers, totalQuestions, passed);

    // If user passed (70% or more), assign "Ready for interview" role in main server
    if (passed && score >= 70) {
      // Add "Ready for interview" role to user in main Discord server
      const roleResponse = await fetch(
        `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordId}/roles/${READY_FOR_INTERVIEW_ROLE_ID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (roleResponse.ok) {
        return NextResponse.json(
          { 
            message: "تم إعطاؤك رتبة Ready for interview بنجاح!",
            success: true,
            discordId,
            discordUsername,
            score,
            roleAssigned: true
          },
          { status: 200 }
        );
      } else {
        const errorData = await roleResponse.json();
        console.error("Discord API error:", errorData);
        
        return NextResponse.json(
          { 
            message: "تم تسجيل نجاحك ولكن حدث خطأ في إعطاء الرتبة. تواصل مع الإدارة.",
            success: true,
            error: errorData.message,
            discordId,
            discordUsername,
            score,
            roleAssigned: false
          },
          { status: 200 }
        );
      }
    } else {
      // User didn't pass (less than 70%)
      return NextResponse.json(
        { 
          message: "لم تجتز الاختبار. يجب الحصول على 70% على الأقل.",
          success: false,
          discordId,
          discordUsername,
          score,
          passed: false
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error in Discord API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get Discord OAuth URL
export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI || "");
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Discord client ID not configured" },
      { status: 500 }
    );
  }

  const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20guilds.join`;
  
  return NextResponse.json({ url: oauthUrl });
}
