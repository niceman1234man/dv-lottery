require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const translations = {
  en: {
    welcome: 'Welcome to the DV Lottery Assistant!',
    language: 'Choose your preferred language:',
    start: 'Start Registration',
    privacy: 'This independent assistant helps you prepare information. It does not submit an official DV Lottery entry. Your information and photo will be sent to the administrator after you confirm.',
    firstName: 'What is your first name?',
    lastName: 'What is your last name?',
    dob: 'Enter your date of birth (YYYY-MM-DD):',
    education: 'What is your highest education level?',
    photo: 'Please upload your photo.',
    review: 'Please review your information:',
    confirm: 'Confirm',
    edit: 'Restart registration',
    cancel: 'Cancel',
    cancelled: 'Registration cancelled.',
    done: 'Your information has been sent to the administrator.',
    invalidDate: 'Please enter a valid date in YYYY-MM-DD format.',
    needPhoto: 'Please upload a photo to continue.',
    error: 'Something went wrong. Please try again later.'
  },
  am: {
    welcome: 'ወደ DV Lottery ረዳት ቦት እንኳን በደህና መጡ!',
    language: 'እባክዎ የሚመርጡትን ቋንቋ ይምረጡ።',
    start: 'ምዝገባ ጀምር',
    privacy: 'ይህ የመረጃ ዝግጅት ረዳት ነው፤ ይፋዊ የDV Lottery ማመልከቻ አያስገባም። ካረጋገጡ በኋላ መረጃዎና ፎቶዎ ለአስተዳዳሪው ይላካል።',
    firstName: 'ስምዎን ያስገቡ።',
    lastName: 'የአባት ስምዎን ያስገቡ።',
    dob: 'የትውልድ ቀንዎን በYYYY-MM-DD ቅርጸት ያስገቡ።',
    education: 'ከፍተኛው የትምህርት ደረጃዎ ምንድን ነው?',
    photo: 'እባክዎ ፎቶዎን ይላኩ።',
    review: 'መረጃዎን ይመልከቱ፦',
    confirm: 'አረጋግጥ',
    edit: 'ምዝገባውን እንደገና ጀምር',
    cancel: 'ሰርዝ',
    cancelled: 'ምዝገባው ተሰርዟል።',
    done: 'መረጃዎ ለአስተዳዳሪው ተልኳል።',
    invalidDate: 'እባክዎ ትክክለኛ ቀንን በYYYY-MM-DD ቅርጸት ያስገቡ።',
    needPhoto: 'ለመቀጠል እባክዎ ፎቶ ይላኩ።',
    error: 'ስህተት ተፈጥሯል። እባክዎ ቆይተው እንደገና ይሞክሩ።'
  }
};

const sessions = new Map();

function getSession(ctx) {
  const id = ctx.from.id;

  if (!sessions.has(id)) {
    sessions.set(id, { language: 'en', step: 'language' });
  }

  return sessions.get(id);
}

function t(ctx, key) {
  const session = getSession(ctx);
  return translations[session.language][key];
}

function languageButtons() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🇬🇧 English', 'lang_en'),
      Markup.button.callback('🇪🇹 አማርኛ', 'lang_am')
    ]
  ]);
}

function mainMenu(ctx) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(ctx, 'start'), 'register')],
    [Markup.button.callback('🌐 Change language / ቋንቋ', 'change_language')]
  ]);
}

bot.start(async (ctx) => {
  sessions.set(ctx.from.id, { language: 'en', step: 'language' });

  await ctx.reply(
    '🇺🇸 DV Lottery Assistant\n\nChoose your language / ቋንቋ ይምረጡ',
    languageButtons()
  );
});

// Use this command to find your Telegram user ID.
bot.command('myid', async (ctx) => {
  await ctx.reply(`Your Telegram user ID: ${ctx.from.id}`);
});

bot.action(/^lang_(en|am)$/, async (ctx) => {
  const session = getSession(ctx);
  session.language = ctx.match[1];
  session.step = 'menu';

  await ctx.answerCbQuery();
  await ctx.reply(t(ctx, 'welcome'));
  await ctx.reply(t(ctx, 'privacy'));
  await ctx.reply(t(ctx, 'language'), mainMenu(ctx));
});

bot.action('change_language', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Choose your language / ቋንቋ ይምረጡ', languageButtons());
});

