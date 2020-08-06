import express from 'express';

// controllers
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsControllers';

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

routes.get('/classes', classesController.index);
routes.post('/classes', classesController.create);

routes.get('/connections', connectionsController.index)
routes.post('/connections', connectionsController.create);

export default routes;