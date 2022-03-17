import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';

import { currencyFilter, pluralize } from '../util';
import { CategoriesChart } from '.';
import { TransactionType } from './types';
import { transactionsForChart } from '../data/dummyData';
import { Helpers } from '../services/helpers';

interface Props {
  transactions: TransactionType[];
  numOfItems: number;
}

interface Categories {
  [key: string]: number;
}

export default function SpendingInsights(props: Props) {
  // grab transactions from most recent month and filter out transfers and payments
  const transactions = props.transactions;
  const dataForChart = Helpers.orderDataForhart(props.transactions);
  const monthlyTransactions = useMemo(
    () =>
      transactions.filter(tx => {
        const date = new Date(tx.date);
        const today = new Date();
        const oneMonthAgo = new Date(new Date().setDate(today.getDate() - 30));
        return (
          date > oneMonthAgo &&
          tx.category !== 'Payment' &&
          tx.category !== 'Transfer' &&
          tx.category !== 'Interest'
        );
      }),
    [transactions]
  );

  // create category and name objects from transactions

  const categoriesObject = useMemo((): Categories => {
    return monthlyTransactions.reduce((obj: Categories, tx) => {
      tx.category in obj
        ? (obj[tx.category] = tx.amount + obj[tx.category])
        : (obj[tx.category] = tx.amount);
      return obj;
    }, {});
  }, [monthlyTransactions]);

  const namesObject = useMemo((): Categories => {
    return monthlyTransactions.reduce((obj: Categories, tx) => {
      tx.name in obj
        ? (obj[tx.name] = tx.amount + obj[tx.name])
        : (obj[tx.name] = tx.amount);
      return obj;
    }, {});
  }, [monthlyTransactions]);

  // sort names by spending totals
  const sortedNames = useMemo(() => {
    const namesArray = [];
    for (const name in namesObject) {
      namesArray.push([name, namesObject[name]]);
    }
    namesArray.sort((a: any[], b: any[]) => b[1] - a[1]);
    namesArray.splice(5); // top 5
    return namesArray;
  }, [namesObject]);

  const data = {
    series: dataForChart,
    // series: [
    //   {
    //     name: 'PRODUCT A',
    //     data: [44, 55, 41, 67, 22, 43],
    //   },
    //   {
    //     name: 'PRODUCT B',
    //     data: [13, 23, 20, 8, 13, 27],
    //   },
    //   {
    //     name: 'PRODUCT C',
    //     data: [11, 17, 15, 15, 21, 14],
    //   },
    //   {
    //     name: 'PRODUCT D',
    //     data: [21, 7, 25, 13, 22, 8],
    //   },
    // ],
    options: {
      // colors: [
      //   '#7a7a7a',
      //   '#9a9a9a',
      //   '#aaaaaa',
      //   '#c6c6c6',
      //   '#e7e7e7',
      //   '#7c7c7c',
      // ],
      chart: {
        id: 'bar',
        height: 350,
        stacked: true,
      },
      xaxis: {
        categories: [
          'JAN',
          'FEB',
          'MAR',
          'APR',
          'MAY',
          'JUN',
          'JUL',
          'AUG',
          'SEP',
          'OCT',
          'NOV',
          'DEC',
        ],
      },
    },
  };

  return (
    <div>
      <h2 className="monthlySpendingHeading text-centered">€XXX,xx</h2>
      <p className="text-centered">
        -To be Invested /Saved Amount- is advised to be invested to improve your
        financial health
      </p>
      {/* <h2 className="monthlySpendingHeading">Monthly Spending</h2>
      <h4 className="tableSubHeading">A breakdown of your monthly spending</h4>
      <div className="monthlySpendingText">{`Monthly breakdown across ${
        props.numOfItems
      } bank ${pluralize('account', props.numOfItems)}`}</div> */}
      <div className="monthlySpendingContainer">
        {/* <div className="userDataBox">
          <CategoriesChart categories={categoriesObject} />
        </div> */}
        {/* <div className="userDataBox">
          <div className="holdingsList">
            <h4 className="holdingsHeading">Top 5 Vendors</h4>
            <div className="spendingInsightData">
              <p className="title">Vendor</p> <p className="title">Amount</p>
              {sortedNames.map((vendor: any[]) => (
                <>
                  <p>{vendor[0]}</p>
                  <p>{currencyFilter(vendor[1])}</p>
                </>
              ))}
            </div>
          </div>
        </div> */}
        <div className="userDataBox w-100">
          <Chart
            options={data.options}
            series={data.series}
            type="bar"
            // width="500"
            height="500"
          />
        </div>
      </div>
    </div>
  );
}
