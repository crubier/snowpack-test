module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    "@snowpack/plugin-typescript"
  ],
  installOptions: {
    rollup: {
      plugins: [require('rollup-plugin-pnp-resolve')()],
    },
  },
};
