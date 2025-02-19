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
            favoriteByUsers: Joi.alternatives().try(
                Joi.array().items(Joi.number().integer()),
                Joi.string()
            ).default('[]'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        
        // Ensure favoriteByUsers is initialized
        if (!this.favoriteByUsers) {
            this.favoriteByUsers = '[]';
        }
        // Convert array to string if necessary
        if (Array.isArray(this.favoriteByUsers)) {
            this.favoriteByUsers = JSON.stringify(this.favoriteByUsers);
        }
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
        
        // Convert array to string if necessary
        if (Array.isArray(this.favoriteByUsers)) {
            this.favoriteByUsers = JSON.stringify(this.favoriteByUsers);
        }
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
                        from: 'movie_favorites.movieId',
                        to: 'movie_favorites.userId'
                    },
                    to: 'user.id'
                }
            }
        };
    }
};