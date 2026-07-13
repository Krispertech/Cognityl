/**
 * The chatbot's entire knowledge. Everything is local — no model, no API call.
 *
 * To add an answer: add an entry with a unique `id`, keywords per language,
 * and an answer per language. Order does not matter; scoring decides.
 *
 * Keep answers honest. If Cognityl cannot do something, say so here rather
 * than letting the fallback imply otherwise.
 */

export const knowledge = [
  {
    id: 'pricing',
    keywords: {
      lv: ['cena', 'cenas', 'maksā', 'maksa', 'izmaksas', 'cik', 'eiro', 'eur', 'abonement', 'tarif'],
      en: ['price', 'pricing', 'cost', 'costs', 'how much', 'fee', 'subscription', 'eur'],
    },
    answer: {
      lv: 'Divi maksājumi. Ieviešana — vienreizējs maksājums no 200 €, ietver kalendāra integrāciju un sistēmas apmācību. Uzturēšana — no 150 €/mēnesī, ietver visas sarunas, serverus un atbalstu. Precīza cena atkarīga no zvanu apjoma; to pasakām pirms jūs kaut ko maksājat.',
      en: 'Two payments. Setup — a one-off from €200, covering calendar integration and training the system. Maintenance — from €150/month, covering all conversations, servers and support. The exact figure depends on call volume, and we tell you before you pay anything.',
    },
  },
  {
    id: 'how_it_works',
    keywords: {
      lv: ['kā strādā', 'kā darbojas', 'kā tas', 'process', 'soļi', 'kā notiek', 'darbojas'],
      en: ['how does', 'how it works', 'how do', 'process', 'steps', 'work'],
    },
    answer: {
      lv: 'Trīs soļi. Klients piezvana — AI atbild uzreiz un atpazīst valodu. AI atbild uz jautājumiem (darba laiks, cenas, adrese). Tad pārbauda jūsu kalendāru un pieraksta klientu. Jums nav jāmaina ne numurs, ne kalendārs.',
      en: 'Three steps. The client calls — the AI answers immediately and detects the language. It answers questions (hours, prices, address). Then it checks your calendar and books the client in. You change neither your number nor your calendar.',
    },
  },
  {
    id: 'languages',
    keywords: {
      lv: ['valoda', 'valodas', 'latviski', 'krieviski', 'angliski', 'krievu', 'latviešu'],
      en: ['language', 'languages', 'latvian', 'russian', 'english', 'speak'],
    },
    answer: {
      lv: 'Mērķis ir latviešu, krievu un angļu valoda, ar valodas atpazīšanu sarunas sākumā. Godīgi: latviešu balss atpazīšana ir tehniski grūtākā daļa, un to pārbaudām katram klientam atsevišķi pirms solām rezultātu.',
      en: 'The goal is Latvian, Russian and English, with language detection at the start of the call. Honestly: Latvian speech recognition is the hardest part technically, and we test it per client before promising a result.',
    },
  },
  {
    id: 'calendar',
    keywords: {
      lv: ['kalendār', 'fresha', 'google', 'integrāc', 'rezervāc', 'pieraksts', 'sistēma'],
      en: ['calendar', 'fresha', 'google', 'integration', 'booking', 'schedule', 'system'],
    },
    answer: {
      lv: 'Strādājam ar kalendāriem, ko jau lietojat — Fresha, Google Calendar un citiem. Jaunas programmas nav jāapgūst; pieraksts parādās tur, kur skatāties jau šodien.',
      en: 'We work with the calendar you already use — Fresha, Google Calendar and others. No new software to learn; the booking appears where you already look today.',
    },
  },
  {
    id: 'setup_time',
    keywords: {
      lv: ['cik ilgi', 'kad', 'termiņ', 'ātri', 'ieviešana', 'uzstādīšana', 'dienas'],
      en: ['how long', 'when', 'timeline', 'fast', 'setup', 'deploy', 'days'],
    },
    answer: {
      lv: 'Parasti dažas nedēļas: apmācām sistēmu ar jūsu cenām, pakalpojumiem un darba laiku, tad testējam uz reāliem zvaniem, un tikai tad palaižam. Negribam solīt "gatavs rīt" — latviešu valodas testēšana prasa laiku.',
      en: 'Usually a few weeks: we train the system on your prices, services and hours, test it on real calls, and only then go live. We would rather not promise "ready tomorrow" — testing Latvian properly takes time.',
    },
  },
  {
    id: 'is_it_ai',
    keywords: {
      lv: ['vai tas ir robots', 'ir ai', 'mākslīgais', 'robots', 'cilvēks', 'sapratīs', 'pamanīs'],
      en: ['is it a robot', 'is it ai', 'artificial', 'robot', 'human', 'notice', 'realise'],
    },
    answer: {
      lv: 'Jā, tas ir AI, un mēs to pasakām klientam. Slēpšana rada neuzticību. Daļa zvanītāju uzreiz gribēs cilvēku — tāpēc katram AI ir ātra pāradresācija uz jūsu telefonu.',
      en: 'Yes, it is an AI, and we tell the caller so. Hiding it destroys trust. Some callers will want a human immediately — which is why every agent has a fast handoff to your phone.',
    },
  },
  {
    id: 'control',
    keywords: {
      lv: ['kontrol', 'ieraksti', 'noklausīt', 'pārskat', 'izslēgt', 'apturēt', 'drošīb'],
      en: ['control', 'recording', 'listen', 'review', 'turn off', 'pause', 'security'],
    },
    answer: {
      lv: 'Katru sarunu varat pārskatīt un noklausīties, un AI varat apturēt jebkurā brīdī. Sarežģītos gadījumus AI novirza jums, nevis izdomā atbildi.',
      en: 'You can review and listen to every conversation, and stop the AI at any moment. Difficult cases route to you rather than the AI inventing an answer.',
    },
  },
  {
    id: 'industries',
    keywords: {
      lv: ['autoserviss', 'frizētava', 'salons', 'nozare', 'bizness', 'kam derīgs', 'klīnika'],
      en: ['auto repair', 'barbershop', 'salon', 'industry', 'business', 'who is it for', 'clinic'],
    },
    answer: {
      lv: 'Autoservisi, frizētavas un skaistumkopšanas saloni — vietas, kur īpašnieks strādā ar rokām un nevar pacelt telefonu. Ja saņemat vismaz ~100 zvanus mēnesī, ieguvums ir reāls; ja mazāk, godīgi sakot, vēl nav vērts.',
      en: 'Auto repair shops, barbershops and beauty salons — places where the owner works with their hands and cannot pick up the phone. If you get at least ~100 calls a month it pays off; below that, honestly, it is not worth it yet.',
    },
  },
  {
    id: 'contact_human',
    keywords: {
      lv: ['cilvēk', 'sazināties', 'runāt ar', 'zvanīt jums', 'kontakt'],
      en: ['human', 'contact', 'talk to', 'call you', 'speak to someone'],
    },
    answer: {
      lv: 'Varat rakstīt tieši: kristaps@cognityl.com. Vai arī atstājiet savus datus šeit — pajautāšu dažus jautājumus un nodošu tālāk.',
      en: 'You can email directly: kristaps@cognityl.com. Or leave your details here — I will ask a few questions and pass them on.',
    },
  },
];

/** Phrases that start the lead-capture flow instead of returning an answer. */
export const bookingTriggers = {
  lv: ['konsultāc', 'pieteikt', 'pieteikums', 'gribu runāt', 'sazinieties', 'atstāt datus', 'demo'],
  en: ['consultation', 'book a call', 'contact me', 'get in touch', 'leave details', 'demo', 'sign up'],
};

export const greetingTriggers = {
  lv: ['sveiki', 'labdien', 'čau', 'labrīt', 'labvakar'],
  en: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
};
