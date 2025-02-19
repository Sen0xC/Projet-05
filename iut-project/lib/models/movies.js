'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const Boom = require('@hapi/boom');

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
