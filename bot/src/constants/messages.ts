export const MESSAGES = {
  ru: {
    registration: {
      welcome:
        'Добро пожаловать! Я помогу тебе найти команду для разработки приложений! Давай проёдем регистрацию.',
      enterName: 'Пожалуйста, отправьте своё имя текстом.',
      enterCity: 'Введите ваш город:',
      enterDescription: 'Расскажите о себе:',
      sendPhoto: 'Отправьте свою фотографию:',
      photoMaxSize: 'Превышем максимальный размер фотографии 5 МБ.',
      registered: (
        name: string | undefined,
        city: string | undefined,
        description: string | undefined
      ) =>
        `Вы успешно зарегистрированы! \nВаше имя: ${name || ''},\nгород: ${
          city || ''
        },\nо себе: ${description || ''}`,
      choseRole: 'Выберите роль:'
    }
  },
  en: {
    registration: {
      welcome:
        "Welcome! I will help you find a team for developing applications! Let's go through registration.",
      enterName: 'Please send your name as text.',
      enterCity: 'Enter your city:',
      enterDescription: 'Tell about yourself:',
      sendPhoto: 'Send your photo:',
      photoMaxSize: 'Reached max size photo 5 MB.',
      registered: (
        name: string | undefined,
        city: string | undefined,
        description: string | undefined
      ) =>
        `You have successfully registered!\nYour name: ${name || ''},\nCity: ${
          city || ''
        },\nAbout: ${description || ''}`,
      choseRole: 'Choose a role:'
    }
  }
} as const
