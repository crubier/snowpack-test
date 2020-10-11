module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-react-refresh', // live reloading
    '@snowpack/plugin-dotenv', // loads .env variables and injects them
    // '@snowpack/plugin-typescript', this plugin only checks typescript errors, we can omit it
    "@snowpack/plugin-optimize" // adds scripts preload to prevent sequential script loading and have faster first meaningful paint 
    // we could also use webpack plugin here to support IE11 but do we really need it? we should already have 94% global reach without it
  ],
  installOptions: {
    rollup: {
      plugins: [require('rollup-plugin-pnp-resolve')()],
    },
  },
};
