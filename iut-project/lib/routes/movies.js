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
                return await Movie.query().insertAndFetch({
                    ...request.payload,
                    favoriteByUsers: []
                });
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
            const { Movie } = request.models();
            const movie = await Movie.query().patchAndFetchById(request.params.id, request.payload);
            if (!movie) {
                throw Boom.notFound('Film non trouvé');
            }
            return movie;
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
                scope: ['user']
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
            const userId = request.auth.credentials.id;

            const movie = await Movie.query().findById(request.params.id);
            if (!movie) {
                throw Boom.notFound('Film non trouvé');
            }

            const added = await movie.addToFavorites(userId);
            if (!added) {
                throw Boom.conflict('Ce film est déjà dans vos favoris');
            }

            return { success: true };
        }
    },
    {
        method: 'DELETE',
        path: '/movies/{id}/favorite',
        options: {
            auth: {
                scope: ['user']
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
            const userId = request.auth.credentials.id;

            const movie = await Movie.query().findById(request.params.id);
            if (!movie) {
                throw Boom.notFound('Film non trouvé');
            }

            const removed = await movie.removeFromFavorites(userId);
            if (!removed) {
                throw Boom.notFound('Ce film n\'est pas dans vos favoris');
            }

            return { success: true };
        }
    },
    {
        method: 'GET',
        path: '/movies/favorites',
        options: {
            auth: {
                scope: ['user']
            },
            tags: ['api']
        },
        handler: async (request, h) => {
            const { Movie } = request.models();
            const userId = request.auth.credentials.id;

            return await Movie.query().whereRaw('JSON_CONTAINS(favoriteByUsers, ?)', [userId]);
        }
    }
];
