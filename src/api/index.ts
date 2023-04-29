// Importa as bibliotecas necessárias
import axios from 'axios'
import { Agent as HttpAgent } from 'http'
import { Agent as HttpsAgent } from 'https'
import axiosRetry from 'axios-retry'

// Define o agente HTTP para gerenciar as conexões
const httpAgent = new HttpAgent({
  keepAlive: true, // Permite manter as conexões ativas
  keepAliveMsecs: 30000, // Tempo máximo para manter uma conexão inativa
  maxSockets: 50, // Número máximo de conexões simultâneas permitidas
  maxFreeSockets: 10, // Número máximo de conexões inativas permitidas
  timeout: 60000 // Tempo máximo de espera para uma resposta
})

// Define o agente HTTPS com as mesmas configurações do agente HTTP
const httpsAgent = new HttpsAgent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000
})

// Cria o objeto Axios com os agentes e o cabeçalho de compressão
const Api = axios.create({
  httpAgent,
  httpsAgent,
  headers: { 'Accept-Encoding': 'gzip' } // Solicita compressão Gzip nas respostas
})

// Configura o recurso de tentativas de repetição automática em caso de falha nas requisições
axiosRetry(Api, {
  retries: 2, // Número máximo de tentativas de repetição
  retryDelay: (retryCount: any) => {
    return retryCount * 500; // Tempo de espera entre as tentativas de repetição (aumenta a cada tentativa)
  }
})

// Exporta o objeto Api para uso em outras partes do código
export default Api
