'use strict';

module.exports = {

    async up(knex) {
        await knex.schema.dropTableIfExists('movies');
        
        await knex.schema.createTable('movies', (table) => {
            table.increments('id').primary();
            table.string('title').notNull();
            table.text('description').notNull();
            table.date('releaseDate').notNull();
            table.string('director').notNull();
            // Ajout de la colonne favoriteByUsers en tant que JSON
            table.json('favoriteByUsers').notNull();
            table.datetime('createdAt').notNull().defaultTo(knex.fn.now());
            table.datetime('updatedAt').notNull().defaultTo(knex.fn.now());
        });

        // Créer un film de test
        await knex('movies').insert({
            title: 'Inception',
            description: 'Un film sur les rêves',
            releaseDate: '2025-02-18',
            director: 'Christopher Nolan',
            favoriteByUsers: JSON.stringify([])
        });
    },

    async down(knex) {
        await knex.schema.dropTable('movies');
    }
};
