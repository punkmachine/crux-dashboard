import "reflect-metadata";

import { AppDataSource } from "./config/database.js";
import { createApp } from "./config/app.js";
import { CronJobService } from "./services/cron-job.service.js";

async function bootstrap(): Promise<void> {
  try {
    console.log("Подключение к базе данных...");
    await AppDataSource.initialize();
    console.log("База данных успешно подключена");

    const app = createApp();
    const port = process.env.PORT || 3000;

    const server = app.listen(port, () => {
      console.log(`Сервер запущен на порту ${port}`);
    });

    const cronJobService = new CronJobService();
    cronJobService.start();

    const shutdown = async (signal: string): Promise<void> => {
      console.log(`\nПолучен сигнал ${signal}, завершение работы...`);

      cronJobService.stop();

      server.close(() => {
        console.log("HTTP сервер закрыт");
      });

      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log("Подключение к базе данных закрыто");
      }

      process.exit(0);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Ошибка при запуске приложения:", error);
    process.exit(1);
  }
}

bootstrap();
