# ---- Base PHP image ----
FROM php:8.2-fpm-alpine AS phpbase

# Install system deps + build tools for PHP extensions
RUN apk add --no-cache \
    bash curl git unzip \
    libpng libjpeg-turbo libwebp icu libzip postgresql-libs \
    $PHPIZE_DEPS \
    libpng-dev libjpeg-turbo-dev libwebp-dev icu-dev libzip-dev postgresql-dev oniguruma-dev

# PHP extensions commonly needed by Laravel + Postgres
RUN docker-php-ext-configure gd --with-jpeg --with-webp \
 && docker-php-ext-install -j$(nproc) \
    gd mbstring intl zip bcmath pdo pdo_pgsql opcache

# Composer (single binary)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_MEMORY_LIMIT=-1

WORKDIR /var/www/html

# ---- Dependencies stage (cache layer) ----
# Copy ONLY composer manifests first to leverage caching
FROM phpbase AS deps
WORKDIR /var/www/html
COPY composer.json composer.lock ./
# If you use private repos, configure auth.json before this step

# Install PHP dependencies without scripts for safer build
RUN composer install \
    --no-dev --no-interaction --prefer-dist --no-ansi --no-progress --no-scripts

# ---- App stage ----
FROM phpbase AS app
WORKDIR /var/www/html

# Copy vendor from deps layer
COPY --from=deps /var/www/html/vendor ./vendor

# Now copy the rest of your app
COPY . .

# (Optional) Optimize autoload for prod
RUN composer dump-autoload --optimize --no-dev --no-interaction

# Don’t run artisan commands at build time (they may need .env/DB)
# Expose FPM port
EXPOSE 9000

# php-fpm is the default CMD in this base image
