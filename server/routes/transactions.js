/**
 * @file Defines all routes for the Transactions route.
 */

 const express = require('express');
 const { setOwnTransactions, unsetOwnTransactions } = require('../db/queries');
 const { asyncWrapper } = require('../middleware');
 
 const router = express.Router(); 

/**
 * Set a transaction as a transaction to own account (savings account)
 *
 *
 * @param {string} transactionId the plaid transaction Id.
 */
 router.post(
    '/:transactionId/own',
    asyncWrapper(async (req, res) => {
      const { transactionId } = req.params;
      await setOwnTransactions([transactionId]);
      res.sendStatus(200);
    })
  );
  
/**
 * Unset a transaction as a transaction to own account (savings account)
 *
 *
 * @param {string} transactionId the plaid transaction Id.
 */
 router.delete(
    '/:transactionId/own',
    asyncWrapper(async (req, res) => {
      const { transactionId } = req.params;
      await unsetOwnTransactions([transactionId]);
      res.sendStatus(200);
    })
  );
  
module.exports = router;
