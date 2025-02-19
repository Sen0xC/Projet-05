'use strict';

const { Service } = require('@hapipal/schmervice');
const EmailService = require('./email');

module.exports = class NotificationService extends Service {
    constructor(server) {
        super(server);
        console.log('Initializing NotificationService');
        this.emailService = new EmailService();
    }

    async notifyNewMovie(movie) {
        try {
            const { User } = this.server.models();
            console.log('Fetching users for notification...');
            const users = await User.query();

            console.log(`Found ${users.length} users to notify about new movie ${movie.title}`);

            for (const user of users) {
                try {
                    console.log(`Sending notification to ${user.email}`);
                    const info = await this.emailService.sendMail({
                        to: user.email,
                        subject: 'Nouveau film disponible !',
                        text: `Le film "${movie.title}" vient d'être ajouté à notre catalogue.\n\n` +
                              `Réalisé par: ${movie.director}\n` +
                              `Description: ${movie.description}`,
                        html: `<h1>Nouveau film disponible !</h1>
                               <p>Le film "<strong>${movie.title}</strong>" vient d'être ajouté à notre catalogue.</p>
                               <p><strong>Réalisateur:</strong> ${movie.director}</p>
                               <p><strong>Description:</strong> ${movie.description}</p>`
                    });
                    console.log(`Email sent successfully to ${user.email}. Preview URL: ${info.previewUrl}`);
                } catch (error) {
                    console.error(`Failed to send email to ${user.email}:`, error);
                }
            }
        } catch (error) {
            console.error('Error in notifyNewMovie:', error);
            throw error;
        }
    }

    async notifyMovieUpdate(movie) {
        try {
            const { User } = this.server.models();
            const { MovieFavorite } = this.server.models();
            console.log('Fetching users who have this movie in favorites...');

            // Get users through the junction table instead of favoriteByUsers field
            const favorites = await MovieFavorite.query()
                .where('movieId', movie.id)
                .select('userId');

            const userIds = favorites.map(f => f.userId);
            console.log('Users who have this movie in favorites:', userIds);

            if (userIds.length === 0) {
                console.log('No users have this movie in favorites');
                return;
            }

            // Get users who have this movie in their favorites
            const users = await User.query().whereIn('id', userIds);
            console.log(`Found ${users.length} users to notify about movie update ${movie.title}`);

            for (const user of users) {
                try {
                    console.log(`Sending update notification to ${user.email}`);
                    const info = await this.emailService.sendMail({
                        to: user.email,
                        subject: 'Un film que vous suivez a été mis à jour !',
                        text: `Le film "${movie.title}" a été mis à jour.\n\n` +
                              `Nouvelles informations:\n` +
                              `Réalisé par: ${movie.director}\n` +
                              `Description: ${movie.description}`,
                        html: `<h1>Film mis à jour</h1>
                               <p>Le film "<strong>${movie.title}</strong>" que vous suivez a été mis à jour.</p>
                               <p><strong>Réalisateur:</strong> ${movie.director}</p>
                               <p><strong>Description:</strong> ${movie.description}</p>`
                    });
                    console.log(`Update notification sent to ${user.email}, Preview URL: ${info.previewUrl}`);
                } catch (error) {
                    console.error(`Failed to send update notification to ${user.email}:`, error);
                }
            }
        } catch (error) {
            console.error('Error in notifyMovieUpdate:', error);
            throw error;
        }
    }
};