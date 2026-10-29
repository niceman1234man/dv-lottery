require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not configured.');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

const translations = {
  en: {
    welcome: 'Welcome to the DV Lottery Assistant!',
    chooseLanguage: 'Choose your preferred language:',
    start: 'Start preparation',
    privacy: 'This independent assistant helps you prepare information for a possible Diversity Visa entry. It does not submit an official entry or determine eligibility. After you confirm, your answers and photos (including any spouse or child photos) will be sent to the administrator. Do not continue unless you agree.',
    agree: 'Continue',
    cancel: 'Cancel',
    cancelled: 'Preparation cancelled.',
    confirm: 'Confirm and send',
    restart: 'Start over',
    review: 'Review all information before sending it to the administrator:',
    done: 'Your information and photos were delivered to the administrator.',
    error: 'Delivery failed. Your answers are still saved; please contact the administrator.',
    adminMissing: 'Administrator ID is not configured.',
    invalidDate: 'Enter a real date in YYYY-MM-DD format (for example, 1998-05-17).',
    invalidChildren: 'Enter a whole number from 0 to 10.',
    invalidAnswer: 'Please answer Yes or No.',
    invalidRequired: 'This answer is required. Please enter it, or send /cancel.',
    invalidPhoto: 'Please send a photo to continue.',
    tooLong: 'Please keep this answer under 250 characters.',
    questions: {
      eligibility: 'Have you completed high school (or its equivalent), or do you have qualifying work experience (at least two years in the last five in qualifying work)? Answer Yes or No. This bot cannot determine official eligibility.',
      fullName: 'Enter your full name exactly as it appears on your passport (family name, given name, middle name if any).',
      gender: 'Enter your gender as it should appear on the entry.',
      birthDate: 'Enter your date of birth (YYYY-MM-DD).',
      birthCity: 'Enter the city/town where you were born. Do not enter a district or province unless that is the only locality.',
      birthCountry: 'Enter your country of birth.',
      eligibilityCountry: 'Enter the country you will claim for eligibility. This is usually your country of birth; special rules may apply.',
      address: 'Enter your mailing address (in care of, street/house number, apartment/unit, if applicable).',
      city: 'Enter your current city/town of residence.',
      region: 'Enter your current province/state/region, if applicable. Enter N/A if none.',
      postalCode: 'Enter your postal/ZIP code, if applicable. Enter N/A if none.',
      residenceCountry: 'Enter your current country of residence.',
      phone: 'Enter your phone number, including country code.',
      email: 'Enter your email address.',
      education: 'Enter your highest level of education completed. Only completed education should be listed.',
      maritalStatus: 'Enter your current marital status (for example: unmarried, married, divorced, widowed, or legally separated).',
      applicantPhoto: 'Send a recent photo of yourself that meets the official DV photo specifications.',
      spouseName: 'Enter your spouse’s full name as it appears on their passport.',
      spouseGender: 'Enter your spouse’s gender as it should appear on the entry.',
      spouseBirthDate: 'Enter your spouse’s date of birth (YYYY-MM-DD).',
      spouseBirthCity: 'Enter your spouse’s city/town of birth.',
      spouseBirthCountry: 'Enter your spouse’s country of birth.',
      spousePhoto: 'Send a recent photo of your spouse that meets the official DV photo specifications.',
      childrenCount: 'How many living, unmarried children under 21 must be listed under the current official DV instructions? Include qualifying biological, legally adopted, and stepchildren. Exceptions may apply, so verify the official instructions. Enter 0 to 10.',
      childName: 'Enter child {n}’s full name as it appears on their passport.',
      childGender: 'Enter child {n}’s gender as it should appear on the entry.',
      childBirthDate: 'Enter child {n}’s date of birth (YYYY-MM-DD).',
      childBirthCity: 'Enter child {n}’s city/town of birth.',
      childBirthCountry: 'Enter child {n}’s country of birth.',
      childPhoto: 'Send a recent photo of child {n} that meets the official DV photo specifications.'
    },
    labels: {
      eligibility: 'Education/work eligibility self-assessment',
      fullName: 'Full name',
      gender: 'Gender',
      birthDate: 'Date of birth',
      birthCity: 'City/town of birth',
      birthCountry: 'Country of birth',
      eligibilityCountry: 'Country of eligibility',
      address: 'Mailing address',
      city: 'City/town of residence',
      region: 'State/province/region',
      postalCode: 'Postal/ZIP code',
      residenceCountry: 'Country of residence',
      phone: 'Phone',
      email: 'Email',
      education: 'Highest education completed',
      maritalStatus: 'Marital status',
      spouseName: 'Spouse full name',
      spouseGender: 'Spouse gender',
      spouseBirthDate: 'Spouse date of birth',
      spouseBirthCity: 'Spouse city/town of birth',
      spouseBirthCountry: 'Spouse country of birth',
      spousePhoto: 'Spouse photo',
      childrenCount: 'Eligible children count',
      childName: 'Child {n} full name',
      childGender: 'Child {n} gender',
      childBirthDate: 'Child {n} date of birth',
      childBirthCity: 'Child {n} city/town of birth',
      childBirthCountry: 'Child {n} country of birth',
      childPhoto: 'Child {n} photo'
    }
  },
  am: {
    welcome: 'ወደ DV Lottery ረዳት ቦት እንኳን በደህና መጡ!',
    chooseLanguage: 'እባክዎ የሚመርጡትን ቋንቋ ይምረጡ።',
    start: 'ዝግጅት ጀምር',
    privacy: 'ይህ ገለልተኛ ረዳት ለDiversity Visa ማመልከቻ መረጃ ለማዘጋጀት ይረዳል። ይፋዊ ማመልከቻ አያስገባም ወይም ብቁነትን አይወስንም። ካረጋገጡ በኋላ መልሶችዎና ፎቶዎችዎ (የትዳር ጓደኛና ልጆች ፎቶዎችን ጨምሮ) ለአስተዳዳሪው ይላካሉ። ካልተስማሙ አይቀጥሉ።',
    agree: 'ቀጥል',
    cancel: 'ሰርዝ',
    cancelled: 'ዝግጅቱ ተሰርዟል።',
    confirm: 'አረጋግጥና ላክ',
    restart: 'እንደገና ጀምር',
    review: 'ለአስተዳዳሪው ከመላክዎ በፊት መረጃውን ይከልሱ፦',
    done: 'መረጃዎና ፎቶዎችዎ ለአስተዳዳሪው ተልከዋል።',
    error: 'መላኩ አልተሳካም። መልሶችዎ ተቀምጠዋል፤ እባክዎ አስተዳዳሪውን ያነጋግሩ።',
    adminMissing: 'የአስተዳዳሪው መለያ አልተዋቀረም።',
    invalidDate: 'እባክዎ ትክክለኛ ቀንን በYYYY-MM-DD ቅርጸት ያስገቡ (ለምሳሌ 1998-05-17)።',
    invalidChildren: 'እባክዎ ከ0 እስከ 10 ያለ ሙሉ ቁጥር ያስገቡ።',
    invalidAnswer: 'እባክዎ Yes ወይም No ብለው ይመልሱ።',
    invalidRequired: 'ይህ መልስ ያስፈልጋል። ያስገቡ ወይም /cancel ይላኩ።',
    invalidPhoto: 'ለመቀጠል እባክዎ ፎቶ ይላኩ።',
    tooLong: 'እባክዎ መልሱን ከ250 ቁምፊ በታች ያድርጉ።',
    questions: {
      eligibility: 'የሁለተኛ ደረጃ ትምህርት (ወይም ተመጣጣኝ) ጨርሰዋል ወይም ብቁ የሥራ ልምድ አለዎት? Yes ወይም No ይበሉ። ይህ ቦት ይፋዊ ብቁነትን አይወስንም።',
      fullName: 'በፓስፖርትዎ ላይ እንደተጻፈው ሙሉ ስምዎን ያስገቡ።',
      gender: 'በማመልከቻው ላይ እንዲገለጽ የሚፈልጉትን ጾታ ያስገቡ።',
      birthDate: 'የትውልድ ቀንዎን በYYYY-MM-DD ያስገቡ።',
      birthCity: 'የተወለዱበትን ከተማ/አካባቢ ያስገቡ።',
      birthCountry: 'የተወለዱበትን አገር ያስገቡ።',
      eligibilityCountry: 'ለብቁነት የሚጠይቁበትን አገር ያስገቡ። ብዙ ጊዜ የትውልድ አገር ነው፤ ልዩ ደንቦች ሊኖሩ ይችላሉ።',
      address: 'የፖስታ አድራሻዎን ያስገቡ።',
      city: 'አሁን የሚኖሩበትን ከተማ ያስገቡ።',
      region: 'አሁን የሚኖሩበትን ክልል/ግዛት ያስገቡ፤ ከሌለ N/A ይበሉ።',
      postalCode: 'የፖስታ ኮድዎን ያስገቡ፤ ከሌለ N/A ይበሉ።',
      residenceCountry: 'አሁን የሚኖሩበትን አገር ያስገቡ።',
      phone: 'ስልክ ቁጥርዎን ከአገር መለያ ጋር ያስገቡ።',
      email: 'የኢሜይል አድራሻዎን ያስገቡ።',
      education: 'የጨረሱትን ከፍተኛ የትምህርት ደረጃ ያስገቡ።',
      maritalStatus: 'አሁን ያለዎትን የጋብቻ ሁኔታ ያስገቡ (ለምሳሌ ያላገባ፣ ያገባ፣ የተፋታ፣ ባል/ሚስት የሞተበት፣ በሕግ የተለየ)።',
      applicantPhoto: 'የDV ይፋዊ የፎቶ መስፈርት የሚያሟላ የቅርብ ጊዜ ፎቶዎን ይላኩ።',
      spouseName: 'በፓስፖርት ላይ እንደተጻፈው የትዳር ጓደኛዎን ሙሉ ስም ያስገቡ።',
      spouseGender: 'የትዳር ጓደኛዎን ጾታ ያስገቡ።',
      spouseBirthDate: 'የትዳር ጓደኛዎን የትውልድ ቀን በYYYY-MM-DD ያስገቡ።',
      spouseBirthCity: 'የትዳር ጓደኛዎን የትውልድ ከተማ ያስገቡ።',
      spouseBirthCountry: 'የትዳር ጓደኛዎን የትውልድ አገር ያስገቡ።',
      spousePhoto: 'የትዳር ጓደኛዎን የDV ይፋዊ የፎቶ መስፈርት የሚያሟላ የቅርብ ጊዜ ፎቶ ይላኩ።',
      childrenCount: 'በአሁኑ ይፋዊ የDV መመሪያ መሠረት መዘርዘር ያለብዎት ከ21 ዓመት በታች ያሉና ያላገቡ ልጆች ስንት ናቸው? ብቁ የሆኑ የወለዷቸውን፣ በሕግ ያሳደጓቸውንና የእንጀራ ልጆችን ያካትቱ። ልዩ ሁኔታዎች ሊኖሩ ስለሚችሉ ይፋዊ መመሪያውን ያረጋግጡ። ከ0 እስከ 10 ያስገቡ።',
      childName: 'የልጅ {n} ሙሉ ስም ያስገቡ።',
      childGender: 'የልጅ {n} ጾታ ያስገቡ።',
      childBirthDate: 'የልጅ {n} የትውልድ ቀን በYYYY-MM-DD ያስገቡ።',
      childBirthCity: 'የልጅ {n} የትውልድ ከተማ ያስገቡ።',
      childBirthCountry: 'የልጅ {n} የትውልድ አገር ያስገቡ።',
      childPhoto: 'የልጅ {n} የDV ይፋዊ የፎቶ መስፈርት የሚያሟላ የቅርብ ጊዜ ፎቶ ይላኩ።'
    },
    labels: {
      eligibility: 'የትምህርት/ሥራ ብቁነት ራስ-ግምገማ',
      fullName: 'ሙሉ ስም',
      gender: 'ጾታ',
      birthDate: 'የትውልድ ቀን',
      birthCity: 'የትውልድ ከተማ',
      birthCountry: 'የትውልድ አገር',
      eligibilityCountry: 'የብቁነት አገር',
      address: 'የፖስታ አድራሻ',
      city: 'የመኖሪያ ከተማ',
      region: 'ክልል/ግዛት',
      postalCode: 'የፖስታ ኮድ',
      residenceCountry: 'የመኖሪያ አገር',
      phone: 'ስልክ',
      email: 'ኢሜይል',
      education: 'የጨረሱት ከፍተኛ ትምህርት',
      maritalStatus: 'የጋብቻ ሁኔታ',
      applicantPhoto: 'የአመልካች ፎቶ',
      spouseName: 'የትዳር ጓደኛ ሙሉ ስም',
      spouseGender: 'የትዳር ጓደኛ ጾታ',
      spouseBirthDate: 'የትዳር ጓደኛ የትውልድ ቀን',
      spouseBirthCity: 'የትዳር ጓደኛ የትውልድ ከተማ',
      spouseBirthCountry: 'የትዳር ጓደኛ የትውልድ አገር',
      spousePhoto: 'የትዳር ጓደኛ ፎቶ',
      childrenCount: 'የልጆች ብዛት',
      childName: 'የልጅ {n} ሙሉ ስም',
      childGender: 'የልጅ {n} ጾታ',
      childBirthDate: 'የልጅ {n} የትውልድ ቀን',
      childBirthCity: 'የልጅ {n} የትውልድ ከተማ',
      childBirthCountry: 'የልጅ {n} የትውልድ አገር',
      childPhoto: 'የልጅ {n} ፎቶ'
    }
  }
};

