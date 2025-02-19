'use strict';

const Manifest = require('./server/manifest');
const Schwifty = require('@hapipal/schwifty');

const testMovies = async () => {
    // Initialiser Knex directement
    const knexConfig = Manifest
        .get('/register/plugins')
        .find(({ plugin }) => plugin === '@hapipal/schwifty')
        .options.knex;
    
    const knex = require('knex')(knexConfig);
    
    try {
        // Créer quelques films
        console.log('\nCréation des films...');
        
        // Insérer les films un par un pour obtenir leurs IDs
        const movieData = [
            {
                title: 'Inception',
                description: 'Un voleur expérimenté dans l\'art de l\'extraction.',
                releaseDate: '2010-07-16',
                director: 'Christopher Nolan',
                favoriteByUsers: '[]'
            },
            {
                title: 'The Matrix',
                description: 'Un programmeur découvre que le monde est une simulation.',
                releaseDate: '1999-03-31',
                director: 'Lana et Lilly Wachowski',
                favoriteByUsers: '[]'
            },
            {
                title: 'Interstellar',
                description: 'Un groupe d\'explorateurs utilise un trou de ver pour voyager.',
                releaseDate: '2014-11-05',
                director: 'Christopher Nolan',
                favoriteByUsers: '[]'
            }
        ];

        for (const movie of movieData) {
            await knex('movies').insert(movie);
        }

        // Récupérer tous les films
        const movies = await knex('movies').select('*');
        console.log('Films créés:', movies.map(m => m.title).join(', '));
        
        // Simuler l'ajout aux favoris
        console.log('\nTest des favoris...');
        const userId = 1; // Simuler un ID utilisateur
        const movie = movies[0];
        
        console.log(`Ajout de ${movie.title} aux favoris de l'utilisateur...`);
        await knex('movies')
            .where('id', movie.id)
            .update({
                favoriteByUsers: JSON.stringify([userId])
            });
        
        // Vérifier les favoris
        const updatedMovie = await knex('movies').where('id', movie.id).first();
        console.log('Film mis à jour:', {
            title: updatedMovie.title,
            favoriteByUsers: JSON.parse(updatedMovie.favoriteByUsers)
        });
        
        // Récupérer les films favoris
        console.log('\nRécupération des films favoris...');
        const favorites = await knex('movies')
            .whereRaw('JSON_SEARCH(favoriteByUsers, "one", ?)', [userId]);
        console.log('Films favoris:', favorites.map(f => f.title));
        
        // Simuler la suppression des favoris
        console.log('\nTest de suppression des favoris...');
        await knex('movies')
            .where('id', movie.id)
            .update({
                favoriteByUsers: '[]'
            });
        
        const finalMovie = await knex('movies').where('id', movie.id).first();
        console.log('Film après suppression des favoris:', {
            title: finalMovie.title,
            favoriteByUsers: JSON.parse(finalMovie.favoriteByUsers)
        });
        
        console.log('\nTests terminés avec succès !');
    }
    finally {
        await knex.destroy();
    }
};

testMovies().catch((err) => {
    console.error('Erreur lors des tests:', err);
    process.exit(1);
});
