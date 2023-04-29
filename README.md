
# Directory Scanner: a ferramenta para escaneamento de URLs

O Directory Scanner é uma poderosa ferramenta de escaneamento de URLs que permite listar todos os links disponíveis em um determinado site. Com três etapas de escaneamento, a ferramenta busca por links em toda a estrutura do site, incluindo páginas internas e externas.

Ao utilizar o Directory Scanner, você terá acesso a uma lista organizada de todos os links disponíveis no site, o que possibilita uma análise mais detalhada da estrutura do site e identificação de potenciais problemas, como links quebrados ou páginas mal configuradas.

Para utilizar o Directory Scanner, basta inserir o URL do site a ser escaneado e iniciar o processo de escaneamento. O Directory Scanner executa as três etapas de escaneamento de forma automática, sem a necessidade de configurações adicionais.

A ferramenta é essencial para profissionais de SEO, desenvolvedores e outros usuários que precisam analisar a estrutura de um site de forma rápida e eficiente. Com a customização da wordlist e do nível de profundidade, é possível ajustar o escaneamento às necessidades específicas de cada projeto.


# Estrutura do projeto
```
.
├── . DIST // Pasta da build gerada com o comando "npm build"
│      ├── (server.js) // o Arquivo buildado do projeto
│      └── (wordlist.txt) // a wordlist que sera utilizada no projeto.
├── . SRC // Todo o source do projeto
│      ├── API // Interface do axios para as requets
│      ├── ENV // Variaves de ambiente
│      ├── MODULES // MODULES
│           └── *5 // Cada pasta contem 2 arquivos um de controle e um de serviços.
│      ├── PAINEL // Contem 3 arquivos um de controle e um de serviços e o html do painel.
│      ├── (app.ts) // Responsavel pelo gerenciamento do projeto.
│      └── (server.ts) // Responsavel por iniciar o servidor.
├── . (.gitignore)
├── . (package.json) // Configuração do projeto
├── . (README.md) // Docs do projeto
└── . (tsconfig.json) // Configuração do typescript
```


# Rotas de acesso

O Directory Scanner possui quatro rotas de acesso, todas do tipo POST:

-   **/RobotsScan**?division=**VALUE** realiza o escaneamento apenas via arquivo **robots.txt**.
-   **/SourceScan**?division=**VALUE** realiza o escaneamento apenas via **source**.
-   **/WordListScan**?timeout=**VALUE**&division=**VALUE**: realiza o escaneamento apenas via **wordlist**.
-   **/FullScan**?timeout=**VALUE**&division=**VALUE**: realiza **todos** os modos de escaneamento disponíveis.
-   **OBS1.**: o parametro **timeout** tem um valor minimo de 5000 milissegundos(**5s**) qualquer valor abaixo disso fara o codigo
-   executar todo o ciclo sem interrupção.
-   **OBS2.**: o parametro **timeout** so sera aplicado ao scanner pela wordlist ou seja o tempo total da resposta
-   sera igual a o valor do **timeout** + todo o tempo necessario para executar os outros scanners por volta de **2 a 5 segundos**.

# Como utilizar

Para utilizar o **Directory Scanner**, é necessário ter uma interface para se comunicar com a **API**. Existem diversos programas desenvolvidos para serem **REST Clients**, como o **Insomnia**, o **Postman** ou outros similares. 

Porém também existe possibilidades de implementações como bots no **Telegram** ou no **WhatsApp**.

Em todas as requisições, é necessário passar o parâmetro **URL** no corpo(**body**) da requisição. 
**Exemplo:
{
    "url": "https://google.com.br/"
}**


## Requisitos de requisiçoes.

Em todas as requisições você necessita passar o parametro **URL**
no corpo(**body**) da requisição no mais é o único parâmetro a ser requisitado.

**EX.:
{
	"url": "https://google.com.br/"
}**

# Instalação local

Para instalar o **Directory Scanner** em sua máquina, é necessário ter o **Node.Js** instalado. Após instalar o **Node.Js**, abra a pasta do projeto em seu terminal de preferência e execute os comandos "**npm install**", "**npm run build**" e, por fim, "**npm run start**". 

Isso iniciará o projeto localmente em sua máquina, permitindo a utilização da ferramenta através da **URL** http://localhost:3000/  caso aja a 
necessidade de alterar a porta(3000) por qualquer outra do seu 
agrado contanto que sejam 4 números no arquivos das variáveis de ambiente (**ENV**). 