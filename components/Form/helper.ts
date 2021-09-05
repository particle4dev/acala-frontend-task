import isNumber from 'lodash/isNumber';
import isNaN from 'lodash/isNaN';

export const required = (value: any) =>
  new Promise((resolve, reject) => {
    if (!value.toString().trim().length) {
      return reject(new Error('Required'));
    }
    return resolve(true);
  });

export const requiredNumber = (value: any) =>
  new Promise((resolve, reject) => {
    const n = Number(value);
    if (!isNumber(n) || isNaN(n) || value === '') {
      return reject(new Error('Required Number'));
    }
    return resolve(true);
  });
