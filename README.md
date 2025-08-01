# Froneri - Sistema de Geolocalização de Lojas no iFood

Projeto criado em Javascript, para a empresa Froneri, grupo Nestlê. Esse sistema simples de pegar a geolocalização do usuário e leva-lo para a loja mais proxima dele no iFood para a aquisição de produtos. Caso não ache pela geolocalização, damos a possibilidade de fazer essa pesquisa pelo seu CEP.

Project built in JavaScript for Froneri, part of the Nestlé Group. This simple system captures the user’s geolocation and directs them to the nearest iFood store to purchase products. If a match can’t be found via geolocation, we offer the option to perform the search using their CEP.

## Instalação / Funcionamento

Para o sistema funcionar, basta copiar todos os arquivos para uma pasta no webserver e abrir o arquivo index.html no browser de preferência.

Seu funcionamento é simples, quando o usuário acessa a url, o browser verifica se a geolocalização esta ativa no dispositivo, caso não estaja, abre uma pop-up de autorização para ativar a funcionalidade do dispositivo, uma vez ativa, o processo se inicia. O sistema de a geolocalização do dispositivo, compara a latitude e logitude do dispositivo com uma lista de loja em json, cosiderando uma distância máxima. Se o resultado for possitivo, o usuário é redirecionado para a url da loja em questão no site do iFood.
