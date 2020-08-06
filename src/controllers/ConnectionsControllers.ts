import { Request, Response } from 'express';

// database
import db from '../database/connections';

interface Connections {
  user_id: string;
}

export default class ConnectionsController {
  index(req: Request, res: Response) {
    db('connections').count('* as total')
    
    .then(rows => {
      res.json(rows);
    })
  }

  create(req: Request, res: Response) {
    const connection: Connections = req.body;

    db('connections').insert({ 
      user_id: connection.user_id
    })

    .then(() => res.json('Connection Created'))
  
    .catch(err => res.status(400).json({ message: err.message}));
  }
}