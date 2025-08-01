function geoLoc() {
    return {
        geoHabilitada: false,
        latitude: null,
        longitude: null,
        cep: "",
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
        enderecoValido: false,

        // Função para verificar se a geolocalização está habilitada
        init() {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => this.onGeoSuccess(position), // Garantindo o contexto correto
                    (error) => this.onGeoError(error) // Garantindo o contexto correto
                );
            } else {
                this.geoHabilitada = false;
                this.showAlert(
                    "Geolocalização não disponível neste dispositivo/navegador",
                    "warning"
                );
            }
        },

        // Sucesso na captura da localização
        onGeoSuccess(position) {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.geoHabilitada = true;
            console.log(
                "Geolocalização encontrada: ",
                this.latitude,
                this.longitude
            );
            this.buscarProximaLoja(); // Chama a função para buscar a loja mais próxima
        },

        // Erro na captura da localização
        onGeoError(error) {
            this.geoHabilitada = false;
            this.showAlert(
                "Não foi possível obter sua localização. Por favor, ative a geolocalização.",
                "warning"
            );
        },

        // Função para buscar o endereço com base no CEP
        buscarEndereco() {
            console.log("Buscando CEP: ", this.cep);
            fetch(`https://viacep.com.br/ws/${this.cep}/json/`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.erro) {
                        this.showAlert("CEP não encontrado", "warning"); // Exibe aviso caso o CEP não seja encontrado
                    } else {
                        this.rua = data.logradouro;
                        this.bairro = data.bairro;
                        this.cidade = data.localidade;
                        this.estado = data.uf;
                        this.enderecoValido = true;
                        console.log("Endereço preenchido: ", data);
                    }
                });
        },

        // Função para buscar as coordenadas do endereço usando OpenStreetMap
        buscarCoordenadasEndereco() {
            const endereco = `${this.rua}, ${this.bairro}, ${this.cidade}, ${this.estado}`;
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                endereco
            )}`;
            console.log("Buscando coordenadas para o endereço: ", endereco);
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    if (data.length > 0) {
                        this.latitude = parseFloat(data[0].lat);
                        this.longitude = parseFloat(data[0].lon);
                        console.log(
                            "Coordenadas encontradas: ",
                            this.latitude,
                            this.longitude
                        );
                        // Agora que as coordenadas foram encontradas, chama a função de buscar loja
                        this.showAlert(
                            "Coordenadas encontradas com sucesso!",
                            "success"
                        );
                        this.buscarProximaLoja();
                    } else {
                        this.showAlert(
                            "Não foi possível encontrar as coordenadas do endereço",
                            "danger"
                        );
                    }
                });
        },

        // Função para buscar a loja mais próxima
        buscarProximaLoja() {
            console.log("Buscando a loja mais próxima...");
            if (this.latitude && this.longitude) {
                let distanciaMaisProxima = Infinity;
                let lojaProxima = null;

                lojas.forEach((loja) => {
                    const distancia = this.calcularDistancia(
                        this.latitude,
                        this.longitude,
                        loja.lat,
                        loja.lon
                    );
                    console.log(
                        "Distância para a loja ",
                        loja.nome,
                        ": ",
                        distancia,
                        " km"
                    );
                    if (distancia < distanciaMaisProxima && distancia <= 10) {
                        distanciaMaisProxima = distancia;
                        lojaProxima = loja;
                    }
                });

                if (lojaProxima) {
                    console.log(
                        "Loja mais próxima encontrada: ",
                        lojaProxima.nome,
                        lojaProxima.url
                    );
                    window.location.href =
                        "https://www.ifood.com.br/delivery/" + lojaProxima.url;
                } else {
                    this.showAlert(
                        "Nenhuma loja encontrada dentro de 10 km",
                        "warning"
                    );
                }
            } else {
                this.showAlert("Não foi possível obter as coordenadas", "danger");
            }
        },

        // Função para calcular a distância entre dois pontos geográficos
        calcularDistancia(lat1, lon1, lat2, lon2) {
            const rad = Math.PI / 180;
            const dlat = (lat2 - lat1) * rad;
            const dlon = (lon2 - lon1) * rad;
            const a =
                Math.sin(dlat / 2) * Math.sin(dlat / 2) +
                Math.cos(lat1 * rad) *
                Math.cos(lat2 * rad) *
                Math.sin(dlon / 2) *
                Math.sin(dlon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const R = 6371; // Raio da Terra em km
            return R * c;
        },

        // Função para exibir alertas
        showAlert(message, type) {
            const alertContainer = document.getElementById("alert-container");
            const alertElement = document.createElement("div");
            alertElement.classList.add(
                "alert",
                `alert-${type}`,
                "alert-dismissible",
                "fade",
                "show"
            );
            alertElement.setAttribute("role", "alert");
            alertElement.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            alertContainer.appendChild(alertElement);
            setTimeout(() => alertElement.remove(), 5000); // Remove após 5 segundos
        },

        // Função para mostrar o formulário de CEP manualmente
        mostrarFormularioCEP() {
            this.geoHabilitada = false;
        },
    };
}