const sessions = new Map();
const baseFields = [
  'eligibility', 'fullName', 'gender', 'birthDate', 'birthCity',
  'birthCountry', 'eligibilityCountry', 'address', 'city', 'region',
  'postalCode', 'residenceCountry', 'phone', 'email', 'education',
  'maritalStatus', 'applicantPhoto'
];
const familyFields = [
  'Name', 'Gender', 'BirthDate', 'BirthCity', 'BirthCountry', 'Photo'
];

function getSession(ctx) {
  const id = ctx.from.id;
  if (!sessions.has(id)) sessions.set(id, { language: 'en', step: 'language' });
  return sessions.get(id);
}

function t(ctx, key) {
  const session = getSession(ctx);
  return translations[session.language][key];
}

function localized(ctx, key, n) {
  const language = getSession(ctx).language;
  return translations[language].questions[key].replaceAll('{n}', String(n));
}

function fieldsFor(data) {
  const fields = [...baseFields];
  if (/married|ያገባ|ያገባች|በሕግ የተለየ/i.test(data.maritalStatus || '')) {
    fields.push(
      'spouseName', 'spouseGender', 'spouseBirthDate',
      'spouseBirthCity', 'spouseBirthCountry', 'spousePhoto'
    );
  }

  fields.push('childrenCount');
  for (let child = 1; child <= Number(data.childrenCount || 0); child += 1) {
    familyFields.forEach((field) => fields.push(`child${child}${field}`));
  }
  return fields;
}

