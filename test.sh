#!/bin/bash

# Connect to MongoDB and execute commands
mongosh "mongodb://127.0.0.1:27017/admin" -u "admin" -p "2119319cb4a367696913dca71f6ad7d9533efa220b37cd3d" --authenticationDatabase "admin" --eval "
use colohealthdb;
db.admins.insertOne({
  _id: ObjectId('66176d0c403c2c5442f062c1'),
  email: 'ndd.testmail@gmail.com',
  username: 'ColoHealthAdmin',
  password: '$2b$10$RV7XDhWOdMjxdNZN0u9NH.D8c9G.7hSFgGowc8chrwNYXzP8aA0XK',
  roles: ['admin'],
  status: true,
  themeName: 'Default',
  __v: 7,
  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1haW50ZW5hbmNlcy5ub3JlcGx5QGdtYWlsLmNvbSIsInJvbGVzIjpbImFkbWluIl0sImlhdCI6MTcyMTIxNzQ2MH0.5EA1ayPFDAUJQF3blvOk6hbHUaspiLn-FDJJI6u_0k0',
  websiteLogo: '2024_2_logo.svg',
  websiteName: 'ColoHealth',
  websiteUrl: 'http://192.168.16.36:5173',
  profileImage: 'Robohash.png',
  quickDrafts: []
});
"

# Exit the script
exit 0

