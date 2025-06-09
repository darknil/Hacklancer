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
    },
    liked: (senderId: number) => {
      return {
        inline_keyboard: [
          [
            { text: 'Ответить', callback_data: `response:${senderId}` },
            { text: 'Проигнорировать', callback_data: `ignore:${senderId}` }
          ]
        ]
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
    },
    liked: (senderId: number) => {
      return {
        inline_keyboard: [
          [
            { text: 'Answer', callback_data: `response:${senderId}` },
            { text: 'Ignore', callback_data: `ignore:${senderId}` }
          ]
        ]
      }
    }
  },
  main: {
    matching: '1',
    myProfile: '2',
    hackathons: '3',
    keyboard: [[{ text: '1' }, { text: '2' }, { text: '3' }]]
  },
  swiping: {
    like: '❤️',
    next: '➡️',
    settings: '⚙️',
    home: '🏠',
    keyboard: [
      [{ text: '❤️' }, { text: '➡️' }],
      [{ text: '⚙️' }, { text: '🏠' }]
    ]
  },
  profile: {
    awaitingAction: {
      fillOutAgain: '1',
      changePhoto: '2',
      changeDescription: '3',
      home: '🏠',
      keyboard: [[{ text: '1' }, { text: '2' }, { text: '3' }, { text: '🏠' }]]
    }
  }
}