function getFieldPrompt(ctx, field) {
  const match = field.match(/^child(\d+)(Name|Gender|BirthDate|BirthCity|BirthCountry|Photo)$/);
  if (match) return localized(ctx, `child${match[2]}`, match[1]);
  return localized(ctx, field);
}

function languageButtons() {
  return Markup.inlineKeyboard([[
    Markup.button.callback('🇬🇧 English', 'lang_en'),
    Markup.button.callback('🇪🇹 አማርኛ', 'lang_am')
  ]]);
}

function mainMenu(ctx) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(ctx, 'start'), 'register')],
    [Markup.button.callback('🌐 Change language / ቋንቋ', 'change_language')]
  ]);
}

function isPhotoField(field) {
  return field === 'applicantPhoto' || field === 'spousePhoto' ||
    /^child\d+Photo$/.test(field);
}

function isDateField(field) {
  return field === 'birthDate' || field === 'spouseBirthDate' ||
    /^child\d+BirthDate$/.test(field);
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
}

async function askCurrentField(ctx, session) {
  const fields = fieldsFor(session.data);
  const field = fields[session.fieldIndex];
  if (!field) {
    session.step = 'review';
    return showReview(ctx, session);
  }
  return ctx.reply(getFieldPrompt(ctx, field));
}

function formatReport(ctx, session) {
  const language = session.language;
  const lines = [
    'DV LOTTERY INFORMATION PREPARATION — NOT AN OFFICIAL ENTRY',
    'This information was provided voluntarily by the applicant.',
    ''
  ];
  fieldsFor(session.data).forEach((field) => {
    if (isPhotoField(field)) return;
    const label = translations[language].labels[
      field.replace(/^child\d+/, 'child')
    ];
    const match = field.match(/^child(\d+)/);
    const printableLabel = match
      ? label.replaceAll('{n}', match[1])
      : label;
    lines.push(`${printableLabel}: ${session.data[field]}`);
  });
  return lines.join('\n');
}

