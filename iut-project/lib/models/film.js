'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Film extends Model {

    static get tableName() {
        return 'film';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            title: Joi.string().min(1).required().description('Film title'),
            description: Joi.string().required().description('Film description'),
            releaseDate: Joi.date().required().description('Film release date'),
            director: Joi.string().required().description('Film director'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }

    static get relationMappings() {
        const Favorite = require('./favorite');
        const User = require('./user');

        return {
            favorites: {
                relation: Model.HasManyRelation,
                modelClass: Favorite,
                join: {
                    from: 'film.id',
                    to: 'favorite.filmId'
                }
            },
            favoritedBy: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'film.id',
                    through: {
                        from: 'favorite.filmId',
                        to: 'favorite.userId'
                    },
                    to: 'user.id'
                }
            }
        };
    }
};
