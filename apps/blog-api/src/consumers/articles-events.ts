import { getRabbitMQInstance } from '../shared/rabbitMQ';
import { UserPreferenceData, UserPreferenceRepository } from '../repositories/user-preference-repository';

export async function articleEventsConsumer() {
  const channel = await getRabbitMQInstance()

  channel.consume('client.events.article', async (message) => {
    if (message?.fields.routingKey.includes('created')) {
      const parsedContent = JSON.parse(message.content.toString());
      const articleTitle = parsedContent.title;
      const categoryId = message?.properties?.headers?.['x-category-id'] as number;

      const stream = UserPreferenceRepository.listUsersByCategory(categoryId).stream();

      stream.on('data', async (row: UserPreferenceData) => {
        await channel.publishInExchange(
          'ex.blog.email',
          'blog.email.ready',
          JSON.stringify({
            email: row.userEmail,
            subject: 'New article created',
            body: `Hello ${row.userName}, how are you? A new article was published in the category ${row.categoryName}. The article is ${articleTitle}. Enjoy!`,
          }),
        );

        await channel.publishInExchange(
          'ex.blog.notifications',
          'client.notifications.new',
          JSON.stringify({
            userId: row.userId,
            title: 'New article created',
            message: `A new article was published in the category ${row.categoryName}!`,
          })
        );
      });
    }
  });
}