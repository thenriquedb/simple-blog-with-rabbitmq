import { RabbitMQ } from '../shared/rabbitMQ';
import { UserPreferenceData } from '../repositories/user-preference-repository';
import { knex } from '../database/db';
import env from '../constants/env';

export async function articleEventsConsumer() {
  const channel = new RabbitMQ(env.RABBITMQ_URL);
  await channel.start();

  channel.consume('client.events.article', async (message) => {
    if (message?.fields.routingKey.includes('created')) {
      const parsedContent = JSON.parse(message.content.toString());
      const articleTitle = parsedContent.title;
      const categoryId = message?.properties?.headers?.category_id;

      const stream = knex("user_preferences")
        .join("users", "users.id", "=", "user_preferences.user_id")
        .join("categories", "categories.id", "=", "user_preferences.category_id")
        .where({ category_id: categoryId })
        .select<UserPreferenceData>([
          "user_preferences.id",
          "category_id",
          "users.name as userName",
          "users.id as userId",
          "users.email as userEmail",
          "categories.name as categoryName"
        ])
        .stream();

      stream.on('data', async (row: UserPreferenceData) => {
        await channel.publishInExchange('articles', 'client.mail.send', JSON.stringify({
          email: row.userEmail,
          subject: 'New article created',
          body: `Hello ${row.userName}, how are you? A new article was published in the category ${row.categoryName}. The article is ${articleTitle}. Enjoy!`,
        }));

        await channel.publishInExchange('articles', 'client.notifications.new', JSON.stringify({
          userId: row.userId,
          title: 'New article created',
          message: `A new article was published in the category ${row.categoryName}!`,
        }));
      });
    }
  });
}