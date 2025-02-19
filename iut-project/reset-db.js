'use strict';

const Knex = require('knex');
const Package = require('./package.json');
const Manifest = require('./server/manifest');

const knexConfig = Manifest
    .get('/register/plugins', process.env)
    .find(({ plugin }) => plugin === '@hapipal/schwifty')
    .options.knex;

// Configuration sans base de données spécifique
const rootConfig = {
    ...knexConfig,
    connection: {
        ...knexConfig.connection,
        database: null
    }
};

const reset = async () => {
    try {
        // Se connecter sans base de données spécifique
        console.log('Connecting to MySQL server...');
        const rootKnex = Knex(rootConfig);
        
        // Supprimer et recréer la base de données
        console.log('Dropping and recreating database...');
        await rootKnex.raw(`DROP DATABASE IF EXISTS ${process.env.DB_DATABASE}`);
        await rootKnex.raw(`CREATE DATABASE ${process.env.DB_DATABASE}`);
        
        await rootKnex.destroy();
        console.log('Database reset successfully');
        process.exit(0);
    }
    catch (err) {
        console.error('Error resetting database:', err);
        process.exit(1);
    }
};

reset();
