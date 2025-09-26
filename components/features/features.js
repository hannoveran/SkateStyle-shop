function createFeatures(options = {}) {
    const defaults = {
        features: [
            {
                image: './assets/images/features/iceSkate.png',
                alt: 'Ковзани',
                title: 'Професійні ковзани',
                description: 'Якісні ковзани для спортсменів будь-якого <br> рівня – від початківців до професіоналів.'
            },
            {
                image: './assets/images/features/sewing.png',
                alt: 'Шиття',
                title: 'Індивідуальне пошиття',
                description: 'Створюємо костюми для виступів, що <br> поєднують стиль, комфорт і функціональність.'
            },
            {
                image: './assets/images/features/fabric.png',
                alt: 'Тканини',
                title: 'Ексклюзивні тканини',
                description: 'Високоякісні матеріали для створення костюмів, <br> що забезпечують ідеальну посадку та свободу рухів.'
            }
        ]
    };
    
    const config = { ...defaults, ...options };
    
    const featuresHTML = config.features.map(feature => `
        <div>
            <img src="${feature.image}" alt="${feature.alt}">
            <h4>${feature.title}</h4>
            <p>${feature.description}</p>
        </div>
    `).join('');
    
    return `
        <section class="features">
            ${featuresHTML}
        </section>
    `;
}

// Ініціалізація features
function initFeatures(options = {}) {
    const featuresContainer = document.querySelector('[data-component="features"]');
    if (featuresContainer) {
        featuresContainer.outerHTML = createFeatures(options);
    }
}

// Експорт для використання в інших файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createFeatures, initFeatures };
}