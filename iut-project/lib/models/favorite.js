'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const Boom = require('@hapi/boom');

module.exports = class Favorite extends Model {

    static get tableName() {
        return 'favorite';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            userId: Joi.number().integer().greater(0).required(),
            filmId: Joi.number().integer().greater(0).required(),
            createdAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.createdAt = new Date();
    }

    static get relationMappings() {
        const Film = require('./film');
        const User = require('./user');

        return {
            film: {
                relation: Model.BelongsToOneRelation,
                modelClass: Film,
                join: {
                    from: 'favorite.filmId',
                    to: 'film.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'favorite.userId',
                    to: 'user.id'
                }
            }
        };
    }

    static async addFavorite(userId, filmId) {
        try {
            await this.query().insert({
                userId,
                filmId
            });
            return true;
        }
        catch (err) {
            // Si l'erreur est due à une violation de la contrainte d'unicité
            if (err.code === 'ER_DUP_ENTRY') {
                throw Boom.conflict('Film is already in favorites');
            }
            throw err;
        }
    }

    static async removeFavorite(userId, filmId) {
        const deleted = await this.query()
            .delete()
            .where({
                userId,
                filmId
            });
        
        if (!deleted) {
            throw Boom.notFound('Film not found in favorites');
        }
        
        return true;
    }

    static async isFavorite(userId, filmId) {
        const favorite = await this.query()
            .findOne({
                userId,
                filmId
            });
        
        return !!favorite;
    }
};
