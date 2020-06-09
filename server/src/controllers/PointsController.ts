import { Request, Response } from 'express';
import knex from '../database/conection';

class PointsController {
    async index(request: Request, response: Response) {
        //vai ser uma função para validar os filtros de cidades, uf e items. 
        //Sempre com querys params, pois é o responsável por filtros
        const {city, uf, items} = request.query;
        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...points,
                image_url: `http://192.168.15.20:3333/uploads/${point.image}`,
            };
        });

        return response.json(serializedPoints);
    };

    async show(request:Request, response:Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point) {
            return response.status(400).json({menssage:'deu ruim' });
        };

        const serializedPoint = {
                ...point,
                image_url: `http://192.168.15.20:3333/uploads/${point.image}`,
            };

        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        //.select('items.title')

        return response.json({ point: serializedPoint, items });
    };
        
        async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        /* Nesse caso existem duas querys (inserts) que não dependem uma da outra. 
        Então pra não executar um, caso a outra dê errado, se cria essa var. Se uma não executar, a outra tbm não
        trx = transaction*/
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedIds = await trx('points').insert(point);

        //relacionamento com a tabela de items
        const point_id = insertedIds[0];

        const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number/* typeScript precisa informar manualmente o tipo quando ele reclama*/) => {
            return {
                item_id,
                point_id,
            };
        });

        await trx('point_items').insert(pointItems);
        //precisa dar o commit para fazer os inserts no final sempre qeu usa o trx
        await trx.commit();
        //retornando todos os dados do point
        return response.json({ 
            id: point_id,
            ...point,
        });
    };

}

export default PointsController;

//cors: ele define na api quais endereços externos vão ter acesso a api