bot.action('register', async (ctx) => {
  await ctx.answerCbQuery();

  const session = getSession(ctx);
  session.step = 'firstName';
  session.data = {};

  await ctx.reply(t(ctx, 'firstName'));
});

bot.command('cancel', async (ctx) => {
  const session = getSession(ctx);
  session.step = 'menu';
  session.data = {};

  await ctx.reply(t(ctx, 'cancelled'), mainMenu(ctx));
});

bot.on('text', async (ctx) => {
  const session = getSession(ctx);

  if (ctx.message.text.startsWith('/')) return;
  if (session.step === 'menu' || session.step === 'language') return;

  const answer = ctx.message.text.trim();

  if (session.step === 'firstName') {
    session.data.firstName = answer;
    session.step = 'lastName';
    return ctx.reply(t(ctx, 'lastName'));
  }

  if (session.step === 'lastName') {
    session.data.lastName = answer;
    session.step = 'dob';
    return ctx.reply(t(ctx, 'dob'));
  }

  if (session.step === 'dob') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(answer) ||
        Number.isNaN(Date.parse(answer)) ||
        new Date(answer).toISOString().slice(0, 10) !== answer) {
      return ctx.reply(t(ctx, 'invalidDate'));
    }

    session.data.dob = answer;
    session.step = 'education';
    return ctx.reply(t(ctx, 'education'));
  }

  if (session.step === 'education') {
    session.data.education = answer;
    session.step = 'photo';
    return ctx.reply(t(ctx, 'photo'));
  }
});

bot.on('photo', async (ctx) => {
  const session = getSession(ctx);

  if (session.step !== 'photo') return;

  session.data.photoFileId =
    ctx.message.photo[ctx.message.photo.length - 1].file_id;

  session.step = 'review';

  const d = session.data;

  await ctx.reply(
    `${t(ctx, 'review')}\n\n` +
    `First name: ${d.firstName}\n` +
    `Last name: ${d.lastName}\n` +
    `Date of birth: ${d.dob}\n` +
    `Education: ${d.education}`,
    Markup.inlineKeyboard([
      [Markup.button.callback(t(ctx, 'confirm'), 'confirm')],
      [Markup.button.callback(t(ctx, 'edit'), 'register')],
      [Markup.button.callback(t(ctx, 'cancel'), 'cancel')]
    ])
  );
});

bot.action('cancel', async (ctx) => {
  await ctx.answerCbQuery();

  const session = getSession(ctx);
  session.step = 'menu';
  session.data = {};

  await ctx.reply(t(ctx, 'cancelled'), mainMenu(ctx));
});

bot.action('confirm', async (ctx) => {
  await ctx.answerCbQuery();

  const session = getSession(ctx);
  const adminId = process.env.ADMIN_TELEGRAM_ID;

  if (!session.data || !session.data.photoFileId) {
    return ctx.reply(t(ctx, 'needPhoto'));
  }

  if (!adminId) {
    return ctx.reply('Administrator ID is not configured.');
  }

  const d = session.data;
  const report =
    'DV LOTTERY ASSISTANT — APPLICANT REPORT\n' +
    'የDV Lottery አመልካች ሪፖርት\n\n' +
    `First name / ስም: ${d.firstName}\n` +
    `Last name / የአባት ስም: ${d.lastName}\n` +
    `Date of birth / የትውልድ ቀን: ${d.dob}\n` +
    `Education / ትምህርት: ${d.education}\n\n` +
    'This is not an official DV Lottery entry.\n' +
    'ይህ ይፋዊ የDV Lottery ማመልከቻ አይደለም።';

  try {
    await bot.telegram.sendMessage(adminId, report);
    await bot.telegram.sendPhoto(adminId, d.photoFileId, {
      caption: 'Applicant photo / የአመልካች ፎቶ'
    });

    session.step = 'menu';
    session.data = {};

    await ctx.reply(t(ctx, 'done'), mainMenu(ctx));
  } catch (error) {
    console.error('Admin notification failed:', error.message);
    await ctx.reply(t(ctx, 'error'));
  }
});

bot.catch((error) => {
  console.error('Telegram bot error:', error);
});

bot.launch()
  .then(() => console.log('DV Lottery bot is running.'))
  .catch((error) => console.error('Bot startup failed:', error.message));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
