import fs from 'fs';
import { fileURLToPath } from 'url';
import pathModule from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

const indexHtmlPath = pathModule.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Helper to replace precisely
const tryReplace = (from, to) => {
  if (indexHtml.includes(from)) {
    indexHtml = indexHtml.replace(from, to);
    console.log(`Replaced: ${from.substring(0, 40).replace(/\r?\n/g, ' ')}...`);
  } else {
    console.warn(`WARNING: Pattern not found: ${from.substring(0, 40).replace(/\r?\n/g, ' ')}...`);
  }
};

// 1. Sidebar Nav
tryReplace('<li><a href="#hero" class="menu-link active">Главная</a></li>', '<li><a href="#hero" class="menu-link active" data-i18n="nav.hero">Главная</a></li>');
tryReplace('<li><a href="#rooms" class="menu-link">Номера</a></li>', '<li><a href="#rooms" class="menu-link" data-i18n="nav.rooms">Номера</a></li>');
tryReplace('<li><a href="#pool" class="menu-link">Бассейн и Летняя зона</a></li>', '<li><a href="#pool" class="menu-link" data-i18n="nav.pool">Бассейн и Летняя зона</a></li>');
tryReplace('<li><a href="#restaurant" class="menu-link">Ресторан</a></li>', '<li><a href="#restaurant" class="menu-link" data-i18n="nav.restaurant">Ресторан</a></li>');
tryReplace('<li><a href="#atmosphere" class="menu-link">Атмосфера</a></li>', '<li><a href="#atmosphere" class="menu-link" data-i18n="nav.atmosphere">Атмосфера</a></li>');
tryReplace('<li><a href="#contacts" class="menu-link">Контакты</a></li>', '<li><a href="#contacts" class="menu-link" data-i18n="nav.contacts">Контакты</a></li>');
tryReplace('<li class="action-stock"><a href="https://redling-hotel.com.ua/action/" target="_blank">★ АКЦИИ ★</a></li>', '<li class="action-stock"><a href="https://redling-hotel.com.ua/action/" target="_blank" data-i18n="nav.offers">★ АКЦИИ ★</a></li>');

// 2. Lang switcher using regex to ignore newline difference
const newLangBlock = `<div class="sidebar-lang">
        <button class="lang-link" data-lang="en">en</button>
        <button class="lang-link active" data-lang="ru">ru</button>
        <button class="lang-link" data-lang="ua">ua</button>
      </div>`;
indexHtml = indexHtml.replace(/<div class="sidebar-lang">[\s\S]*?<\/div>/, newLangBlock);
console.log('Replaced lang switcher block.');

// 3. Credits
tryReplace('<div class="creator-credits"><span>Создание сайта</span> — Nextweb</div>', '<div class="creator-credits"><span data-i18n="credits.text">Создание сайта</span> — Nextweb</div>');

// 4. Hero Screen
tryReplace('<span class="sub-title-large">ваш уютный дом у моря в Одессе</span>', '<span class="sub-title-large" data-i18n="hero.subtitle">ваш уютный дом у моря в Одессе</span>');
tryReplace('<p class="hero-subhead">Премиальный комфорт для семейного отдыха и деловых поездок.</p>', '<p class="hero-subhead" data-i18n="hero.subhead">Премиальный комфорт для семейного отдыха и деловых поездок.</p>');
tryReplace('<p class="hero-text">Всего 500 метров до пляжа, вдали от городского шума.</p>', '<p class="hero-text" data-i18n="hero.text">Всего 500 метров до пляжа, вдали от городского шума.</p>');
tryReplace('<a href="https://redling-hotel.com.ua/booking/" target="_blank" class="btn-cta">Забронировать номер</a>', '<a href="https://redling-hotel.com.ua/booking/" target="_blank" class="btn-cta" data-i18n="hero.cta">Забронировать номер</a>');
tryReplace('Смотреть видео', '<span data-i18n="hero.video">Смотреть видео</span>');

// 5. Rooms Screen
tryReplace('<p class="section-subtitle">★ Дизайнерские номера с премиальным комфортом</p>', '<p class="section-subtitle" data-i18n="rooms.subtitle">★ Дизайнерские номера с премиальным комфортом</p>');
tryReplace('<h2 class="section-title">Пространство для идеального отдыха</h2>', '<h2 class="section-title" data-i18n="rooms.title">Пространство для идеального отдыха</h2>');
tryReplace('<p class="section-text">Просторные дизайнерские номера с премиальной шумоизоляцией и ортопедическими матрасами. Здесь есть всё для глубокого сна после пляжа или продуктивной работы в тишине.</p>', '<p class="section-text" data-i18n="rooms.text">Просторные дизайнерские номера с премиальной шумоизоляцией и ортопедическими матрасами. Здесь есть всё для глубокого сна после пляжа или продуктивной работы в тишине.</p>');
tryReplace('<a href="https://redling-hotel.com.ua/rooms/" target="_blank" class="btn-cta">Выбрать номер</a>', '<a href="https://redling-hotel.com.ua/rooms/" target="_blank" class="btn-cta" data-i18n="rooms.cta">Выбрать номер</a>');
tryReplace('<span>Шумоизоляция</span>', '<span data-i18n="rooms.benefit1">Шумоизоляция</span>');
tryReplace('<span>Матрасы</span>', '<span data-i18n="rooms.benefit2">Матрасы</span>');
tryReplace('<span>Wi-Fi</span>', '<span data-i18n="rooms.benefit3">Wi-Fi</span>');
tryReplace('<span>Мини-бар</span>', '<span data-i18n="rooms.benefit4">Мини-бар</span>');

