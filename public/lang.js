// ── Translations ─────────────────────────────────────────────────────────────
const translations = {
  de: {
    nav_rsvp: 'Zusagen',
    nav_gifts: 'Wunschliste',
    nav_impressum: 'Impressum',
    footer: 'Florian & Sebastian \u2014 Wir freuen uns auf euch!',

    'rsvp.title': 'Eure Zusage',
    'rsvp.subtitle': 'Sagt uns hier, ob ihr dabei sein k\u00f6nnt und was wir beachten sollen.',
    'rsvp.nameLabel': 'Euer Name *',
    'rsvp.namePlaceholder': 'z.\u202fB. Anna & Max Muster',
    'rsvp.attendingLabel': 'Kommt ihr? *',
    'rsvp.yes': 'Ja, wir kommen!',
    'rsvp.no': 'Leider nicht',
    'rsvp.guestCount': 'Anzahl Personen *',
    'rsvp.childrenCount': 'Davon Kinder unter 3 Jahren',
    'rsvp.vegetarian': 'Wir essen vegetarisch',
    'rsvp.friday': 'Wir sind bereits am Freitagabend dabei',
    'rsvp.fridayHint': '(optional \u2013 Details folgen mit der Einladung)',
    'rsvp.foodLabel': 'Essenswünsche / Allergien',
    'rsvp.foodOptional': '(optional)',
    'rsvp.foodPlaceholder': 'z.\u202fB. Laktoseintoleranz, Nussallergie \u2026',
    'rsvp.noAllergies': 'Keine bekannten Allergien oder Unvertr\u00e4glichkeiten',
    'rsvp.messageLabel': 'Nachricht an uns',
    'rsvp.messageOptional': '(optional)',
    'rsvp.messagePlaceholder': 'Ein paar liebe Worte f\u00fcr Florian & Sebastian \u2026',
    'rsvp.submit': 'Zusage absenden',
    'rsvp.sending': 'Wird gesendet\u2026',
    'rsvp.success.title': 'Vielen Dank!',
    'rsvp.success.line1': 'Eure Nachricht ist bei uns angekommen.',
    'rsvp.success.line2': 'Wir freuen uns sehr auf euch!',
    'rsvp.success.toGifts': 'Zur Wunschliste',
    'rsvp.success.waTitle': 'Eltern-WhatsApp-Gruppe',
    'rsvp.success.waDesc': 'Tritt der Gruppe bei, um euch mit anderen Eltern bei der Feier abzustimmen.',
    'rsvp.success.waBtn': 'WhatsApp-Gruppe beitreten',
    'wa.title': 'Eltern-WhatsApp-Gruppe',
    'wa.desc': 'Für alle Eltern, die sich bei der Feier absprechen möchten – tritt gerne der WhatsApp-Gruppe bei.',
    'wa.btn': 'Gruppe beitreten',
    'rsvp.err.name': 'Bitte gebt euren Namen ein.',
    'rsvp.err.attending': 'Bitte w\u00e4hlt aus, ob ihr kommt.',
    'rsvp.err.guests': 'Bitte gebt die Anzahl der Personen an.',
    'rsvp.err.generic': 'Etwas ist schiefgelaufen.',
    'rsvp.err.noconn': 'Keine Verbindung. Bitte versuche es erneut.',

    'gifts.title': 'Unsere Wunschliste',
    'gifts.subtitle1': 'Wenn ihr uns etwas schenken m\u00f6chtet, findet ihr hier unsere W\u00fcnsche.',
    'gifts.subtitle2': 'Klickt einfach auf das Geschenk, das ihr \u00fcbernehmt \u2013 damit wir keine Doppelungen haben.',
    'gifts.loading': 'Lade Geschenke\u2026',
    'gifts.claim': 'Ich schenke das!',
    'gifts.mine': '\u2713 Von euch reserviert',
    'gifts.undo': 'Aufheben',
    'gifts.taken': '\u2713 Bereits vergeben',
    'gifts.loadErr': 'Fehler beim Laden der Geschenke.',
    'gifts.empty': 'Noch keine W\u00fcnsche eingetragen.',
    'gifts.shopTitle': 'Im Shop ansehen',
    'gifts.modal.title': 'Geschenk reservieren?',
    'gifts.modal.hint': 'Das l\u00e4sst sich innerhalb dieser Sitzung noch r\u00fckg\u00e4ngig machen.',
    'gifts.modal.cancel': 'Abbrechen',
    'gifts.modal.confirm': 'Ja, ich schenke das!',
    'gifts.alert.claimed': 'Danke! Das Geschenk wurde f\u00fcr euch reserviert.',
    'gifts.alert.taken': 'Dieses Geschenk ist leider schon vergeben.',
    'gifts.alert.err': 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
    'gifts.alert.unclaimed': 'Reservierung aufgehoben.',
    'gifts.alert.unclaimErr': 'Aufheben nicht m\u00f6glich. Bitte versuche es erneut.',
  },
  en: {
    nav_rsvp: 'RSVP',
    nav_gifts: 'Wish List',
    nav_impressum: 'Imprint',
    footer: 'Florian & Sebastian \u2014 We look forward to celebrating with you!',

    'rsvp.title': 'Your RSVP',
    'rsvp.subtitle': 'Let us know if you can make it and anything we should keep in mind.',
    'rsvp.nameLabel': 'Your Name *',
    'rsvp.namePlaceholder': 'e.g. Anna & Max Smith',
    'rsvp.attendingLabel': 'Will you attend? *',
    'rsvp.yes': "Yes, we'll be there!",
    'rsvp.no': 'Unfortunately not',
    'rsvp.guestCount': 'Number of Guests *',
    'rsvp.childrenCount': 'Of which children under 3',
    'rsvp.vegetarian': 'We eat vegetarian',
    'rsvp.friday': 'We will already be there on Friday evening',
    'rsvp.fridayHint': '(optional \u2013 details to follow with the invitation)',
    'rsvp.foodLabel': 'Dietary requirements / Allergies',
    'rsvp.foodOptional': '(optional)',
    'rsvp.foodPlaceholder': 'e.g. lactose intolerance, nut allergy \u2026',
    'rsvp.noAllergies': 'No known allergies or intolerances',
    'rsvp.messageLabel': 'Message to us',
    'rsvp.messageOptional': '(optional)',
    'rsvp.messagePlaceholder': 'A few kind words for Florian & Sebastian \u2026',
    'rsvp.submit': 'Send RSVP',
    'rsvp.sending': 'Sending\u2026',
    'rsvp.success.title': 'Thank you!',
    'rsvp.success.line1': 'Your message has been received.',
    'rsvp.success.line2': 'We are so looking forward to seeing you!',
    'rsvp.success.toGifts': 'To the Wish List',
    'rsvp.success.waTitle': 'Parents WhatsApp Group',
    'rsvp.success.waDesc': 'Join the group to coordinate with other parents at the celebration.',
    'rsvp.success.waBtn': 'Join WhatsApp Group',
    'wa.title': 'Parents WhatsApp Group',
    'wa.desc': 'For all parents who want to coordinate at the celebration – feel free to join the WhatsApp group.',
    'wa.btn': 'Join Group',
    'rsvp.err.name': 'Please enter your name.',
    'rsvp.err.attending': 'Please select whether you will attend.',
    'rsvp.err.guests': 'Please enter the number of guests.',
    'rsvp.err.generic': 'Something went wrong.',
    'rsvp.err.noconn': 'No connection. Please try again.',

    'gifts.title': 'Our Wish List',
    'gifts.subtitle1': 'If you would like to give us a gift, you can find our wishes here.',
    'gifts.subtitle2': 'Simply click on the gift you would like to give \u2013 so we avoid duplicates.',
    'gifts.loading': 'Loading gifts\u2026',
    'gifts.claim': "I'll gift this!",
    'gifts.mine': '\u2713 Reserved by you',
    'gifts.undo': 'Undo',
    'gifts.taken': '\u2713 Already taken',
    'gifts.loadErr': 'Error loading gifts.',
    'gifts.empty': 'No wishes added yet.',
    'gifts.shopTitle': 'View in shop',
    'gifts.modal.title': 'Claim this gift?',
    'gifts.modal.hint': 'You can undo this within the current session.',
    'gifts.modal.cancel': 'Cancel',
    'gifts.modal.confirm': "Yes, I'll gift this!",
    'gifts.alert.claimed': 'Thank you! The gift has been reserved for you.',
    'gifts.alert.taken': 'Sorry, this gift has already been taken.',
    'gifts.alert.err': 'Something went wrong. Please try again.',
    'gifts.alert.unclaimed': 'Reservation cancelled.',
    'gifts.alert.unclaimErr': 'Could not undo. Please try again.',
  },
};

let currentLang = localStorage.getItem('lang') || 'de';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key] !== undefined) el.textContent = translations[lang][key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key] !== undefined) el.placeholder = translations[lang][key];
  });

  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.textContent = lang === 'de' ? 'EN' : 'DE';
    btn.setAttribute('aria-label', lang === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln');
  }

  if (typeof onLangChange === 'function') onLangChange(lang);
}

function toggleLang() { setLang(currentLang === 'de' ? 'en' : 'de'); }

function initLang() { setLang(currentLang); }
