'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const Boom = require('@hapi/boom');

module.exports = class MovieFavorite extends Model {
    static get tableName() {
        return 'movie_favorites';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            userId: Joi.number().integer().required(),
            movieId: Joi.number().integer().required(),
            createdAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.createdAt = new Date();
    }

    static async removeFavorite(userId, movieId) {
        const deleted = await this.query()
            .delete()
            .where({
                userId,
                movieId
            });
        
        if (!deleted) {
            throw Boom.notFound('Ce film n\'est pas dans vos favoris');
        }
        
        return true;
    }
};