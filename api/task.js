const express = require('express');
const api = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route  GET api/revDB/me
// @desc   Get current users review data
// @access Private
api.route('/task')
    .get(auth.verifyUser, async (req, res, next) => {
      Task.find({"assignedToId": req.user.userId}).sort({"startDate": -1}) //userId
			.then(
				(tasks) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(tasks);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
    })
    .post(auth.verifyUser, async (req, res, next) => {
        console.log('task body', req.body);
        Task.create({
          title: req.body.title,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          assignedToId: req.body.assignedToId, //why + ?
          description: req.body.description,
          assignedFromId: +req.user.empId, //empId might be reason for NaN
          status: req.body.status
        })
				.then(
					(task) => {
						console.log('Task created ', task);
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(task);
					},
					(err) => next(err)
				)
				.catch((err) => next(err));
      })
      .put(auth.verifyUser, (req, res, next) => {
          res.statusCode = 403;
          res.end('PUT operation not supported on /tasks');
        }
      )
      .delete(auth.verifyUser,(req, res, next) => {
        Task.remove({})
            .then(
              (resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        }
      );

api.route('/task/:taskId')
    .get(auth.verifyUser,(req, res, next) => {
      Task.findById(req.params.taskId)
        .then(
          (task) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(task);
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    })
    .post(auth.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /tasks/' + req.params.taskId);
      }
    )
    .put(auth.verifyUser,(req, res, next) => {
      console.log('params', req.params);
      console.log('body', req.body);
      Task.findByIdAndUpdate(
          req.params.taskId,
          { $set: {
            title: req.body.title,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            assignedToId: req.body.assignedToId, //why +
            description: req.body.notes ? req.body.notes : req.body.description, //JUGAAD
            assignedFromId: +req.user.empId,
            status: req.body.status
          }}, // CHECK ONCE
          { new: true, useFindAndModify: false}
        )
          .then(
            (task) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(task);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      }
    )
    .delete(auth.verifyUser,(req, res, next) => {
      Task.findByIdAndRemove(req.params.taskId)
          .then(
            (resp) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(resp);
            },
            (err) => next(err)
          )
          .catch((err) => next(err));
      }
    );

api.route('/taskByDate')
    .get(auth.verifyUser, async (req, res, next) => {
      const dateValue = new Date(req.query.selectedDate);
      console.log('in taskbydate', req.user.userId);
      Task.find({
        assignedToId: req.user.userId,  //empId changed to userId
        $and: [
          {startDate: {$lte: new Date(new Date(dateValue).setHours(23,59,59))}},
        {endDate: {$gte: new Date(new Date(dateValue).setHours(00,00,00))}}
        ]
      })
        .then(
				(tasks) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(tasks);
          console.log('tasklist in calendar',tasks);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
    })

module.exports = api;
