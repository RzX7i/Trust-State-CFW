const { Client, GatewayIntentBits, SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Global fetch for Node.js < 18
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Read .env.local file manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const TOKEN = envVars.DISCORD_BOT_TOKEN;
const GUILD_ID = envVars.DISCORD_GUILD_ID;
const ROLE_ID = envVars.ADMIN_ROLE_ID;

// Logs Server Configuration
const LOGS_GUILD_ID = '1474733000330707085';
const LOGS_CHANNEL_ID = '1474733524564316160';
const READY_FOR_INTERVIEW_ROLE_ID = '1474038142301638844';

// Channel IDs for different log types (will be created if not exist)
let LOG_CHANNELS = {
  exam: null,
  login: null,
  store: null,
  cart: null,
  checkout: null,
  activity: null,
  pageviews: null,
  useractions: null,
  security: null,
  errors: null,
  system: null
};

// Role IDs for logs server
let LOGS_ROLES = {
  admin: null,
  examManager: null
};

client.once('ready', async () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  console.log(`🤖 Ready to assign roles!`);
  
  // Setup logs server channels and roles
  await setupLogsServer();
  
  // Register slash commands
  await registerCommands();
  
  console.log(`📊 Logs server connected!`);
  console.log(`⚡ Slash commands registered!`);
});

// Function to setup logs server (create channels and roles)
async function setupLogsServer() {
  try {
    const guild = await client.guilds.fetch(LOGS_GUILD_ID);
    
    // Create roles if not exist
    const adminRole = await guild.roles.cache.find(r => r.name === 'Logs Admin') || 
                      await guild.roles.create({
                        name: 'Logs Admin',
                        color: 0xFF0000,
                        permissions: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                        reason: 'Role for viewing all logs'
                      });
    
    const examManagerRole = await guild.roles.cache.find(r => r.name === 'Exam Manager') ||
                            await guild.roles.create({
                              name: 'Exam Manager',
                              color: 0x00FF00,
                              permissions: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                              reason: 'Role for viewing exam results'
                            });
    
    LOGS_ROLES.admin = adminRole.id;
    LOGS_ROLES.examManager = examManagerRole.id;
    
    console.log('✅ Roles created/found:', LOGS_ROLES);
    
    // Create channels if not exist
    const channels = [
      { name: 'exam-results', type: 0, topic: 'نتائج اختبارات الإدارة' },
      { name: 'login-logs', type: 0, topic: 'تسجيلات الدخول والخروج' },
      { name: 'store-purchases', type: 0, topic: 'مشتريات المتجر' },
      { name: 'cart-activity', type: 0, topic: 'إضافة منتجات للسلة' },
      { name: 'checkout-logs', type: 0, topic: 'عمليات الدفع' },
      { name: 'website-activity', type: 0, topic: 'نشاط الموقع العام' },
      { name: 'page-views', type: 0, topic: 'زيارات الصفحات' },
      { name: 'user-actions', type: 0, topic: 'إجراءات المستخدمين' },
      { name: 'security-logs', type: 0, topic: 'الأمان والتحقق' },
      { name: 'errors', type: 0, topic: 'أخطاء الموقع' },
      { name: 'system-logs', type: 0, topic: 'سجلات النظام' }
    ];
    
    for (const ch of channels) {
      const existingChannel = guild.channels.cache.find(c => c.name === ch.name);
      if (!existingChannel) {
        const newChannel = await guild.channels.create({
          name: ch.name,
          type: ch.type,
          topic: ch.topic,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: ['ViewChannel']
            },
            {
              id: adminRole.id,
              allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
            },
            {
              id: examManagerRole.id,
              allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
            }
          ]
        });
        
        // Set permissions for specific channels
        if (ch.name === 'exam-results') {
          await newChannel.permissionOverwrites.create(examManagerRole.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
          });
        }
        
        LOG_CHANNELS[ch.name.replace(/-/g, '')] = newChannel.id;
        console.log(`✅ Created channel: ${ch.name}`);
      } else {
        LOG_CHANNELS[ch.name.replace(/-/g, '')] = existingChannel.id;
        console.log(`✅ Found existing channel: ${ch.name}`);
      }
    }
    
    console.log('✅ Logs server setup complete!');
  } catch (error) {
    console.error('Error setting up logs server:', error);
  }
}

