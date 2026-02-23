import { NextRequest, NextResponse } from "next/server";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      // Redirect to Discord OAuth
      const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
      return NextResponse.redirect(discordAuthUrl);
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID || "",
        client_secret: DISCORD_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 400 }
      );
    }

    // Get user info from Discord
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get user info" },
        { status: 400 }
      );
    }

    // Check if user is in the guild
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const guilds = await guildsResponse.json();
    const isInGuild = guilds.some((guild: any) => guild.id === process.env.DISCORD_GUILD_ID);

    if (!isInGuild) {
      return NextResponse.redirect("/login?error=not_in_guild");
    }

    // Redirect to login page with user data
    const userInfo = {
      discordId: userData.id,
      discordUsername: userData.username,
      avatar: userData.avatar,
      accessToken: tokenData.access_token,
    };

    // Create a redirect with user data in URL (for client-side handling)
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("user", Buffer.from(JSON.stringify(userInfo)).toString("base64"));
    
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error("Discord auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
