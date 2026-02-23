import { NextRequest, NextResponse } from "next/server";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const REQUIRED_ROLE_ID = process.env.REQUIRED_ROLE_ID; // الرتبة المطلوبة للاختبار

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { discordId, discordUsername } = body;

    if (!discordId || !discordUsername) {
      return NextResponse.json(
        { error: "Missing required fields", isMember: false },
        { status: 400 }
      );
    }

    // Check if environment variables are set
    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
      console.log("Discord environment variables not set");
      // For testing, allow access if env vars not set
      return NextResponse.json(
        { 
          message: "Verification skipped (dev mode)",
          isMember: true,
          discordId,
          discordUsername
        },
        { status: 200 }
      );
    }

    // Check if user is a member of the guild
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members/${discordId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const memberData = await response.json();
      
      // Check if user has the required role (if specified)
      let hasRequiredRole = true;
      if (REQUIRED_ROLE_ID && memberData.roles) {
        hasRequiredRole = memberData.roles.includes(REQUIRED_ROLE_ID);
      }
      
      return NextResponse.json(
        { 
          message: hasRequiredRole ? "User is authorized" : "User lacks required role",
          isMember: true,
          hasRequiredRole,
          discordId,
          discordUsername,
          avatar: memberData.user?.avatar,
          joinedAt: memberData.joined_at,
          roles: memberData.roles || []
        },
        { status: 200 }
      );
    } else if (response.status === 404) {
      return NextResponse.json(
        { 
          message: "User is not a member of this server",
          isMember: false,
          discordId,
          discordUsername
        },
        { status: 200 }
      );
    } else {
      const errorData = await response.json();
      console.error("Discord API error:", errorData);
      return NextResponse.json(
        { 
          message: "Error verifying membership",
          isMember: false,
          error: errorData.message
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error in verify API:", error);
    return NextResponse.json(
      { error: "Internal server error", isMember: false },
      { status: 500 }
    );
  }
}
