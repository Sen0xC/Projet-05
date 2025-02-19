'use strict';

module.exports = {

    async up(knex) {
        try {
            console.log('Starting user table creation...');
            
            // Supprimer la table si elle existe
            console.log('Dropping existing user table if it exists...');
            await knex.schema.dropTableIfExists('user');
            
            console.log('Creating new user table...');
            await knex.schema.createTable('user', (table) => {
                console.log('Defining table schema...');
                
                table.increments('id').primary();
                table.string('firstName').notNull();
                table.string('lastName').notNull();
                table.string('email').notNull().unique();
                table.string('password').notNull();
                table.string('username').notNull();
                table.json('roles').notNull();
                table.datetime('createdAt').notNull().defaultTo(knex.fn.now());
                table.datetime('updatedAt').notNull().defaultTo(knex.fn.now());
                
                console.log('Schema defined successfully');
            });

            // Insérer un utilisateur admin par défaut
            await knex('user').insert({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@example.com',
                password: 'adminpass',
                username: 'admin',
                roles: JSON.stringify(['admin']),
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Insérer un utilisateur normal par défaut
            await knex('user').insert({
                firstName: 'Normal',
                lastName: 'User',
                email: 'user@example.com',
                password: 'userpass',
                username: 'user',
                roles: JSON.stringify(['user']),
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            console.log('User table created successfully with default users');
        }
        catch (err) {
            console.error('Error creating user table:', err);
            throw err;
        }
    },

    async down(knex) {
        await knex.schema.dropTableIfExists('user');
    }
};
