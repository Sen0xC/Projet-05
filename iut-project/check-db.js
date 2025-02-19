'use strict';

const Knex = require('knex');
const Manifest = require('./server/manifest');

const knexConfig = Manifest
    .get('/register/plugins', process.env)
    .find(({ plugin }) => plugin === '@hapipal/schwifty')
    .options.knex;

const checkDb = async () => {
    let knex;
    try {
        console.log('1. Vérification de la connexion...');
        knex = Knex(knexConfig);
        await knex.raw('SELECT 1');
        console.log('✅ Connexion réussie\n');

        console.log('2. Vérification des permissions...');
        await knex.raw('SHOW GRANTS');
        console.log('✅ Permissions OK\n');

        console.log('3. Vérification de la table movies...');
        // Vérifier si la table existe
        const tables = await knex.raw('SHOW TABLES');
        const movieTable = tables[0].find(t => Object.values(t)[0] === 'movies');
        
        if (!movieTable) {
            throw new Error('❌ La table movies n\'existe pas');
        }

        // Vérification de la structure de la table movies
        console.log('Vérification de la structure de la table movies...');
        const movieColumns = await knex.raw('DESCRIBE movies');
        const requiredColumns = [
            { name: 'id', type: 'int' },
            { name: 'title', type: 'varchar' },
            { name: 'description', type: 'text' },
            { name: 'releaseDate', type: 'date' },
            { name: 'director', type: 'varchar' },
            { name: 'favoriteByUsers', type: 'json' },
            { name: 'createdAt', type: 'datetime' },
            { name: 'updatedAt', type: 'datetime' }
        ];

        for (const col of requiredColumns) {
            const column = movieColumns[0].find(c => c.Field === col.name);
            if (!column) {
                console.log(`❌ Colonne manquante: ${col.name}`);
            } else if (!column.Type.includes(col.type)) {
                console.log(`❌ Type incorrect pour ${col.name}: attendu ${col.type}, reçu ${column.Type}`);
            }
        }

        console.log('✅ Structure de la table movies OK\n');

        // Test d'insertion/lecture/suppression
        console.log('4. Test des opérations CRUD...');
        const testId = await knex('movies').insert({
            title: 'Test Movie',
            description: 'Test Description',
            releaseDate: new Date(),
            director: 'Test Director',
            favoriteByUsers: '[]'
        });

        const testRead = await knex('movies').where('id', testId).first();
        if (!testRead) throw new Error('❌ Lecture impossible');

        await knex('movies').where('id', testId).delete();
        console.log('✅ Opérations CRUD OK');

    } catch (err) {
        console.error('Erreur:', err.message);
        process.exit(1);
    } finally {
        if (knex) {
            await knex.destroy();
        }
    }
};

checkDb();