async function showReview(ctx, session) {
  const report = formatReport(ctx, session);
  await ctx.reply(
    `${t(ctx, 'review')}\n\n${report}`,
    Markup.inlineKeyboard([
      [Markup.button.callback(t(ctx, 'confirm'), 'confirm')],
      [Markup.button.callback(t(ctx, 'restart'), 'register')],
      [Markup.button.callback(t(ctx, 'cancel'), 'cancel')]
    ])
  );
}

bot.start(async (ctx) => {
  sessions.set(ctx.from.id, { language: 'en', step: 'language' });
  await ctx.reply('🇺🇸 DV Lottery Assistant\n\nChoose your language / ቋንቋ ይምረጡ', languageButtons());
});

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
  await ctx.reply(t(ctx, 'chooseLanguage'), mainMenu(ctx));
});

bot.action('change_language', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Choose your language / ቋንቋ ይምረጡ', languageButtons());
});

bot.action('register', async (ctx) => {
  await ctx.answerCbQuery();
  const session = getSession(ctx);
  session.step = 'consent';
  session.data = {};
  session.fieldIndex = 0;
  await ctx.reply(
    t(ctx, 'privacy'),
    Markup.inlineKeyboard([
      [Markup.button.callback(t(ctx, 'agree'), 'agree')],
      [Markup.button.callback(t(ctx, 'cancel'), 'cancel')]
    ])
  );
});

