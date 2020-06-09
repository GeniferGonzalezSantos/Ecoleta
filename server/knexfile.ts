//Algumas configs que a conexão com o banco não tem
//"knex:migrate": "knex migrate:latest --knexfile knexfile.ts migrate:latest"
import path from 'path';

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'),
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seed'),
    },

    useNullAsDefault: true,
};