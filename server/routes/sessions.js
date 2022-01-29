/**
 * @file Defines all routes for the Users route.
 */

const express = require('express');
const { retrieveUserByUsername, retrieveUserByLocalID } = require('../db/queries');
const { asyncWrapper } = require('../middleware');
const { sanitizeUsers } = require('../util');

const router = express.Router();

/**
 * Retrieves user information for a single user.
 *
 * @param {string} localID the localId of the user.
 * @returns {Object[]} an array containing a single user.
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const { localID } = req.body;
    const user = await retrieveUserByLocalID(localID);
    console.log('user!', user);
    if (user != null) {
      res.json(sanitizeUsers(user));
    } else {
      res.json(null);
    }
  })
);

module.exports = router;
