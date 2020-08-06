import { Request, Response } from 'express';

// imports
import db from '../database/connections';
import convertHourToMinutes from '../utils/utils';

interface Filters {
  time: string;
  subject: string;
  week_day: string;
}

interface Schedule {
  to: string;
  from: string;
  week_day: number;
}

interface Classes {
  name: string;
  avatar: string;
  whatsapp: string;
  bio: string;
  subject: string;
  cost: string;
  schedule: Schedule[];
}

export default class ClassesController {

  index(req: Request, res: Response) {
    const filters: Filters = req.query;

    if(!filters.week_day || !filters.subject || !filters.time) {
      return res.status(400).json({
        error: 'Missing filters to search classes'
      })
    }

    const timeInMinutes = convertHourToMinutes(filters.time);

    // select classes
    db('classes').whereExists(function() {
      this.select('class_schedule.*')
        .from('class_schedule')
        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
        .whereRaw('`class_schedule`.`week_day` = ??', [Number(filters.week_day)])
        .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
        .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes]);
    })

    .where('classes.subject', '=', filters.subject)

    .join('users', 'classes.user_id', '=', 'users.id')

    .select(['users.*', 'classes.*'])

    .then(classes => res.json(classes))

    .catch(err => res.status(400).json({ message: err.message}));
  }
  
  create(req: Request, res: Response) {
    const classes: Classes = req.body;
  
    db.transaction(function(trx) {
      db('users').transacting(trx).insert({
        name: classes.name,
        avatar: classes.avatar,
        whatsapp: classes.whatsapp,
        bio: classes.bio
      })
    
      .then(usersId => {
        const user_id = usersId[0];
    
        return db('classes').transacting(trx).insert({
          user_id,
          subject: classes.subject,
          cost: classes.cost
        });
        
      })
    
      .then(classesId => {
        const class_id  = classesId[0];
        const schedules = classes.schedule.map((scheduleItem: Schedule) => ({
            class_id,
            week_day: scheduleItem.week_day,
            from: convertHourToMinutes(scheduleItem.from),
            to: convertHourToMinutes(scheduleItem.to),
        }));
    
        return db('class_schedule').transacting(trx).insert(schedules);
      })
    
      .then(trx.commit)
    
      .catch(trx.rollback);
    })
  
    .then(() => res.json('Class Created'))
  
    .catch(err => res.status(400).json({ message: err.message}));
  }

}