bot.action('agree', async (ctx) => {
  await ctx.answerCbQuery();
  const session = getSession(ctx);
  if (session.step !== 'consent') return;
  session.step = 'form';
  await askCurrentField(ctx, session);
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
  if (session.step !== 'form') return;

  const field = fieldsFor(session.data)[session.fieldIndex];
  if (!field) return;
  if (isPhotoField(field)) return ctx.reply(t(ctx, 'invalidPhoto'));

  const answer = ctx.message.text.trim();
  if (!answer) return ctx.reply(t(ctx, 'invalidRequired'));
  if (answer.length > 250) return ctx.reply(t(ctx, 'tooLong'));

  if (field === 'eligibility' && !/^(yes|no)$/i.test(answer)) {
    return ctx.reply(t(ctx, 'invalidAnswer'));
  }
  if (field === 'childrenCount' && !/^(10|[0-9])$/.test(answer)) {
    return ctx.reply(t(ctx, 'invalidChildren'));
  }
  if (isDateField(field) && !validDate(answer)) {
    return ctx.reply(t(ctx, 'invalidDate'));
  }

  session.data[field] = answer;
  session.fieldIndex += 1;
  return askCurrentField(ctx, session);
});

bot.on('photo', async (ctx) => {
  const session = getSession(ctx);
  if (session.step !== 'form') return;

  const field = fieldsFor(session.data)[session.fieldIndex];
  if (!field || !isPhotoField(field)) return;

  session.data[field] = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  session.fieldIndex += 1;
  await askCurrentField(ctx, session);
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

  if (session.step !== 'review') return;
  if (!adminId) {
    console.error('Admin notification failed: ADMIN_TELEGRAM_ID is not configured.');
    return ctx.reply(t(ctx, 'adminMissing'));
  }

  try {
    const report = formatReport(ctx, session);
    const chunks = report.match(/[\s\S]{1,3500}/g) || [];
    for (const chunk of chunks) {
      await bot.telegram.sendMessage(adminId, chunk);
    }

    for (const field of fieldsFor(session.data).filter(isPhotoField)) {
      const person = field === 'spousePhoto'
        ? 'Spouse'
        : field === 'applicantPhoto'
          ? 'Applicant'
          : `Child ${field.match(/^child(\d+)/)[1]}`;
      await bot.telegram.sendPhoto(adminId, session.data[field], {
        caption: `${person} photo for applicant ${ctx.from.id}`
      });
    }

    session.step = 'menu';
    session.data = {};
    await ctx.reply(t(ctx, 'done'), mainMenu(ctx));
  } catch (error) {
    console.error('Admin notification failed:', error);
    await ctx.reply(t(ctx, 'error'));
  }
});

bot.catch((error) => {
  console.error('Telegram bot error:', error);
});

bot.launch(() => console.log('DV Lottery bot connected; starting long polling.'))
  .catch((error) => console.error('Bot startup failed:', error.message));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
