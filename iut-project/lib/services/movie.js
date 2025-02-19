'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const { Service } = require('@hapipal/schmervice');

module.exports = class Movie extends Model {

    static get tableName() {
        return 'movies';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().required(),
            description: Joi.string().required(),
            releaseDate: Joi.date().required(),
            director: Joi.string().required(),
            favoriteByUsers: Joi.array().items(Joi.number()).default([]),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }
};

module.exports = class MovieService extends Service {

    async create(movie) {
        const { Movie } = this.server.models();
        
        try {
            return await Movie.query().insertAndFetch(movie);
        } catch (error) {
            console.error('Error creating movie:', error);
            throw Boom.badImplementation('Failed to create movie');
        }
    }

    async update(id, movie) {
        try {
            const { Movie } = this.server.models();
            
            const updatedMovie = await Movie.query()
                .findById(id)
                .patch(movie)
                .returning('*')
                .first();
                
            if (!updatedMovie) {
                throw Boom.notFound('Movie not found');
            }
            
            return updatedMovie;
        } catch (error) {
            console.error('Error in MovieService.update:', error);
            if (error.isBoom) {
                throw error;
            }
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
            console.error('Error in MovieService.delete:', error);
            if (error.isBoom) {
                throw error;
            }
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
