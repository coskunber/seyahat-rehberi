let travelData = {};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('data.json');
        travelData = await response.json();
    } catch (error) {
        console.error("Veri çekilemedi:", error);
    }
});

function generateGuide() {
    const cityKey = document.getElementById('citySelect').value;
    const days = parseInt(document.getElementById('days').value);
    const adults = parseInt(document.getElementById('adults').value);
    // Yeni yapıda çocuk sayısını kaldırıp sadeleştirdik, istersen ekleyebilirsin
    const budgetProfile = document.getElementById('budgetSelect').value;

    if (!travelData[cityKey]) return alert("Veri bulunamadı!");

    const data = travelData[cityKey];
    const dailyCostPerPerson = data.dailyBudget[budgetProfile];
    const totalEstimated = Math.round(dailyCostPerPerson * adults * days);
    const currSymbol = data.currency.includes('EUR') ? '€' : '€ (Karşılığı)';

    // Alt Modülleri Render Etme Fonksiyonları
    const renderList = (items, isScam = false) => items.map(item => `
        <div class="list-item ${isScam ? 'scam-item' : ''}">
            ${item.name ? `<strong>${item.name}</strong>${item.desc || (item.duration + ' | ' + item.price)}` : item}
        </div>
    `).join('');

    const resultArea = document.getElementById('resultArea');
    
    // Dashboard HTML İnşası
    resultArea.innerHTML = `
        <!-- Bütçe Hero Kartı -->
        <div class="card budget-card">
            <p>Hedef: <strong>${data.city}, ${data.country}</strong></p>
            <h2>~${totalEstimated} ${currSymbol}</h2>
            <p>${adults} Yetişkin için ${days} günlük ${budgetProfile} bütçe tahmini.</p>
        </div>

        <!-- Hızlı Bilgiler Kartı -->
        <div class="card quick-facts">
            <div class="fact-item">💵 <span>${data.currency}</span></div>
            <div class="fact-item">${data.visa}</div>
            <div class="fact-item">${data.best_time}</div>
            <div class="fact-item">${data.plug}</div>
            <div class="fact-item">${data.emergency}</div>
        </div>

        <!-- Türk Gezginler İçin Altın Taktik -->
        <div class="card tips-card">
            <div class="card-title">🇹🇷 Türk Gezginler İçin Taktikler</div>
            <p>${data.tr_tips}</p>
        </div>

        <!-- Ulaşım & İnternet -->
        <div class="card module-card">
            <div class="card-title">🚇 Ulaşım & İletişim</div>
            <div class="list-item" style="background:#E0F2FE; border-color:#0284C7;">
                <strong>📱 İnternet / Hat</strong>
                ${data.internet}
            </div>
            ${renderList(data.transport)}
        </div>

        <!-- Yemek & Lezzetler -->
        <div class="card module-card">
            <div class="card-title">🍽️ Neler Yemeli?</div>
            ${renderList(data.food)}
        </div>

        <!-- Gezilecek Yerler -->
        <div class="card module-card">
            <div class="card-title">📍 Mutlaka Gör</div>
            ${renderList(data.attractions)}
        </div>

        <!-- Tuzaklar & Dikkat Edilecekler (Tam Genişlik) -->
        <div class="card module-card" style="grid-column: 1 / -1;">
            <div class="card-title" style="color: #EF4444;">🚨 Turist Tuzakları (Scams)</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
                ${renderList(data.scams, true)}
            </div>
        </div>
    `;

    document.getElementById('welcomeState').classList.add('hidden');
    resultArea.classList.remove('hidden');
}
