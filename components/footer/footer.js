function createFooter(options = {}) {
    const defaults = {
        phoneNumber: '+38 063 012 3456',
        socialLinks: {
            instagram: 'https://www.instagram.com/',
            facebook: 'https://www.facebook.com/?locale=uk_UA',
            youtube: 'https://www.youtube.com/',
            twitter: 'https://x.com/'
        },
        currentYear: new Date().getFullYear()
    };
    
    const config = { ...defaults, ...options };
    
    return `
        <footer>
            <section class="footer">
                <div class="footer-logo">
                    <a href="./index.html">
                        <img src="./assets/images/logo/logoBg.jpg" alt="Skate Style Logo">
                    </a>
                </div>
                
                <div class="footer-pages">
                    <h3>Сторінки</h3>
                    <ul>
                        <li><a href="./index.html">Головна</a></li>
                        <li><a href="#" onclick="toggleCart(event)">Кошик</a></li>
                        <li><a href="./pages/category.html#type=women">Жіночий одяг</a></li>
                        <li><a href="./pages/category.html#type=men">Чоловічий одяг</a></li>
                        <li><a href="./pages/category.html#type=skates">Ковзани</a></li>
                        <li><a href="./pages/category.html#type=accessories">Аксесуари</a></li>
                        <li><a href="./pages/aboutUs.html">Про нас</a></li>
                        <li><a href="./pages/user/account.html">Акаунт</a></li>
                    </ul>
                </div>
                
                <div class="footer-links">
                    <h3>Корисні посилання</h3>
                    <ul>
                        <li><a href="https://www.moyo.ua/ua/news/kak_vybrat_konki_poshagovaya_instrukciya_dlya_novichkov.html?srsltid=AfmBOorCi7uyFH3OH75NK09st1eelKuFXNc5tp2CokqJEmZNsnhjN98M" target="_blank" rel="noopener">Гайд як обрати ковзани</a></li>
                        <li><a href="./pages/info/dimensionalGrid.html">Розмірна сітка</a></li>
                        <li><a href="./pages/info/return.html">Повернення замовлення</a></li>
                        <li><a href="./pages/info/delivery.html">Доставка</a></li>
                    </ul>
                </div>
                
                <div class="footer-social">
                    <h3>Соціальні мережі</h3>
                    <ul>
                        <li><a href="${config.socialLinks.instagram}" target="_blank" rel="noopener">Instagram</a></li>
                        <li><a href="${config.socialLinks.facebook}" target="_blank" rel="noopener">Facebook</a></li>
                        <li><a href="${config.socialLinks.youtube}" target="_blank" rel="noopener">YouTube</a></li>
                        <li><a href="${config.socialLinks.twitter}" target="_blank" rel="noopener">X (Twitter)</a></li>
                        <li><a href="tel:${config.phoneNumber.replace(/\s/g, '')}" id="phone-number">${config.phoneNumber}</a></li>
                    </ul>
                </div>
            </section>
            
            <div class="footer-bottom">
                <p>&copy; ${config.currentYear} Skate Style. Всі права захищені.</p>
            </div>
        </footer>
    `;
}

// Ініціалізація футера
function initFooter(options = {}) {
    const footerContainer = document.querySelector('[data-component="footer"]');
    if (footerContainer) {
        footerContainer.innerHTML = createFooter(options);
    }
}

// Експорт для використання в інших файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createFooter, initFooter, updateFooterContact };
}