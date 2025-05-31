export const MESSAGES = {
  ru: {
    registration: {
      welcome:
        '👋 Добро пожаловать!\n\nЯ помогу тебе найти команду для разработки приложений! Давай проёдем регистрацию.',
      enterName: 'Как тебя зовут? :',
      enterCity: 'Укажи город:',
      enterDescription: 'Расскажи о себе:',
      sendPhoto: 'Отправь свою фотографию:',
      previousPhoto:
        'Похоже, ты уже загружал фотографию профиля.\nХочешь использовать ее снова?(или отправь новое изображение)',
      photoMaxSize: 'Превышем максимальный размер фотографии 5 МБ.',
      choseRole: 'Выбери роль:',
      aproval: 'Твой профиль будет выглядеть так. Вы уверены? :',
      nameTooLong:
        'Имя превышает максимальное количество символов(20).Отправь имя заново.',
      cityTolong:
        'Название города превышает максимальное количество символов(10).Отправь название заново.',
      descriptionTooLong:
        'Описание превышает максимальное количество символов(300).Отправь описание заново.'
    },
    profile: (
      name: string,
      city: string,
      description: string,
      role: string
    ) => {
      return `<b>${name}</b>\n\n<b>Роль</b>: ${role}\n\n<b>Город</b>: ${city}\n\n<b>О себе</b>:${description}`
    },
    main: 'Выбирай, с чего начнём 💡\n\n1.Смотреть анекты.\n2.Мой профиль\n3.Хакатоны'
  },
  en: {
    registration: {
      welcome:
        "👋 Welcome!\n\nI will help you find a team for developing applications! Let's go through registration.",
      enterName: 'How do you call yourself? :',
      enterCity: 'Enter your city:',
      enterDescription: 'Tell about yourself:',
      sendPhoto: 'Send your photo:',
      previousPhoto:
        'Looks like you`ve already uploaded a profile photo.\nWant to use it again?(or send new one)',
      photoMaxSize: 'Reached max size photo 5 MB.',
      choseRole: 'Choose a role:',
      aproval: 'Your profile will look like this. Are you sure? :',
      descriptionTooLong:
        'Description exceeds maximum characters(300). Try again.'
    },
    profile: (
      name: string,
      city: string,
      description: string,
      role: string
    ) => {
      return `<b>${name}</b>\n\n<b>Role</b>: ${role}\n\n<b>City</b>: ${city}\n\n<b>About</b>: ${description}`
    },
    main: 'Ready to dive in? Choose where to begin! 💡\n\n1.View profiles.\n2.My profile\n3.Hackathons'
  }
} as const
