const express = require('express');
const router = express.Router();
const aM = require('../data/helpers/actionModel.js');
const pM = require('../data/helpers/projectModel.js');

router.get('/', (req, res) => {
  aM
    .get()
    .then(actions => {
      res.json(actions);
    })
    .error(error => {
      res.status(500).json(error);
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  aM
    .get()
    .then(actions => {
      const requestedAction = actions.filter(
        action => action.id === Number(id)
      )[0];
      requestedAction
        ? res.json(requestedAction)
        : res.status(404).json({ message: 'Requested action does not exist.' });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/', (req, res) => {
  const action = req.body;
  const pIDs = [];

  pM
    .get()
    .then(projects => {
      projects.forEach(project => {
        pIDs.push(project.id);
      });
      if (!typeof action.description === 'string') {
        res
          .status(400)
          .json({ message: 'Action description must me a string.' });
      } else if (action.description.length > 128) {
        res.status(400).json({
          message: 'Action desctiption can be no more than 128 characters.',
        });
      } else if (typeof action.notes !== 'string') {
        // add "action.notes && " before the type of check.
        res.status(400).json({
          message:
            'Action notes is not required (not supposed to be, yet insert will not work if notes arent passed into it.), but if it is supplied, it must me a string.',
        });
      } else if (!pIDs.includes(action.project_id)) {
        res.status(400).json({ message: 'Existing project ID is required.' });
      } else {
        aM
          .insert(action)
          .then(newAction => {
            res.json(newAction);
          })
          .catch(error => {
            res.status(500).json(error => {
              error;
            });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Error checking current Project IDs.' });
    });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body;

  aM
    .update(id, body)
    .then(updated => {
      if (updated === null) {
        res.status(400).json({ message: 'Action with that ID was not found.' });
      } else {
        res.json(updated);
      }
    })
    .catch(error => res.status(500).json(error));
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  aM
    .remove(id)
    .then(count => {
      if (count > 0) {
        aM
          .get()
          .then(actions => {
            res.json(actions);
          })
          .error(error => {
            res.status(500).json(error);
          });
      } else {
        res
          .status(404)
          .json({ message: `Action with an ID of ${id} was not found.` });
      }
    })
    .catch(error => res.status(500).json(error));
});

module.exports = router;

