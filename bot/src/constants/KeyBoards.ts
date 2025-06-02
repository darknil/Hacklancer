export const KEYBOARDS = {
  ru: {
    registration: {
      aproval: {
        yes: 'Да, Давай искать команду!',
        no: 'Нет, я хочу использовать другие данные',
        keyboard: [
          [
            { text: 'Да, Давай искать команду!' },
            { text: 'Нет, я хочу использовать другие данные' }
          ]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      },
      usePhoto: {
        yes: 'Да, использовать прошлое фото',
        keyboard: [[{ text: 'Да, использовать прошлое фото' }]]
      }
    }
  },
  en: {
    registration: {
      aproval: {
        yes: 'Yes, lets find a team!',
        no: 'No, I want to use other data',
        keyboard: [
          [
            { text: 'Yes, lets find a team!' },
            { text: 'No, I want to use other data' }
          ]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      },
      usePhoto: {
        yes: 'Yes, use previous photo!',
        keyboard: [[{ text: 'Yes, use previous photo!' }]]
      }
    }
  },
  main: {
    matching: '1',
    myProfile: '2',
    hackathons: '3',
    keyboard: [[{ text: '1' }, { text: '2' }, { text: '3' }]]
  }
}
