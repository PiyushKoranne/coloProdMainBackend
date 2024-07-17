module.exports = {
  apps:[
          {
                  name:'Indore_Battery_Backend',
                  script:'node',
                  args:'index.js',
                  env:{
                          NODE_ENV:'production'
                  },
                  watch:false,
          },
  ],
}

