import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  Dispatch,
  ReactNode,
} from 'react';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import { SavingAccountType } from '../components/types';

import {
  getSavingAccountsByItem as apiGetSavingAccountsByItem,
  getSavingAccountsByUser as apiGetSavingAccountsByUser,
} from './api';

interface SavingAccountsState {
  [savingAccountId: number]: SavingAccountType;
}

const initialState: SavingAccountsState = {};
type SavingAccountsAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: SavingAccountType[];
    }
  | { type: 'DELETE_BY_ITEM'; payload: number }
  | { type: 'DELETE_BY_USER'; payload: number };

interface SavingAccountsContextShape extends SavingAccountsState {
  dispatch: Dispatch<SavingAccountsAction>;
  savingAccountsByItem: { [itemId: number]: SavingAccountType[] };
  // deleteAccountsByItemId: (itemId: number) => void;
  getSavingAccountsByUser: (userId: number) => void;
  savingAccountsByUser: { [user_id: number]: SavingAccountType[] };
  // deleteAccountsByUserId: (userId: number) => void;
}
const savingAccountsContext = createContext<SavingAccountsContextShape>(
  initialState as SavingAccountsContextShape
);


/**
 * @desc Maintains the Saving Accounts context state and provides functions to update that state.
 */
export const SavingAccountsProvider: React.FC<{ children: ReactNode }> = (
  props: any
) => {
  const [savingAccountsById, dispatch] = useReducer(reducer, initialState);

  /**
   * @desc Requests all Accounts that belong to an individual Item.
   */
  const getSavingAccountsByItem = useCallback(async itemId => {
    const { data: payload } = await apiGetSavingAccountsByItem(itemId);
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
  }, []);

  /**
   * @desc Requests all Accounts that belong to an individual User.
   */
  const getSavingAccountsByUser = useCallback(async userId => {
    console.log('dentro!')
    const { data: payload } = await apiGetSavingAccountsByUser(userId);
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
  }, []);

  /**
   * @desc Will delete all accounts that belong to an individual Item.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteAccountsByItemId = useCallback(itemId => {
    // dispatch({ type: 'DELETE_BY_ITEM', payload: itemId });
  }, []);

  /**
   * @desc Will delete all accounts that belong to an individual User.
   * There is no api request as apiDeleteItemById in items delete all related transactions
   */
  const deleteAccountsByUserId = useCallback(userId => {
    // dispatch({ type: 'DELETE_BY_USER', payload: userId });
  }, []);

  /**
   * @desc Builds a more accessible state shape from the Accounts data. useMemo will prevent
   * these from being rebuilt on every render unless accountsById is updated in the reducer.
   */
  const value = useMemo(() => {
    const allSavingAccounts = Object.values(savingAccountsById);

    return {
      allSavingAccounts,
      savingAccountsById,
      accountsByItem: groupBy(allSavingAccounts, 'item_id'),
      savingAccountsByUser: groupBy(allSavingAccounts, 'user_id'),
      getSavingAccountsByItem,
      getSavingAccountsByUser,
      // deleteAccountsByItemId,
      // deleteAccountsByUserId,
    };
  }, [
    savingAccountsById,
    getSavingAccountsByItem,
    getSavingAccountsByUser,
    // deleteAccountsByItemId,
    // deleteAccountsByUserId,
  ]);

  return <savingAccountsContext.Provider value={value} {...props} />;
};

/**
 * @desc Handles updates to the Accounts state as dictated by dispatched actions.
 */
function reducer(state: SavingAccountsState, action: SavingAccountsAction) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      if (!action.payload.length) {
        return state;
      }
      return {
        ...state,
        ...keyBy(action.payload, 'id'),
      };
    case 'DELETE_BY_ITEM':
      return omitBy(
        state,
        transaction => transaction.item_id === action.payload
      );
    case 'DELETE_BY_USER':
      return omitBy(
        state,
        transaction => transaction.user_id === action.payload
      );
    default:
      console.warn('unknown action');
      return state;
  }
}

/**
 * @desc A convenience hook to provide access to the Saving context state in components.
 */
export default function useSavingAccounts() {
  const context = useContext(savingAccountsContext);

  if (!context) {
    throw new Error(`useSavingAccounts must be used within an SavingccountsProvider`);
  }

  return context;
}
