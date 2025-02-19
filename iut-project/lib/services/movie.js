'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {
    static get tableName() {
        return 'movies';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(1).required().description('Movie title'),
            description: Joi.string().required().description('Movie description'),
            releaseDate: Joi.date().required().description('Movie release date'),
            director: Joi.string().required().description('Movie director'),
            favoriteByUsers: Joi.array().items(Joi.number().integer()).required(),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.favoriteByUsers = this.favoriteByUsers || [];
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }

    static get relationMappings() {
        const User = require('./user');

        return {
            favoritedBy: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'movies.id',
                    through: {
                        from: 'favorites.movieId',
                        to: 'favorites.userId'
                    },
                    to: 'user.id'
                }
            }
        };
    }
};

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class MovieService extends Service {
    async create(movie) {
        try {
            const { Movie } = this.server.models();
            const { notificationService } = this.server.services();
            
            const newMovie = await Movie.query().insertAndFetch({
                ...movie,
                favoriteByUsers: []
            });

            await notificationService.notifyNewMovie(newMovie);
            
            return newMovie;
        } catch (error) {
            console.error('Error creating movie:', error);
            throw Boom.badImplementation('Failed to create movie');
        }
    }

    async update(id, movie) {
        try {
            const { Movie } = this.server.models();
            const { notificationService } = this.server.services();
            
            const updatedMovie = await Movie.query()
                .patchAndFetchById(id, movie);

            if (!updatedMovie) {
                throw Boom.notFound('Movie not found');
            }

            await notificationService.notifyMovieUpdate(updatedMovie);
            
            return updatedMovie;
        } catch (error) {
            console.error('Error updating movie:', error);
            if (error.isBoom) throw error;
            throw Boom.badImplementation('Failed to update movie');
        }
    }

    async delete(id) {
        try {
            const { Movie } = this.server.models();
            
            const deletedCount = await Movie.query().deleteById(id);
            
            if (!deletedCount) {
                throw Boom.notFound('Movie not found');
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error deleting movie:', error);
            if (error.isBoom) throw error;
            throw Boom.badImplementation('Failed to delete movie');
        }
    }

    async findById(id) {
        try {
            const { Movie } = this.server.models();
            
            const movie = await Movie.query().findById(id);
            
            if (!movie) {
                throw Boom.notFound('Movie not found');
            }
            
            return movie;
        } catch (error) {
            console.error('Error in MovieService.findById:', error);
            if (error.isBoom) {
                throw error;
            }
            throw Boom.badImplementation('Failed to find movie');
        }
    }

    async findAll() {
        try {
            const { Movie } = this.server.models();
            return await Movie.query();
        } catch (error) {
            console.error('Error in MovieService.findAll:', error);
            throw Boom.badImplementation('Failed to fetch movies');
        }
    }
};
