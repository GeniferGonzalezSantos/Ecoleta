import { Request, Response } from 'express';
import knex from '../database/conection';

class ItemsController {
    //método index é para listagem
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*');

        //transforma os dados pra um novo formato que vai ser mais acessível para quem tá utilizando -serialized- cerealização de dados
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.15.20:3333/uploads/${item.image}`,
            };
        });

        return response.json(serializedItems);
    }
};

export default ItemsController;