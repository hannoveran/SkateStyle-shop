function createFeaturesWrap(options = {}) {
    const defaults = {
        features: [
            {
                image: '/assets/images/features-wrap/box.png',
                alt: 'Гарантія якості',
                title: 'Гарантія якості',
                description: 'Кожен товар проходить ретельну <br> перевірку перед відправкою.'
            },
            {
                image: '/assets/images/features-wrap/deliveryTruck.png',
                alt: 'Безкоштовна доставка',
                title: 'Безкоштовна доставка',
                description: 'Ми доставимо ваше замовлення <br> безкоштовно при покупці 10.000.'
            },
            {
                image: '/assets/images/features-wrap/prepayment.png',
                alt: 'Зручна оплата',
                title: 'Зручна оплата',
                description: 'Приймаємо оплату картками, <br> онлайн-платежами та післяплатою.'
            },
            {
                image: '/assets/images/features-wrap/exchange.png',
                alt: 'Легке повернення',
                title: 'Легке повернення',
                description: 'Можливість повернення або обміну <br> товару протягом 14 днів.'
            }
        ]
    };
    
    const config = { ...defaults, ...options };
    
    const featuresHTML = config.features.map(feature => `
        <div class="features-wrap-box">
            <img src="${feature.image}" alt="${feature.alt}">
            <div class="features-wrap-box-text">
                <h4>${feature.title}</h4>
                <p>${feature.description}</p>
            </div>
        </div>
    `).join('');
    
    return `
        <section class="features-wrap">
            ${featuresHTML}
        </section>
    `;
}

// Ініціалізація features-wrap
function initFeaturesWrap(options = {}) {
    const featuresWrapContainer = document.querySelector('[data-component="features-wrap"]');
    if (featuresWrapContainer) {
        featuresWrapContainer.outerHTML = createFeaturesWrap(options);
    }
}

// Експорт для використання в інших файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createFeaturesWrap, initFeaturesWrap };
}