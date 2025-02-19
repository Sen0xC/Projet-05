'use strict';

module.exports = {

    async up(knex) {
        await knex.schema.createTable('favorite', (table) => {
            table.increments('id').primary();
            table.integer('userId').unsigned().notNull().references('id').inTable('user').onDelete('CASCADE');
            table.integer('filmId').unsigned().notNull().references('id').inTable('film').onDelete('CASCADE');
            table.datetime('createdAt').notNull().defaultTo(knex.fn.now());
            
            // Créer un index unique pour éviter les doublons
            table.unique(['userId', 'filmId']);
        });
    },

    async down(knex) {
        await knex.schema.dropTable('favorite');
    }
};
