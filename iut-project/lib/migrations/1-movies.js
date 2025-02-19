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
            table.json('favoriteByUsers').notNull(); // Remove default value
            table.datetime('createdAt').notNull().defaultTo(knex.fn.now());
            table.datetime('updatedAt').notNull().defaultTo(knex.fn.now());
        });

        // Add trigger or modify insert operations to handle default value
        await knex.raw(`
            ALTER TABLE movies 
            ALTER COLUMN favoriteByUsers 
            SET DEFAULT (JSON_ARRAY())
        `);
    },

    async down(knex) {
        await knex.schema.dropTable('movies');
    }
};
