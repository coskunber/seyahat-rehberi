let travelData = {};

// Sayfa yüklendiğinde JSON verisini bir kez çekiyoruz
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
    const children = parseInt(document.getElementById('children').value);
    const budgetProfile = document.getElementById('budgetSelect').value;

    if (!travelData[cityKey]) {
        alert("Bu şehir için henüz veri yok!");
        return;
    }

    const data = travelData[cityKey];
    const totalPeople = adults + (children * 0.5); // Çocuklar %50 harcar varsayımı
    
    // Bütçe Hesaplama
    const dailyCostPerPerson = data.dailyBudget[budgetProfile];
    const totalEstimated = Math.round(dailyCostPerPerson * totalPeople * days);

    // Gezilecek Yerleri HTML'e çevir
    const attractionsHTML = data.attractions.map(place => `
        <li>
            <strong>📍 ${place.name}</strong>
            <span>⏱️ ${place.duration} | 💰 ${place.price}</span>
        </li>
    `).join('');

    // Tuzakları HTML'e çevir
    const scamsHTML = data.scams.map(scam => `
        <li><strong>🚨 Dikkat:</strong> ${scam}</li>
    `).join('');

    // Sonuç alanını oluştur
    const resultArea = document.getElementById('resultArea');
    resultArea.innerHTML = `
        <div class="result-card">
            <div class="budget-hero">
                <span>${data.city}, ${data.country} Bütçen</span>
                <h2>~${totalEstimated} ${data.currency.includes('EUR') ? '€' : '€ (Karşılığı)'}</h2>
                <p style="font-size:13px; opacity:0.9;">${adults} Yetişkin, ${children} Çocuk için ${days} günlük tahmin.</p>
            </div>

            <div class="info-grid">
                <div class="info-box">${data.visa}</div>
                <div class="info-box">${data.payment}</div>
                <div class="info-box" style="grid-column: 1 / -1;">💵 <strong>Para Birimi:</strong> ${data.currency}</div>
            </div>

            <div class="tr-tips">
                <strong>🇹🇷 Türk Gezginler İçin Not:</strong><br>
                ${data.tr_tips}
            </div>

            <h3 class="section-title">🎒 Mutlaka Görülmesi Gerekenler</h3>
            <ul class="list-group">
                ${attractionsHTML}
            </ul>

            <h3 class="section-title" style="color:var(--danger)">⚠️ Turist Tuzakları & Taktikler</h3>
            <ul class="list-group scam-list">
                ${scamsHTML}
            </ul>
        </div>
    `;

    // Gizli olan sonuç alanını görünür yap
    resultArea.classList.remove('hidden');
    
    // Kullanıcıyı sonuçlara kaydır
    resultArea.scrollIntoView({ behavior: 'smooth' });
}