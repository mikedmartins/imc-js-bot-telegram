const telegrambot = require("node-telegram-bot-api");

const token = "SEU-TOKEN-AQUI";

const bot = new telegrambot(token, { polling: true });

// Usaremos um objeto para rastrear o estado de cada conversa
const conversas = {};

bot.on("text", (msg) => {
  const chatId = msg.chat.id;

  if (!conversas[chatId]) {
    conversas[chatId] = { step: 0 };
  }

  const conversa = conversas[chatId];

  switch (conversa.step) {
    case 0:
      bot.sendMessage(chatId, `Digite seu peso, ${msg.from.first_name}`);
      conversa.step = 1;
      break;
    case 1:
      const pesoComTudo = msg.text;
      const peso = parseFloat(pesoComTudo.replace(/[^0-9.]/g, ""));
      if (!isNaN(peso)) {
        conversa.peso = peso;
        bot.sendMessage(chatId, `Digite sua altura, ${msg.from.first_name}`);
        conversa.step = 2;
      } else {
        bot.sendMessage(chatId, "Digite um valor de peso válido.");
      }
      break;
    case 2:
      const alturaComTudo = msg.text;
      const altura = parseFloat(alturaComTudo.replace(/[^0-9.]/g, ""));
      if (!isNaN(altura)) {
        conversa.altura = altura / 100;
        const quadrado = conversa.altura * conversa.altura;
        const calculo = conversa.peso / quadrado;

        let mensagem;
        if (calculo < 18.5) {
          mensagem = "Você está magro com esse índice: " + calculo;
        } else if (calculo >= 18.5 && calculo < 24.9) {
          mensagem = "Você está normal com esse índice: " + calculo;
        } else if (calculo >= 25 && calculo < 29.9) {
          mensagem = "Você está com sobrepeso com esse índice: " + calculo;
        } else if (calculo >= 30 && calculo < 39.9) {
          mensagem = "Você está com obesidade com esse índice: " + calculo;
        } else {
          mensagem = "Você está com obesidade grave com esse índice: " + calculo;
        }

        bot.sendMessage(chatId, mensagem);
        delete conversas[chatId]; // Limpa o estado da conversa

      } else {
        bot.sendMessage(chatId, "Digite um valor de altura válido.");
      }
      break;
  }
});
