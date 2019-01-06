import { orderBy } from "lodash/orderBy";

const users = [
  { 'user': 'fred',   'age': 48 },
  { 'user': 'barney', 'age': 34 },
  { 'user': 'fred',   'age': 40 },
  { 'user': 'barney', 'age': 36 }
];

export const ordered = orderBy(users, ['user', 'age'], ['asc', 'desc'])
