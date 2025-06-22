import '../assets/scss/style.scss';

function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('../assets/img', false, /\.svg$/));