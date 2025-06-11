export const MESSAGES = {
  ru: {
    registration: {
      welcome:
        '👋 Добро пожаловать!\n\nЯ помогу тебе найти команду для разработки приложений! Давай проёдем регистрацию.',
      enterName: 'Как тебя зовут?',
      invalidName:
        'Никнейм должен быть до 30 символов, без HTML и переносов строк.',
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
      invalidDescription:
        'Описание должно быть до 300 символов и без HTML-тегов.',
      descriptionTooLong:
        'Описание превышает максимальное количество символов(300).Отправь описание заново.'
    },
    profile: (
      name: string,
      city: string,
      description: string,
      role: string
    ) => {
      return `<b>${name}</b>\n\n<b>Роль</b>: ${role}\n\n<b>Город</b>: ${city}\n\n<b>О себе</b>: ${description}`
    },
    main: 'Выбирай, с чего начнём 💡\n\n1. Смотреть анкеты.\n2. Мой профиль\n3. Хакатоны',
    profileOptions:
      '1. Заполнить заново\n2. Изменить фото\n3. Изменить описание\n4. Вернуться',
    newDescription: 'Отправте новое описание:',
    backToProfile: 'Вернуться к профилю',
    newPhoto: 'Отправте новое фото:',
    messageSend: 'Сообщение отправлено!',
    like: (senderName: string) => {
      return `Вас лайкнул ${senderName}!`
    },
    sympathy: (nickname: string, username: string) => {
      return `💌 Симпатия подтверждена\n\n${nickname} уведомлён(а).\nВот его(её) контакт: @${username} Удачи в разговоре!`
    }
  },
  en: {
    registration: {
      welcome:
        "👋 Welcome!\n\nI will help you find a team for developing applications! Let's go through registration.",
      enterName: 'How do you call yourself?',
      invalidName:
        'Nickname must be up to 30 characters, without HTML or line breaks.',
      enterCity: 'Enter your city:',
      enterDescription: 'Tell about yourself:',
      sendPhoto: 'Send your photo:',
      previousPhoto:
        'Looks like you`ve already uploaded a profile photo.\nWant to use it again?(or send new one)',
      photoMaxSize: 'Reached max size photo 5 MB.',
      choseRole: 'Choose a role:',
      aproval: 'Your profile will look like this. Are you sure? :',
      invalidDescription:
        'Description must be up to 300 characters and without HTML tags.',
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
    main: 'Ready to dive in? Choose where to begin! 💡\n\n1. View profiles\n2. My profile\n3. Hackathons',
    profileOptions:
      '1. Fill out again\n2. Change photo\n3. Change description.\n4. Back.',
    newDescription: 'Send new description:',
    backToProfile: 'Back to profile',
    newPhoto: 'Send new photo:',
    messageSend: 'Message sent!',
    like: (senderName: string) => {
      return `you were liked by ${senderName}!`
    },
    sympathy: (nickname: string, username: string) => {
      return `💌 Mutual like confirmed!\n\n${nickname} has been notified.\nIt is his(her) contact: @${username} Good luck chatting!`
    }
  }
} as const
