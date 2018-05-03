const express = require('express');
const router = express.Router();
const pM = require('../data/helpers/projectModel.js');

router.get('/', (req, res) => {
  pM
    .get()
    .then(projects => {
      res.json(projects);
    })
    .catch(error => res.status(500).json(error));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  pM
    .get()
    .then(projects => {
      const requestedProject = projects.filter(
        project => project.id === Number(id)
      )[0];
      if (requestedProject) {
        res.json(requestedProject);
      } else {
        res
          .status(404)
          .json({ message: `A project with ID ${id} was not found` });
      }
    })
    .catch(error => res.json(error));
});

router.get('/:id/actions', (req, res) => {
  const { id } = req.params;

  pM
    .getProjectActions(id)
    .then(projectActions => {
      if (projectActions[0]) {
        res.json(projectActions);
      } else {
        res.status(404).json({ message: `Project ID ${id} does not exist.` });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/', (req, res) => {
  const { body } = req;

  if (!body.name) {
    res.status(400).json({ message: 'Project name is required.' });
  } else if (body.name.length > 128) {
    res
      .status(400)
      .json({ message: 'Project name is limited to 128 characters' });
  } else if (!body.description) {
    res.status(400).json({ message: 'Project Description is required' });
  } else if (body.description.length > 128) {
    res
      .status(400)
      .json({ message: 'Project description is limited to 128 characters' });
  } else if (body.completed && typeof body.complete !== 'boolean') {
    res.status(400).json({
      message:
        'Complete flag is not required, but if supplied must be true or false.',
    });
  } else {
    pM
      .insert(body)
      .then(newProject => {
        res.json(newProject);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { body } = req;

  // Rather proud of this after thought... Dont want to change the actions from here...
  if (body.actions) {
    delete body.actions;
  }

  console.log(body.actions);

  pM
    .update(id, body)
    .then(updatedProject => {
      if (updatedProject === null) {
        res
          .status(404)
          .json({ message: `Project with ID of ${id} does not exist.` });
      } else {
        res.json(updatedProject);
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  pM
    .remove(id)
    .then(count => {
      if (count > 0) {
        pM
          .get()
          .then(projects => {
            res.json(projects);
          })
          .catch(error => res.status(500).json(error));
      } else {
        res
          .status(404)
          .json({ message: `Project with id ${id} does not exist.` });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;