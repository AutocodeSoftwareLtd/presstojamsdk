import { createI18n as create } from 'vue-i18n'

let i18n;

export function createI18n(options) {


    const dateTimeFormats = {
        'en': {
            short: {
              year: 'numeric',
              day: 'numeric',
              month: 'short',
              timeZone :'GMT'
            },
            long: {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
              hour: 'numeric',
              minute: 'numeric',
              timeZone :'GMT'
            }
          }
    }

    let messages = (options.i18n && options.i18n.messages) ? options.i18n.messages : {};


    i18n = create({
        locale: 'en',
        messages,
        silentTranslationWarn: true,
        legacy : false,
        dateTimeFormats
    });

    return i18n;
}

export function useI18n() {
    return i18n;
}

export function t(key) {
  return i18n.global.t(key);
}

export function te(key) {
  return i18n.global.te(key);
}