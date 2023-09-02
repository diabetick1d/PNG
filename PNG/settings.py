from pathlib import Path
import os


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-9f@#6fi91hv^@8)87!*b+9aj2)8p=$mf*=yv2v+0*8n&u7stqq'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

DOMEN                 = "*" # БЕЗ https
CORS_ORIGIN_WHITELIST = CSRF_TRUSTED_ORIGINS = [f'https://{DOMEN}', 'https://127.0.0.1'] 
ALLOWED_HOSTS   = ['127.0.0.1',DOMEN] # '127.0.0.1','diabetick1d.pythonanywhere.com'    , "*"

# Адрес сайта для телеграмм бота
SITE_URL        = f'https://{DOMEN}'
# Модель для авторизации пользователей
AUTH_USER_MODEL                 = 'telegram_app.user'
SESSION_COOKIE_AGE              = 30 * 24 * 60 * 60 # 30 дней жизни сессии
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_json_widget',

    'eav',
    'colorfield',

    'main',
    'telegram_app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]

ROOT_URLCONF = 'PNG.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

                'django.template.context_processors.media', # Добавленно
            ],
        'libraries':{
            'utils_tags': 'main.templates.templatestags.utils_tags',
            
            }
        },
    },
]

WSGI_APPLICATION = 'PNG.wsgi.application'

# CACHES = { # python manage.py createcachetable - создание кэш бд
#     'default': {
#         'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
#         'LOCATION': 'my_cache_table',
#         'TIMEOUT': 60*60*24,  # время жизни кэша истории поисковых запросов в секундах
#         'OPTIONS': {
#             'MAX_ENTRIES': 100  # максимальное количество элементов, которые можно хранить в кэше
#         }
#     }
# }

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'PNGdb.sqlite3',
    }
    # 'default': {
    #     'ENGINE': 'django.db.backends.postgresql',
    #     'NAME': "PNGdb",
    #     'USER': 'superadmin',
    #     'PASSWORD': '0912ioioQ',
    #     'HOST': 'localhost',
    #     'PORT': '',
    # }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTHENTICATION_BACKENDS = [
    'main.auth_backends.CustomUserModelBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'ru'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# SECURE CROSS ORIGIN POLICY
SECURE_CROSS_ORIGIN_OPENER_POLICY = 'same-origin-allow-popups'

# TELEGRAM BOT 
TELEGRAM_BOT_NAME           = 'pngshop_bot'
TELEGRAM_BOT_TOKEN          = '6117147348:AAHyAgh6ScljuHkoLhkDypvfsTd0-bu8oqM'

TELEGRAM_APP_ID             = "20834462"
TELEGRAM_APP_HASH           = "88215fd58c36d57e7e018c261b1f535b"
