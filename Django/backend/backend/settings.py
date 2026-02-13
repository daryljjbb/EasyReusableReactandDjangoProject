import os
from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

# --- 1. SECURITY SETTINGS ---
SECRET_KEY = 'django-insecure-your-key-here' # Keep this secret in production!
DEBUG = True  # Set to False when you finally go live

# Add '*' to allow any host to access your backend while testing
# 1. Allow the backend to run on Render's servers
ALLOWED_HOSTS = [ 'easyreusablereactanddjangoproject.onrender.com', 'localhost', '127.0.0.1','.onrender.com']

# 2. Allow your GitHub Pages site to talk to this backend
CORS_ALLOWED_ORIGINS = [
    "https://daryljjbb.github.io", # Your GitHub site
    "http://localhost:3000",           # Still keep local for testing
    "http://127.0.0.1:3000",
]

# For modern Django security, also add this:
CSRF_TRUSTED_ORIGINS = [
    "https://easyreusablereactanddjangoproject.onrender.com",
    "https://daryljjbb.github.io",
]


# --- 2. APPS ---
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Required for React & API
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt', 
    
    # Your App
    'my_app', 
]


# --- 3. MIDDLEWARE ---
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    
    'corsheaders.middleware.CorsMiddleware', # MUST be here
    'django.middleware.common.CommonMiddleware',
    
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

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
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# --- 4. DATABASE ---
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# --- 5. CORS SETTINGS (Crucial for React) ---
# This allows your React frontend to talk to this Django backend
CORS_ALLOW_ALL_ORIGINS = True # Set to True for easy development
CORS_ALLOW_CREDENTIALS = True


# --- 6. REST FRAMEWORK & JWT ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# Optional: You can customize how long the login lasts here
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}


# --- 7. STATIC FILES ---
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') # Needed for deployment (GitHub/Render)

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'