// Function to send log to specific channel
async function sendLog(type, data) {
  try {
    const guild = await client.guilds.fetch(LOGS_GUILD_ID);
    
    let channelId = LOGS_CHANNEL_ID; // Default channel
    let embed = {
      color: 0x0099ff,
      timestamp: new Date(),
      footer: {
        text: 'Trust State Logs'
      }
    };

    switch(type) {
      case 'exam_pass':
        channelId = LOG_CHANNELS.exam || LOGS_CHANNEL_ID;
        embed.title = '🎉 نجاح في الاختبار!';
        embed.color = 0x00ff00;
        embed.fields = [
          { name: '👤 المستخدم', value: `<@${data.discordId}> (${data.username})`, inline: true },
          { name: '📝 النتيجة', value: `${data.score}/${data.total} (${data.percentage}%)`, inline: true },
          { name: '✅ الحالة', value: 'تم إعطاء رتبة Ready for interview', inline: true },
          { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: false }
        ];
        break;
      
      case 'exam_fail':
        channelId = LOG_CHANNELS.exam || LOGS_CHANNEL_ID;
        embed.title = '❌ رسوب في الاختبار';
        embed.color = 0xff0000;
        embed.fields = [
          { name: '👤 المستخدم', value: `<@${data.discordId}> (${data.username})`, inline: true },
          { name: '📝 النتيجة', value: `${data.score}/${data.total} (${data.percentage}%)`, inline: true },
          { name: '❌ الحالة', value: 'لم يجتاز الاختبار (مطلوب 70%)', inline: true },
          { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: false }
        ];
        break;

      case 'login':
        channelId = LOG_CHANNELS.login || LOGS_CHANNEL_ID;
        embed.title = data.activity === 'تسجيل خروج' ? '🚪 تسجيل خروج' : '🔐 تسجيل دخول';
        embed.color = 0x0099ff;
        embed.fields = [
          { name: '👤 المستخدم', value: `<@${data.discordId}> (${data.username})`, inline: true },
          { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: true }
        ];
        break;

      case 'store_purchase':
        if (data.activity === 'إضافة للسلة') {
          channelId = LOG_CHANNELS.cart || LOGS_CHANNEL_ID;
          embed.title = '🛒 إضافة للسلة';
          embed.color = 0xffd700;
        } else if (data.activity === 'بدء الدفع') {
          channelId = LOG_CHANNELS.checkout || LOGS_CHANNEL_ID;
          embed.title = '💳 بدء الدفع';
          embed.color = 0x00ced1;
          embed.fields = [
            { name: '👤 المستخدم', value: `<@${data.discordId}> (${data.username})`, inline: true },
            { name: '💰 المجموع', value: `${data.total} ريال`, inline: true },
            { name: '📦 عدد المنتجات', value: `${data.items}`, inline: true },
            { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: false }
          ];
          break;
        } else {
          channelId = LOG_CHANNELS.store || LOGS_CHANNEL_ID;
          embed.title = '✅ عملية شراء مكتملة';
          embed.color = 0x00ff00;
        }
        if (data.activity !== 'بدء الدفع') {
          embed.fields = [
            { name: '👤 المستخدم', value: `<@${data.discordId}> (${data.username})`, inline: true },
            { name: '📦 المنتج', value: data.product, inline: true },
            { name: '💰 السعر', value: `${data.price} ريال`, inline: true },
            { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: false }
          ];
        }
        break;

      case 'activity':
        if (data.activity?.includes('زيارة صفحة')) {
          channelId = LOG_CHANNELS.pageviews || LOGS_CHANNEL_ID;
          embed.title = '📄 زيارة صفحة';
          embed.color = 0x9370db;
        } else if (data.activity === 'بدء الاختبار') {
          channelId = LOG_CHANNELS.exam || LOGS_CHANNEL_ID;
          embed.title = '📝 بدء الاختبار';
          embed.color = 0xffa500;
        } else {
          channelId = LOG_CHANNELS.activity || LOGS_CHANNEL_ID;
          embed.title = '📊 نشاط الموقع';
          embed.color = 0x7289da;
        }
        embed.fields = [
          { name: '👤 المستخدم', value: `<@${data.discordId}> (${data.username})`, inline: true },
          { name: '📍 النشاط', value: data.activity, inline: true },
          { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: false }
        ];
        break;

      case 'error':
        channelId = LOG_CHANNELS.errors || LOGS_CHANNEL_ID;
        embed.title = '⚠️ خطأ في الموقع';
        embed.color = 0xff0000;
        embed.fields = [
          { name: '❌ الخطأ', value: data.error, inline: false },
          { name: '📍 الموقع', value: data.location || 'Unknown', inline: true },
          { name: '📅 التاريخ', value: new Date().toLocaleString('ar-SA'), inline: false }
        ];
        break;
    }

    const channel = await guild.channels.fetch(channelId);
    if (!channel) {
      console.error(`Channel not found for type: ${type}`);
      return;
    }

    await channel.send({ embeds: [embed] });
    console.log(`📊 Log sent: ${type} to ${channel.name}`);
  } catch (error) {
    console.error('Error sending log:', error);
  }
}

// Function to assign role (can be called from API)
async function assignRole(discordId) {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(discordId);
    
    if (!member) {
      return { success: false, message: 'Member not found' };
    }
    
    // Check if already has role
    if (member.roles.cache.has(ROLE_ID)) {
      return { success: true, message: 'Already has role' };
    }
    
    // Add role
    await member.roles.add(ROLE_ID);
    console.log(`✅ Assigned role to ${member.user.tag}`);
    
    return { success: true, message: 'Role assigned successfully' };
  } catch (error) {
    console.error('Error assigning role:', error);
    return { success: false, message: error.message };
  }
}

