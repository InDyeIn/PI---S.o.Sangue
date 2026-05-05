// Configuração inicial do mapa
let map;
const defaultLocation = [-22.8205, -47.2669]; // Região de Sumaré/Campinas como padrão

// Base de dados expandida de hospitais/locais de coleta
const hospitals = [
    // Americana
    { id: "americana1", name: "Centro de Hematologia Americana", lat: -22.7447, lng: -47.3283, needs: ["O-", "A+", "B-"], address: "Praça Francisco Matarazzo, 60, Vila Galo" },

    // Campinas
    { id: "campinas1", name: "Hemocentro Unicamp", lat: -22.8286, lng: -47.0635, needs: ["O-", "O+", "A-"], address: "R. Carlos Chagas, 480, Cidade Universitária" },
    { id: "campinas2", name: "Hemocentro Amoreiras (CDO)", lat: -22.9231, lng: -47.0744, needs: ["AB+", "O+"], address: "Av. das Amoreiras, 860, Parque Itália" },
    { id: "campinas3", name: "Pulsa São Paulo – Campinas", lat: -22.8985, lng: -47.0543, needs: ["A+", "B-"], address: "Av. Júlio de Mesquita, 571, Cambuí" },
    { id: "campinas4", name: "Laboratório Fleury Campinas", lat: -22.8961, lng: -47.0528, needs: ["O-", "AB-"], address: "Av. Júlio de Mesquita, 923, Cambuí" },
    { id: "campinas5", name: "Laboratório Confiance – Taquaral", lat: -22.8856, lng: -47.0578, needs: ["A-", "B+"], address: "Av. Dr. Heitor Penteado, 1080, Taquaral" },

    // Hortolândia
    { id: "hortolandia1", name: "Laboratório DMS Burnier Hortolândia", lat: -22.8521, lng: -47.2115, needs: ["O+", "A+"], address: "Av. Olívio Franceschini, 530" },
    { id: "hortolandia2", name: "Laboratório Samuel Pessoa", lat: -22.8884, lng: -47.2144, needs: ["AB-", "O-"], address: "R. Antônio Fernandes Leite, 123" },
    { id: "hortolandia3", name: "Laboratório Sete Mais", lat: -22.8633, lng: -47.2189, needs: ["B+", "A-"], address: "R. 21 de Fevereiro, 33" },
    { id: "hortolandia4", name: "Laboratório Confiance – Hortolândia", lat: -22.8598, lng: -47.2234, needs: ["O-", "A+"], address: "R. Carvalho Brasileiro, 665" },

    // Sumaré
    { id: "sumare1", name: "Laboratório Confiance – Sumaré Centro", lat: -22.8222, lng: -47.2688, needs: ["O-", "B-"], address: "R. Dom Barreto, 1754" },
    { id: "sumare2", name: "Laboratório DMS Burnier Sumaré", lat: -22.8211, lng: -47.2655, needs: ["A+", "O+"], address: "R. José Maria Miranda, 1161" },
    { id: "sumare3", name: "Hemocentro Sumaré (Hospital Estadual)", lat: -22.8344, lng: -47.2344, needs: ["O-", "AB+", "A-"], address: "Av. da Amizade, 2400" },
    { id: "sumare4", name: "Laboratório Rebouças", lat: -22.8233, lng: -47.2711, needs: ["B+", "O-"], address: "Praça Manoel de Vasconcelos, 502" },
    { id: "sumare5", name: "Laboratório Microlab Diagnósticos", lat: -22.8244, lng: -47.2677, needs: ["A-", "AB-"], address: "R. Máximo Biondo, 186" }
];

const markers = {};

function initMap() {
    map = L.map('map', {
        zoomControl: false
    }).setView(defaultLocation, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    addHospitalMarkers();
    setupSelectListeners();
}

function addHospitalMarkers() {
    const hospitalIcon = L.divIcon({
        className: 'hospital-marker',
        html: '<div style="background-color: #ED1C24; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: bold; border: 2px solid white; box-shadow: 0 0 15px rgba(237, 28, 36, 0.4);">H</div>',
        iconSize: [24, 24]
    });

    hospitals.forEach(hosp => {
        const marker = L.marker([hosp.lat, hosp.lng], { icon: hospitalIcon }).addTo(map);
        markers[hosp.id] = marker;

        marker.on('click', () => {
            showHospitalInfo(hosp);
        });

        marker.bindPopup(`<b>${hosp.name}</b><br>${hosp.address}<br>Urgente: ${hosp.needs.join(', ')}`);
    });
}

function setupSelectListeners() {
    const selects = document.querySelectorAll('select.form-select');
    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            const hospitalId = e.target.value;
            const hospital = hospitals.find(h => h.id === hospitalId);

            if (hospital) {
                // Centraliza o mapa no hospital selecionado
                map.flyTo([hospital.lat, hospital.lng], 16);

                // Abre o popup do marcador
                if (markers[hospitalId]) {
                    markers[hospitalId].openPopup();
                }

                // Mostra as informações no card
                showHospitalInfo(hospital);
            }
        });
    });
}

function showHospitalInfo(hosp) {
    const infoCard = document.getElementById('hospital-info');
    const h3 = infoCard.querySelector('h3');
    const bloodNeeds = infoCard.querySelector('.blood-needs');
    const addressP = infoCard.querySelector('.distance'); // Reutilizando o parágrafo de distância para o endereço

    h3.innerText = hosp.name;
    addressP.innerText = hosp.address;
    bloodNeeds.innerHTML = '';

    hosp.needs.forEach(need => {
        const span = document.createElement('span');
        span.className = 'tag' + (need.includes('-') ? ' urgent' : '');
        span.innerText = need;
        bloodNeeds.appendChild(span);
    });

    infoCard.style.transform = 'translateY(0)';
}

document.addEventListener('DOMContentLoaded', initMap);

document.addEventListener('click', (e) => {
    if (!e.target.closest('.hospital-marker') && !e.target.closest('.info-card') && !e.target.closest('.form-select')) {
        document.getElementById('hospital-info').style.transform = 'translateY(200%)';
    }
});
