import moment from 'moment';

// Order elements by category and by month
export class Helpers {
  // Order data for the chart
  static orderDataForhart(transactions: any): any {
    let newArray: any = [];
    transactions.forEach((element: any, index: number) => {
      // Get month
      const transDate = moment(element.date, 'YYYY/MM/DD');
      var month = +transDate.format('M');
      var year = +transDate.format('YYYY');
      if (year === 2022) {
        const flagIndex = newArray
          .map((e: any) => e.name)
          .indexOf(element.category.toUpperCase());
        if (flagIndex >= 0) {
          // newArray has already tipe
          // Array goes from 0-11. Month from 01-12. Put sum
          // by each month for that category
          newArray[flagIndex].data[month - 1] += +Math.abs(element.amount);
          newArray[flagIndex].data[month - 1] = +newArray[flagIndex].data[
            month - 1
          ].toFixed(2);
        } else {
          // newArray does not have tipe
          const newObject = {
            name: element.category.toUpperCase(),
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          };
          // Add month
          newObject.data[month - 1] += +Math.abs(element.amount);
          newObject.data[month - 1] = +newObject.data[month - 1].toFixed(2);
          newArray.push(newObject);
        }
      }
    });
    return newArray;
  }
  // Capitalize given string
  static capitalize(string: string): any {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