// Function to assign "Ready for interview" role
async function assignReadyForInterviewRole(discordId, username, score, total) {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const member = await guild.members.fetch(discordId);
    
    if (!member) {
      return { success: false, message: 'Member not found in main server' };
    }
    
    // Check if already has role
    if (member.roles.cache.has(READY_FOR_INTERVIEW_ROLE_ID)) {
      return { success: true, message: 'Already has Ready for interview role' };
    }
    
    // Add role
    await member.roles.add(READY_FOR_INTERVIEW_ROLE_ID);
    console.log(`✅ Assigned "Ready for interview" role to ${member.user.tag}`);
    
    // Send log
    const percentage = Math.round((score / total) * 100);
    await sendLog('exam_pass', {
      discordId,
      username,
      score,
      total,
      percentage
    });
    
    return { success: true, message: 'Ready for interview role assigned successfully' };
  } catch (error) {
    console.error('Error assigning role:', error);
    return { success: false, message: error.message };
  }
}

// Function to log exam failure
async function logExamFail(discordId, username, score, total) {
  const percentage = Math.round((score / total) * 100);
  await sendLog('exam_fail', {
    discordId,
    username,
    score,
    total,
    percentage
  });
}

// ============================================
// PROBOT-STYLE COMMANDS
// ============================================

