require("dotenv").config();

const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences, // 🔥 wymagane do statusów
  ],
  partials: [Partials.User, Partials.GuildMember], // 🔥 ważne dla presence
});

client.once("ready", async () => {
  console.log(`🤖 Bot ready as ${client.user.tag}`);

  try {
    const guild = client.guilds.cache.first();

    if (!guild) {
      console.log("❌ Bot is not in any guild");
      return;
    }

    console.log(`📡 Fetching members for guild: ${guild.name}`);

    // 🔥 wymusza cache memberów + presence
    await guild.members.fetch({ withPresences: true });

    console.log("✅ Members fetched with presences");
  } catch (err) {
    console.error("❌ Error fetching members:", err);
  }
});

client.on("presenceUpdate", async (oldPresence, newPresence) => {
  try {
    if (!newPresence?.userId) return;

    const userId = newPresence.userId;

    const status = newPresence.status || "offline";

    const activity =
      newPresence.activities && newPresence.activities.length > 0
        ? newPresence.activities[0].name
        : null;

    console.log("🔄 Presence update:", userId, status, activity);

    // 🔍 znajdź usera w DB
    const user = await prisma.user.findUnique({
      where: { discordId: userId },
    });

    if (!user) {
      console.log("⚠️ No DB user for discordId:", userId);
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isOnline: status !== "offline",
        discordStatus: status,
        discordActivity: activity,
      },
    });

    console.log(`✅ Updated user ${user.name}`);
  } catch (err) {
    console.error("❌ presenceUpdate error:", err);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);