// 6. Pool Screen
tryReplace('<p class="section-subtitle">★ Бассейн и Летняя зона</p>', '<p class="section-subtitle" data-i18n="pool.subtitle">★ Бассейн и Летняя зона</p>');
tryReplace('<h2 class="section-title">Освежающий<br>летний вайб</h2>', '<h2 class="section-title" data-i18n="pool.title">Освежающий<br>летний вайб</h2>');
tryReplace('<p class="section-text">Огромный открытый бассейн (80 м²) с лаунж-зоной и удобными шезлонгами. Идеальное место, чтобы поймать ленивое курортное настроение, не покидая территорию отеля.</p>', '<p class="section-text" data-i18n="pool.text">Огромный открытый бассейн (80 м²) с лаунж-зоной и удобными шезлонгами. Идеальное место, чтобы поймать ленивое курортное настроение, не покидая территорию отеля.</p>');
tryReplace('<span>80 м² бассейн</span>', '<span data-i18n="pool.benefit1">80 м² бассейн</span>');
tryReplace('<span>Лаунж-бар</span>', '<span data-i18n="pool.benefit2">Лаунж-бар</span>');
tryReplace('<span>Шезлонги</span>', '<span data-i18n="pool.benefit3">Шезлонги</span>');

// 7. Restaurant Screen
tryReplace('<p class="section-subtitle">★ Ресторан Redling</p>', '<p class="section-subtitle" data-i18n="restaurant.subtitle">★ Ресторан Redling</p>');
tryReplace('<h2 class="section-title">Гастрономическая<br>Одесса</h2>', '<h2 class="section-title" data-i18n="restaurant.title">Гастрономическая<br>Одесса</h2>');
tryReplace('<p class="section-text">Авторское прочтение черноморской и европейской кухни в стильном классическом интерьере. Лаундж-зона для неторопливых ужинов и раздельные залы для курящих и некурящих.</p>', '<p class="section-text" data-i18n="restaurant.text">Авторское прочтение черноморской и европейской кухни в стильном классическом интерьере. Лаундж-зона для неторопливых ужинов и раздельные залы для курящих и некурящих.</p>');
tryReplace('<a href="https://redling-hotel.com.ua/restaurant/" target="_blank" class="btn-cta">Забронировать столик</a>', '<a href="https://redling-hotel.com.ua/restaurant/" target="_blank" class="btn-cta" data-i18n="restaurant.cta">Забронировать столик</a>');
tryReplace('<a href="https://redling-hotel.com.ua/restaurant/#menu" target="_blank" class="btn-secondary">Меню ресторана</a>', '<a href="https://redling-hotel.com.ua/restaurant/#menu" target="_blank" class="btn-secondary" data-i18n="restaurant.menu">Меню ресторана</a>');
tryReplace('<span class="work-hours-label">Будни:</span>', '<span class="work-hours-label" data-i18n="restaurant.weekdays">Будни:</span>');
tryReplace('<span class="work-hours-label">Выходные:</span>', '<span class="work-hours-label" data-i18n="restaurant.weekends">Выходные:</span>');

// 8. Atmosphere Screen
tryReplace('<p class="section-subtitle">★ Об отеле</p>', '<p class="section-subtitle" data-i18n="atmosphere.subtitle">★ Об отеле</p>');
tryReplace('<h2 class="section-title">Атмосфера, в которую<br>хочется возвращаться</h2>', '<h2 class="section-title" data-i18n="atmosphere.title">Атмосфера, в которую<br>хочется возвращаться</h2>');
tryReplace('<p class="section-text">Redling — это сочетание искреннего одесского гостеприимства и европейского сервиса. Мы создали пространство, где вы чувствуете себя абсолютно свободно, окруженные заботой нашей команды 24/7.</p>', '<p class="section-text" data-i18n="atmosphere.text">Redling — это сочетание искреннего одесского гостеприимства и европейского сервиса. Мы создали пространство, где вы чувствуете себя абсолютно свободно, окруженные заботой нашей команды 24/7.</p>');

// 9. Contacts Screen
tryReplace('<p class="section-subtitle">★ Локация и Контакты</p>', '<p class="section-subtitle" data-i18n="contacts.subtitle">★ Локация и Контакты</p>');
tryReplace('<h2 class="section-title">Ждем вас<br>в Redling</h2>', '<h2 class="section-title" data-i18n="contacts.title">Ждем вас<br>в Redling</h2>');
tryReplace('<span class="fact-label">500 метров до моря — 7 минут пешком</span>', '<span class="fact-label" data-i18n="contacts.fact1">500 метров до моря — 7 минут пешком</span>');
tryReplace('<span class="fact-label">ул. Дача Ковалевского, 71, Одесса</span>', '<span class="fact-label" data-i18n="contacts.fact2">ул. Дача Ковалевского, 71, Одесса</span>');
tryReplace('<span class="fact-label">10 км до центра — тихий, зелёный район</span>', '<span class="fact-label" data-i18n="contacts.fact3">10 км до центра — тихий, зелёный район</span>');
tryReplace('<span class="contact-name">Ресепшен</span>', '<span class="contact-name" data-i18n="contacts.reception">Ресепшен</span>');
tryReplace('<span class="contact-name">Ресторан</span>', '<span class="contact-name" data-i18n="contacts.restaurant">Ресторан</span>');
tryReplace('<span class="contact-name">Email</span>', '<span class="contact-name" data-i18n="contacts.email">Email</span>');
tryReplace('<a href="https://maps.google.com/?q=ул.+Дача+Ковалевского+71+Одесса" target="_blank" class="btn-cta">Построить маршрут</a>', '<a href="https://maps.google.com/?q=ул.+Дача+Ковалевского+71+Одесса" target="_blank" class="btn-cta" data-i18n="contacts.route">Построить маршрут</a>');

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('index.html successfully updated with i18n placeholders.');