// Register slash commands
async function registerCommands() {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    
    const commands = [
      // /user - معلومات المستخدم
      {
        name: 'user',
        description: 'عرض معلومات مستخدم',
        options: [{
          name: 'member',
          description: 'اختر العضو',
          type: 6,
          required: false
        }]
      },
      // /server - معلومات السيرفر
      {
        name: 'server',
        description: 'عرض معلومات السيرفر'
      },
      // /avatar - صورة البروفايل
      {
        name: 'avatar',
        description: 'عرض صورة البروفايل',
        options: [{
          name: 'member',
          description: 'اختر العضو',
          type: 6,
          required: false
        }]
      },
      // /say - إرسال رسالة
      {
        name: 'say',
        description: 'إرسال رسالة (للإدارة فقط)',
        options: [{
          name: 'message',
          description: 'الرسالة',
          type: 3,
          required: true
        }]
      },
      // /embed - رسالة منسقة
      {
        name: 'embed',
        description: 'إرسال رسالة منسقة (للإدارة فقط)',
        options: [
          {
            name: 'title',
            description: 'عنوان الرسالة',
            type: 3,
            required: true
          },
          {
            name: 'description',
            description: 'محتوى الرسالة',
            type: 3,
            required: true
          },
          {
            name: 'color',
            description: 'لون الإطار (مثال: #FF0000)',
            type: 3,
            required: false
          }
        ]
      },
      // /announce - إرسال تحديث
      {
        name: 'announce',
        description: 'إرسال تحديث/إعلان للسيرفر (للإدارة فقط)',
        options: [
          {
            name: 'title',
            description: 'عنوان التحديث',
            type: 3,
            required: true
          },
          {
            name: 'message',
            description: 'محتوى التحديث',
            type: 3,
            required: true
          },
          {
            name: 'mention',
            description: 'منشن الجميع؟',
            type: 5,
            required: false
          }
        ]
      },
      // /clear - مسح الرسائل
      {
        name: 'clear',
        description: 'مسح الرسائل (للإدارة فقط)',
        options: [{
          name: 'amount',
          description: 'عدد الرسائل (1-100)',
          type: 4,
          required: true
        }]
      },

      // /ping - سرعة البوت
      {
        name: 'ping',
        description: 'عرض سرعة استجابة البوت'
      },
      // /help - قائمة الأوامر
      {
        name: 'help',
        description: 'عرض قائمة الأوامر المتاحة'
      },
      // /suggest - اقتراح
      {
        name: 'suggest',
        description: 'إرسال اقتراح للإدارة',
        options: [{
          name: 'content',
          description: 'محتوى الاقتراح',
          type: 3,
          required: true
        }]
      },


      // /mute - كتم
      {
        name: 'mute',
        description: 'كتم عضو (للإدارة)',
        options: [
          {
            name: 'member',
            description: 'العضو',
            type: 6,
            required: true
          },
          {
            name: 'duration',
            description: 'المدة (مثال: 1h, 30m, 1d)',
            type: 3,
            required: true
          },
          {
            name: 'reason',
            description: 'السبب',
            type: 3,
            required: false
          }
        ]
      },
      // /unmute - فك الكتم
      {
        name: 'unmute',
        description: 'فك كتم عضو (للإدارة)',
        options: [{
          name: 'member',
          description: 'العضو',
          type: 6,
          required: true
        }]
      },
      // /lock - قفل الروم
      {
        name: 'lock',
        description: 'قفل الروم (للإدارة)',
        options: [{
          name: 'reason',
          description: 'السبب',
          type: 3,
          required: false
        }]
      },
      // /unlock - فتح الروم
      {
        name: 'unlock',
        description: 'فتح الروم (للإدارة)',
        options: [{
          name: 'reason',
          description: 'السبب',
          type: 3,
          required: false
        }]
      },

      // /nickname - تغيير اللقب
      {
        name: 'nickname',
        description: 'تغيير لقب عضو (للإدارة)',
        options: [
          {
            name: 'member',
            description: 'العضو',
            type: 6,
            required: true
          },
          {
            name: 'nickname',
            description: 'اللقب الجديد (اتركه فارغ لإزالة اللقب)',
            type: 3,
            required: false
          }
        ]
      },
      // /poll - تصويت
      {
        name: 'poll',
        description: 'إنشاء تصويت (للإدارة)',
        options: [
          {
            name: 'question',
            description: 'سؤال التصويت',
            type: 3,
            required: true
          },
          {
            name: 'option1',
            description: 'الخيار الأول',
            type: 3,
            required: true
          },
          {
            name: 'option2',
            description: 'الخيار الثاني',
            type: 3,
            required: true
          }
        ]
      },
      // /botinfo - معلومات البوت
      {
        name: 'botinfo',
        description: 'عرض معلومات البوت'
      },
      // /invite - رابط الدعوة
      {
        name: 'invite',
        description: 'عرض رابط دعوة السيرفر'
      },
      // /rank - مستوى العضو
      {
        name: 'rank',
        description: 'عرض مستواك أو مستوى عضو آخر',
        options: [{
          name: 'member',
          description: 'العضو',
          type: 6,
          required: false
        }]
      },
      // /leaderboard - توب الأعضاء
      {
        name: 'leaderboard',
        description: 'عرض أفضل الأعضاء نشاطاً'
      },
      // /balance - رصيدك
      {
        name: 'balance',
        description: 'عرض رصيدك',
        options: [{
          name: 'member',
          description: 'العضو',
          type: 6,
          required: false
        }]
      },
      // /give - تحويل فلوس
      {
        name: 'give',
        description: 'تحويل فلوس لعضو',
        options: [
          {
            name: 'member',
            description: 'العضو',
            type: 6,
            required: true
          },
          {
            name: 'amount',
            description: 'المبلغ',
            type: 4,
            required: true
          }
        ]
      },
      // /shop - متجر البوت
      {
        name: 'shop',
        description: 'عرض متجر الأدوار والألقاب'
      },
      // /profile - البروفايل
      {
        name: 'profile',
        description: 'عرض بروفايلك أو بروفايل عضو',
        options: [{
          name: 'member',
          description: 'العضو',
          type: 6,
          required: false
        }]
      },
      // /meme - ميمز
      {
        name: 'meme',
        description: 'عرض ميم عشوائي'
      },
      // /joke - نكتة
      {
        name: 'joke',
        description: 'عرض نكتة عشوائية'
      },
      // /8ball - سؤال
      {
        name: '8ball',
        description: 'اسأل الكرة السحرية',
        options: [{
          name: 'question',
          description: 'سؤالك',
          type: 3,
          required: true
        }]
      },
      // /roll - رمي حجر
      {
        name: 'roll',
        description: 'رمي حجر نرد',
        options: [{
          name: 'sides',
          description: 'عدد الأوجه (افتراضي: 6)',
          type: 4,
          required: false
        }]
      },
      // /coin - رمي عملة
      {
        name: 'coin',
        description: 'رمي عملة (صورة أو كتابة)'
      },
      // /uptime - وقت التشغيل
      {
        name: 'uptime',
        description: 'عرض وقت تشغيل البوت'
      }
    ];
    
    await guild.commands.set(commands);
    console.log(`✅ Registered ${commands.length} slash commands`);
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  
  const { commandName, options, member, guild } = interaction;
  
  try {
    switch (commandName) {
      // /user - معلومات المستخدم
      case 'user': {
        const targetUser = options.getUser('member') || interaction.user;
        const targetMember = await guild.members.fetch(targetUser.id);
        
        const embed = {
          color: 0x0099ff,
          title: '👤 معلومات المستخدم',
          thumbnail: { url: targetUser.displayAvatarURL({ dynamic: true, size: 256 }) },
          fields: [
            { name: 'الاسم', value: targetUser.tag, inline: true },
            { name: 'الآيدي', value: targetUser.id, inline: true },
            { name: 'تاريخ الانضمام', value: `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:R>`, inline: true },
            { name: 'تاريخ إنشاء الحساب', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'الرتب', value: targetMember.roles.cache.map(r => r).join(', ') || 'لا يوجد', inline: false }
          ],
          timestamp: new Date()
        };
        
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /server - معلومات السيرفر
      case 'server': {
        const embed = {
          color: 0x00ff00,
          title: '🏠 معلومات السيرفر',
          thumbnail: { url: guild.iconURL({ dynamic: true, size: 256 }) },
          fields: [
            { name: 'اسم السيرفر', value: guild.name, inline: true },
            { name: 'الآيدي', value: guild.id, inline: true },
            { name: 'المالك', value: `<@${guild.ownerId}>`, inline: true },
            { name: 'عدد الأعضاء', value: `${guild.memberCount}`, inline: true },
            { name: 'عدد الرومات', value: `${guild.channels.cache.size}`, inline: true },
            { name: 'عدد الرتب', value: `${guild.roles.cache.size}`, inline: true },
            { name: 'تاريخ الإنشاء', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'الرفع التلقائي', value: guild.verificationLevel, inline: true }
          ],
          timestamp: new Date()
        };
        
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /avatar - صورة البروفايل
      case 'avatar': {
        const targetUser = options.getUser('member') || interaction.user;
        
        const embed = {
          color: 0xff69b4,
          title: '🖼️ صورة البروفايل',
          description: `**${targetUser.tag}**`,
          image: { url: targetUser.displayAvatarURL({ dynamic: true, size: 4096 }) },
          timestamp: new Date()
        };
        
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /say - إرسال رسالة
      case 'say': {
        if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
          return interaction.reply({ content: '❌ ليس لديك صلاحية!', ephemeral: true });
        }
        
        const message = options.getString('message');
        await interaction.channel.send(message);
        await interaction.reply({ content: '✅ تم إرسال الرسالة!', ephemeral: true });
        break;
      }
      
      // /embed - رسالة منسقة
      case 'embed': {
        if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
          return interaction.reply({ content: '❌ ليس لديك صلاحية!', ephemeral: true });
        }
        
        const title = options.getString('title');
        const description = options.getString('description');
        const colorInput = options.getString('color') || '#0099ff';
        const color = parseInt(colorInput.replace('#', ''), 16) || 0x0099ff;
        
        const embed = {
          color: color,
          title: title,
          description: description,
          footer: { text: `بواسطة: ${interaction.user.tag}` },
          timestamp: new Date()
        };
        
        await interaction.channel.send({ embeds: [embed] });
        await interaction.reply({ content: '✅ تم إرسال الرسالة المنسقة!', ephemeral: true });
        break;
      }
      
      // /announce - إرسال تحديث
      case 'announce': {
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          return interaction.reply({ content: '❌ ليس لديك صلاحية! (مطلوب Admin)', ephemeral: true });
        }
        
        const title = options.getString('title');
        const message = options.getString('message');
        const mention = options.getBoolean('mention') || false;
        
        const embed = {
          color: 0xff0000,
          title: `📢 ${title}`,
          description: message,
          footer: { text: `إعلان رسمي من الإدارة` },
          timestamp: new Date()
        };
        
        if (mention) {
          await interaction.channel.send({ content: '@everyone', embeds: [embed] });
        } else {
          await interaction.channel.send({ embeds: [embed] });
        }
        
        await interaction.reply({ content: '✅ تم إرسال التحديث!', ephemeral: true });
        break;
      }
      
      // /clear - مسح الرسائل
      case 'clear': {
        if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
          return interaction.reply({ content: '❌ ليس لديك صلاحية!', ephemeral: true });
        }
        
        const amount = options.getInteger('amount');
        if (amount < 1 || amount > 100) {
          return interaction.reply({ content: '❌ يجب أن يكون العدد بين 1 و 100!', ephemeral: true });
        }
        
        await interaction.channel.bulkDelete(amount, true);
        await interaction.reply({ content: `✅ تم مسح ${amount} رسالة!`, ephemeral: true });
        break;
      }
      
      // /ping - سرعة البوت
      case 'ping': {
        const ping = client.ws.ping;
        const embed = {
          color: ping < 100 ? 0x00ff00 : ping < 200 ? 0xffff00 : 0xff0000,
          title: '🏓 Pong!',
          description: `**سرعة الاستجابة:** ${ping}ms`,
          timestamp: new Date()
        };
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /help - قائمة الأوامر
      case 'help': {
        const embed = {
          color: 0x0099ff,
          title: '📋 قائمة أوامر Trust State Bot',
          fields: [
            {
              name: '🌟 الأوامر العامة',
              value: '`/user` - معلومات مستخدم\n`/server` - معلومات السيرفر\n`/avatar` - صورة البروفايل\n`/profile` - بروفايلك\n`/ping` - سرعة البوت\n`/botinfo` - معلومات البوت\n`/invite` - رابط الدعوة\n`/uptime` - وقت التشغيل\n`/help` - هذه القائمة',
              inline: false
            },
            {
              name: '🎮 نظام المستويات والاقتصاد',
              value: '`/rank` - مستواك\n`/leaderboard` - توب الأعضاء\n`/daily` - مكافأة يومية\n`/balance` - رصيدك\n`/give` - تحويل فلوس\n`/shop` - المتجر\n`/buy` - شراء',
              inline: false
            },
            {
              name: '🎲 ألعاب وترفيه',
              value: '`/meme` - ميمز\n`/joke` - نكتة\n`/8ball` - الكرة السحرية\n`/roll` - رمي حجر\n`/coin` - رمي عملة',
              inline: false
            },
            {
              name: '💡 نظام الاقتراحات والبلاغات',
              value: '`/suggest` - إرسال اقتراح\n`/report` - الإبلاغ عن مخالفة',
              inline: false
            },
            {
              name: '🛡️ أوامر الإدارة',
              value: '`/say` - إرسال رسالة\n`/embed` - رسالة منسقة\n`/announce` - إرسال تحديث\n`/clear` - مسح الرسائل\n`/mute` - كتم عضو\n`/unmute` - فك كتم\n`/lock` - قفل الروم\n`/unlock` - فتح الروم\n`/slowmode` - وضع بطيء\n`/role` - إعطاء/إزالة رتبة\n`/nickname` - تغيير لقب\n`/poll` - إنشاء تصويت',
              inline: false
            }
          ],
          footer: { text: 'Trust State Bot - ProBot Style' },
          timestamp: new Date()
        };
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /suggest - اقتراح
      case 'suggest': {
        const content = options.getString('content');
        const suggestChannel = guild.channels.cache.find(c => c.name === 'suggestions') || interaction.channel;
        
        const embed = {
          color: 0x00ff00,
          title: '💡 اقتراح جديد',
          description: content,
          author: {
            name: interaction.user.tag,
            icon_url: interaction.user.displayAvatarURL({ dynamic: true })
          },
          footer: { text: `ID: ${interaction.user.id}` },
          timestamp: new Date()
        };
        
        const message = await suggestChannel.send({ embeds: [embed] });
        await message.react('👍');
        await message.react('👎');
        
        await interaction.reply({ content: '✅ تم إرسال اقتراحك!', ephemeral: true });
        break;
      }
      
      // /mute - كتم
      case 'mute': {
        if (!member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
          return interaction.reply({ content: '❌ ليس لديك صلاحية!', ephemeral: true });
        }
        
        const targetMember = options.getMember('member');
        const duration = options.getString('duration');
        const reason = options.getString('reason') || 'بدون سبب';
        
        // Parse duration (e.g., 1h, 30m, 1d)
        const time = parseInt(duration);
        const unit = duration.replace(time.toString(), '');
        let ms = time * 60 * 1000; // default minutes
        if (unit === 'h') ms = time * 60 * 60 * 1000;
        if (unit === 'd') ms = time * 24 * 60 * 60 * 1000;
        
        await targetMember.timeout(ms, reason);
        
        const embed = {
          color: 0xff0000,
          title: '🔇 كتم',
          description: `تم كتم ${targetMember.user.tag} لمدة ${duration}`,
          fields: [
            { name: 'السبب', value: reason, inline: false },
            { name: 'المكتوم', value: `<@${targetMember.id}>`, inline: true },
            { name: 'المدة', value: duration, inline: true }
          ],
          timestamp: new Date()
        };
        
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /unmute - فك الكتم
      case 'unmute': {
        if (!member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
          return interaction.reply({ content: '❌ ليس لديك صلاحية!', ephemeral: true });
        }
        
        const targetMember = options.getMember('member');
        await targetMember.timeout(null);
        
        await interaction.reply({ content: `✅ تم فك كتم ${targetMember.user.tag}` });
        break;
      }
      
      // /lock - قفل الروم
      case 'lock': {
        if (!member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
          return interaction.reply({ content: '❌ ليس لديك صلاحية!', ephemeral: true });
        }
        
        const reason = options.getString('reason') || 'بدون سبب';
        await interaction.channel.permissionOverwrites.edit(guild.id, { SendMessages: false });
        
        await interaction.reply({ content: `🔒 تم قفل الروم! السبب: ${reason}` });
        break;
      }
      
      // /unlock - فتح الروم
      case 'unlock': {
        if (!member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
          return interaction.reply({ content: '❌ ليس لديك صلاحية!', ephemeral: true });
        }
        
        const reason = options.getString('reason') || 'بدون سبب';
        await interaction.channel.permissionOverwrites.edit(guild.id, { SendMessages: true });
        
        await interaction.reply({ content: `🔓 تم فتح الروم! السبب: ${reason}` });
        break;
      }
      
      // /nickname - تغيير اللقب
      case 'nickname': {
        if (!member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
          return interaction.reply({ content: '❌ ليس لديك صلاحية!', ephemeral: true });
        }
        
        const targetMember = options.getMember('member');
        const newNickname = options.getString('nickname');
        
        await targetMember.setNickname(newNickname);
        
        if (newNickname) {
          await interaction.reply({ content: `✅ تم تغيير لقب ${targetMember.user.tag} إلى: ${newNickname}` });
        } else {
          await interaction.reply({ content: `✅ تم إزالة لقب ${targetMember.user.tag}` });
        }
        break;
      }
      
      // /poll - تصويت
      case 'poll': {
        if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
          return interaction.reply({ content: '❌ ليس لديك صلاحية!', ephemeral: true });
        }
        
        const question = options.getString('question');
        const option1 = options.getString('option1');
        const option2 = options.getString('option2');
        
        const embed = {
          color: 0x0099ff,
          title: '📊 تصويت',
          description: `**${question}**\n\n1️⃣ ${option1}\n2️⃣ ${option2}`,
          footer: { text: `بواسطة: ${interaction.user.tag}` },
          timestamp: new Date()
        };
        
        const pollMessage = await interaction.channel.send({ embeds: [embed] });
        await pollMessage.react('1️⃣');
        await pollMessage.react('2️⃣');
        
        await interaction.reply({ content: '✅ تم إنشاء التصويت!', ephemeral: true });
        break;
      }
      
      // /botinfo - معلومات البوت
      case 'botinfo': {
        const embed = {
          color: 0x7289da,
          title: '🤖 معلومات البوت',
          fields: [
            { name: 'الاسم', value: client.user.tag, inline: true },
            { name: 'الآيدي', value: client.user.id, inline: true },
            { name: 'عدد السيرفرات', value: `${client.guilds.cache.size}`, inline: true },
            { name: 'عدد المستخدمين', value: `${client.users.cache.size}`, inline: true },
            { name: 'سرعة الاستجابة', value: `${client.ws.ping}ms`, inline: true },
            { name: 'وقت التشغيل', value: `<t:${Math.floor((Date.now() - client.readyTimestamp) / 1000)}:R>`, inline: true }
          ],
          thumbnail: { url: client.user.displayAvatarURL() },
          timestamp: new Date()
        };
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /invite - رابط الدعوة
      case 'invite': {
        const invite = await interaction.channel.createInvite({ maxAge: 86400, maxUses: 0 });
        await interaction.reply({ content: `🔗 رابط الدعوة:\n${invite.url}` });
        break;
      }
      
      // /rank - مستوى العضو
      case 'rank': {
        const targetUser = options.getUser('member') || interaction.user;
        
        // Initialize XP system if not exists
        if (!client.xp) client.xp = new Map();
        if (!client.xp.has(targetUser.id)) {
          client.xp.set(targetUser.id, { xp: 0, level: 1, messages: 0 });
        }
        
        const userData = client.xp.get(targetUser.id);
        const xpNeeded = userData.level * 100;
        
        const embed = {
          color: 0x00ff00,
          title: `📊 مستوى ${targetUser.tag}`,
          fields: [
            { name: 'المستوى', value: `${userData.level}`, inline: true },
            { name: 'النقاط', value: `${userData.xp}/${xpNeeded}`, inline: true },
            { name: 'الرسائل', value: `${userData.messages}`, inline: true }
          ],
          thumbnail: { url: targetUser.displayAvatarURL({ dynamic: true }) },
          timestamp: new Date()
        };
        
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /leaderboard - توب الأعضاء
      case 'leaderboard': {
        if (!client.xp) client.xp = new Map();
        
        const sorted = Array.from(client.xp.entries())
          .sort((a, b) => b[1].level - a[1].level || b[1].xp - a[1].xp)
          .slice(0, 10);
        
        let description = '';
        for (let i = 0; i < sorted.length; i++) {
          const [userId, data] = sorted[i];
          const user = await client.users.fetch(userId).catch(() => null);
          if (user) {
            description += `${i + 1}. **${user.tag}** - مستوى ${data.level} (${data.xp} نقطة)\n`;
          }
        }
        
        if (!description) description = 'لا يوجد بيانات بعد!';
        
        const embed = {
          color: 0xffd700,
          title: '🏆 أفضل الأعضاء',
          description: description,
          timestamp: new Date()
        };
        
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /balance - رصيدك
      case 'balance': {
        const targetUser = options.getUser('member') || interaction.user;
        
        if (!client.balance) client.balance = new Map();
        const balance = client.balance.get(targetUser.id)?.amount || 0;
        
        await interaction.reply({ content: `💰 رصيد ${targetUser.tag}: ${balance} ريال` });
        break;
      }
      
      // /give - تحويل فلوس
      case 'give': {
        const targetUser = options.getUser('member');
        const amount = options.getInteger('amount');
        
        if (targetUser.id === interaction.user.id) {
          return interaction.reply({ content: '❌ لا يمكنك التحويل لنفسك!', ephemeral: true });
        }
        
        if (amount <= 0) {
          return interaction.reply({ content: '❌ المبلغ يجب أن يكون أكبر من 0!', ephemeral: true });
        }
        
        if (!client.balance) client.balance = new Map();
        
        const senderBalance = client.balance.get(interaction.user.id)?.amount || 0;
        
        if (senderBalance < amount) {
          return interaction.reply({ content: '❌ رصيدك غير كافٍ!', ephemeral: true });
        }
        
        // Deduct from sender
        client.balance.set(interaction.user.id, {
          amount: senderBalance - amount,
          lastDaily: client.balance.get(interaction.user.id)?.lastDaily || 0
        });
        
        // Add to receiver
        const receiverBalance = client.balance.get(targetUser.id)?.amount || 0;
        client.balance.set(targetUser.id, {
          amount: receiverBalance + amount,
          lastDaily: client.balance.get(targetUser.id)?.lastDaily || 0
        });
        
        await interaction.reply({ content: `💸 تم تحويل ${amount} ريال لـ ${targetUser.tag}` });
        break;
      }
      
      // /shop - متجر البوت
      case 'shop': {
        const embed = {
          color: 0x0099ff,
          title: '🛒 متجر Trust State',
          description: 'استخدم `/buy [رقم]` للشراء',
          fields: [
            { name: '1. لقب مميز', value: '1000 ريال - لقب ملون مميز', inline: false },
            { name: '2. رتبة VIP', value: '5000 ريال - رتبة VIP مع مميزات خاصة', inline: false },
            { name: '3. بادج مميز', value: '2000 ريال - بادج خاص في البروفايل', inline: false }
          ],
          timestamp: new Date()
        };
        
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /profile - البروفايل
      case 'profile': {
        const targetUser = options.getUser('member') || interaction.user;
        const targetMember = await guild.members.fetch(targetUser.id);
        
        if (!client.xp) client.xp = new Map();
        if (!client.balance) client.balance = new Map();
        
        const xpData = client.xp.get(targetUser.id) || { xp: 0, level: 1, messages: 0 };
        const balance = client.balance.get(targetUser.id)?.amount || 0;
        
        const embed = {
          color: 0x7289da,
          title: `👤 بروفايل ${targetUser.tag}`,
          thumbnail: { url: targetUser.displayAvatarURL({ dynamic: true, size: 256 }) },
          fields: [
            { name: '📊 المستوى', value: `${xpData.level}`, inline: true },
            { name: '💰 الرصيد', value: `${balance} ريال`, inline: true },
            { name: '💬 الرسائل', value: `${xpData.messages}`, inline: true },
            { name: '📅 انضم', value: `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:R>`, inline: true },
            { name: '🎂 الحساب', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: true },
            { name: '🏷️ الرتب', value: targetMember.roles.cache.map(r => r.name).slice(0, 5).join(', ') || 'لا يوجد', inline: false }
          ],
          timestamp: new Date()
        };
        
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /meme - ميمز
      case 'meme': {
        const memes = [
          'https://i.imgur.com/1.jpg',
          'https://i.imgur.com/2.jpg',
          'https://i.imgur.com/3.jpg'
        ];
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        
        await interaction.reply({ content: '😂 ميم عشوائي:', files: [randomMeme] });
        break;
      }
      
      // /joke - نكتة
      case 'joke': {
        const jokes = [
          'لماذا لا يستطيع البرنامج النصي الذهاب إلى النادي؟ لأنه لديه الكثير من الأخطاء!',
          'ما هو الشيء الذي يمشي بأربع أرجل في الصباح، واثنتين في الظهر، وثلاث في المساء؟ الإنسان!',
          'لماذا يحب المبرمجون القهوة؟ لأنها تجعلهم Java!',
          'ما الفرق بين المبرمج والمحتال؟ المبرمج يكذب على الكمبيوتر، والمحتال يكذب على الناس!'
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        
        await interaction.reply({ content: `😄 ${randomJoke}` });
        break;
      }
      
      // /8ball - سؤال
      case '8ball': {
        const question = options.getString('question');
        const responses = [
          '✅ نعم، بالتأكيد!',
          '❌ لا، مستحيل!',
          '🤔 ربما...',
          '😶 لا أستطيع الإجابة الآن',
          '👍 أعتقد ذلك',
          '👎 لا أعتقد ذلك',
          '🌟 بالتأكيد!',
          '🙅‍♂️ لا تفكر في ذلك'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const embed = {
          color: 0x800080,
          title: '🎱 الكرة السحرية',
          fields: [
            { name: 'سؤالك', value: question, inline: false },
            { name: 'الإجابة', value: randomResponse, inline: false }
          ],
          timestamp: new Date()
        };
        
        await interaction.reply({ embeds: [embed] });
        break;
      }
      
      // /roll - رمي حجر
      case 'roll': {
        const sides = options.getInteger('sides') || 6;
        const result = Math.floor(Math.random() * sides) + 1;
        
        await interaction.reply({ content: `🎲 رميت حجر ${sides} أوجه: **${result}**` });
        break;
      }
      
      // /coin - رمي عملة
      case 'coin': {
        const result = Math.random() < 0.5 ? 'صورة' : 'كتابة';
        
        await interaction.reply({ content: `🪙 النتيجة: **${result}**` });
        break;
      }
      
      // /uptime - وقت التشغيل
      case 'uptime': {
        const uptime = client.uptime;
        const days = Math.floor(uptime / (24 * 60 * 60 * 1000));
        const hours = Math.floor((uptime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((uptime % (60 * 60 * 1000)) / (60 * 1000));
        
        await interaction.reply({ content: `⏱️ وقت تشغيل البوت: **${days}** يوم **${hours}** ساعة **${minutes}** دقيقة` });
        break;
      }
      
    }
  } catch (error) {
    console.error(`Error in command ${commandName}:`, error);
    await interaction.reply({ content: '❌ حدث خطأ! حاول مرة أخرى.', ephemeral: true });
  }
});

// ============================================

client.login(TOKEN);

module.exports = { assignRole, assignReadyForInterviewRole, logExamFail, sendLog };
