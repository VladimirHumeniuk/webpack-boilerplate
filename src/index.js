// Styles
import './styles/main.scss';

// Scripts
import './scripts/main.js';

// All images
function importAssets (r) {
  return r.keys().map(r);
}

importAssets(require.context('./assets', false, /\.(png|jpe?g|svg)$/));
