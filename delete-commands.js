const { REST, Routes } = require("discord.js");
require("dotenv").config();

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🗑️ Deletando todos os slash commands da guilda...");

    // Use GUILD_ID para deletar comandos da guilda (mais rápido)
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: [] } // passar array vazio deleta todos
    );

    console.log("✅ Todos os slash commands da guilda foram deletados.");
  } catch (error) {
    console.error("❌ Erro ao deletar slash commands:", error);
  }
})();