'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = [
    {
        method: 'POST',
        path: '/movies',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    description: Joi.string().required(),
                    releaseDate: Joi.date().required(),
                    director: Joi.string().required()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { Movie } = request.models();
                const { notificationService } = request.services();
                
                console.log('Creating new movie...');

                // Create movie object with properly formatted data
                const movieData = {
                    title: request.payload.title,
                    description: request.payload.description,
                    releaseDate: request.payload.releaseDate,
                    director: request.payload.director,
                    favoriteByUsers: JSON.stringify([]), // Properly stringify empty array
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // Insert and fetch the new movie
                const newMovie = await Movie.query().insertAndFetch(movieData);
                
                console.log('Movie created:', newMovie.title);

                // Send notifications
                console.log('Sending notifications...');
                await notificationService.notifyNewMovie(newMovie);
                console.log('Notifications sent successfully');

                return newMovie;
            } catch (error) {
                console.error('Error creating movie:', error);
                throw Boom.badImplementation('Failed to create movie');
            }
        }
    },
    {
        method: 'PATCH',
        path: '/movies/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                }),
                payload: Joi.object({
                    title: Joi.string(),
                    description: Joi.string(),
                    releaseDate: Joi.date(),
                    director: Joi.string()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { Movie } = request.models();
                const { notificationService } = request.services();

                const movie = await Movie.query().patchAndFetchById(request.params.id, request.payload);
                if (!movie) {
                    throw Boom.notFound('Film non trouvé');
                }

                // Send notifications to users who have this movie in favorites
                console.log('Sending update notifications...');
                await notificationService.notifyMovieUpdate(movie);
                console.log('Update notifications sent successfully');

                return movie;
            } catch (error) {
                console.error('Error updating movie:', error);
                throw Boom.badImplementation('Failed to update movie');
            }
        }
    },
    {
        method: 'DELETE',
        path: '/movies/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { Movie } = request.models();
            const deleted = await Movie.query().deleteById(request.params.id);
            if (!deleted) {
                throw Boom.notFound('Film non trouvé');
            }
            return h.response().code(204);
        }
    },
    {
        method: 'GET',
        path: '/movies/{id}',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            const { Movie } = request.models();
            const movie = await Movie.query().findById(request.params.id);
            if (!movie) {
                throw Boom.notFound('Film non trouvé');
            }
            return movie;
        }
    },
    {
        method: 'GET',
        path: '/movies',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { Movie } = request.models();
            return await Movie.query();
        }
    },
    {
        method: 'POST',
        path: '/movies/{id}/favorite',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { Movie } = request.models();
                const { MovieFavorite } = request.models();
                const { User } = request.models();
                
                const user = await User.query().findOne({ email: request.auth.credentials.email });
                if (!user) {
                    throw Boom.notFound('User not found');
                }

                const movie = await Movie.query().findById(request.params.id);
                if (!movie) {
                    throw Boom.notFound('Film non trouvé');
                }

                // Check if already in favorites
                const existingFavorite = await MovieFavorite.query()
                    .where({ userId: user.id, movieId: movie.id })
                    .first();

                if (existingFavorite) {
                    throw Boom.conflict('Ce film est déjà dans vos favoris');
                }

                // Add to favorites using the junction table
                await MovieFavorite.query().insert({
                    userId: user.id,
                    movieId: movie.id
                });

                console.log(`Added movie ${movie.title} to favorites for user ${user.id}`);
                return { success: true };
            } catch (error) {
                console.error('Error adding favorite:', error);
                if (error.isBoom) {
                    throw error;
                }
                throw Boom.badImplementation('Failed to add movie to favorites');
            }
        }
    },
    {
        method: 'DELETE',
        path: '/movies/{id}/favorite',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { MovieFavorite } = request.models();
                const { User } = request.models();
                
                const user = await User.query().findOne({ email: request.auth.credentials.email });
                if (!user) {
                    throw Boom.notFound('User not found');
                }

                await MovieFavorite.removeFavorite(user.id, request.params.id);
                return { success: true };
            } catch (error) {
                console.error('Error removing favorite:', error);
                if (error.isBoom) {
                    throw error;
                }
                throw Boom.badImplementation('Failed to remove movie from favorites');
            }
        }
    },
    {
        method: 'GET',
        path: '/movies/favorites',
        options: {
            auth: {
                scope: ['admin', 'user']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            try {
                const { Movie } = request.models();
                const { User } = request.models();
                const { MovieFavorite } = request.models();
                
                const user = await User.query().findOne({ email: request.auth.credentials.email });
                if (!user) {
                    throw Boom.notFound('User not found');
                }

                console.log(`Fetching favorites for user ${user.id}`);

                // Get movies through the junction table
                const movies = await Movie.query()
                    .join('movie_favorites', 'movies.id', 'movie_favorites.movieId')
                    .where('movie_favorites.userId', user.id);

                console.log(`Found ${movies.length} favorite movies`);
                return movies;
            } catch (error) {
                console.error('Error fetching favorites:', error);
                throw error;
            }
        }
    }
];
