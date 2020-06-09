import express from 'express';
import ItemsController from './controllers/ItemsController';
import PointsController from './controllers/PointsController';
import multer from 'multer';
import multerConfig from './configs/multer';
import { celebrate , Joi} from 'celebrate';

const routes = express.Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post('/points', 
upload.single('image'), 
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    whatsapp: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    city: Joi.string().required(),
    uf: Joi.string().required().max(2),
    items: Joi.string().required(),

  })
}, {
  abortEarly: false,
}),
pointsController.create);


export default routes;

//como demora pra carregar o servidor foi add o --ignore-watch node_modules para evitar de carregar todos esses arquivos 
//desacoplar o código: paterns. Estruturas de pastas para ficar mais legível

// é um padrão da comunidade usar esses métodos quando se usa a pasta controller:
//index: para listagem
//show: se for exibir um unico registro
//create/store
//update
//delete/destroy
