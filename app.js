'use strict';

const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output': {} });
const data = new Map();

rl.on('line', (lineString) => {
  const column = lineString.split(',');
  const year = column[0];
  const pref = column[1];
  const pop = parseInt(column[3]);
  if (year === '2010' || year === '2015'){
    let value = data.get(pref);
    if (!value){
      value = {};
    }
    value[year] = pop;
    data.set(pref, value);
  }
});

rl.on('close', () => {
  for (let [key, value] of data){
    value.rc = value['2015'] / value['2010'];
  }
  const sorted_data = Array.from(data).sort((x, y) => {
    return y[1].rc - x[1].rc;
  });
  const data_string = sorted_data.map(([key, value]) => {
    return key + ': ' + value['2010'] + '=>' + value['2015'] + '変化率' + value.rc;
  });
  console.log(data_string);
});
