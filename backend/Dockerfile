FROM php:8.2-fpm-alpine
RUN apk add --no-cache icu-dev libxml2-dev oniguruma-dev bash zip unzip sqlite
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite intl

WORKDIR /var/www/html
COPY --chown=www-data:www-data . /var/www/html

# install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

RUN php artisan config:cache || true
RUN php artisan route:cache || true

EXPOSE 9000
CMD ["php-fpm"]
