'use strict';

module.exports = {
    async up(knex) {
        await knex.schema.createTable('movie_favorites', (table) => {
            table.increments('id').primary();
            table.integer('userId').unsigned().notNull().references('id').inTable('user').onDelete('CASCADE');
            table.integer('movieId').unsigned().notNull().references('id').inTable('movies').onDelete('CASCADE');
            table.datetime('createdAt').notNull().defaultTo(knex.fn.now());
            
            // Index unique pour éviter les doublons
            table.unique(['userId', 'movieId']);
        });
    },

    async down(knex) {
        await knex.schema.dropTable('movie_favorites');
    }
};