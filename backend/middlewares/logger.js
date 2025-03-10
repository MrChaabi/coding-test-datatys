const morgan = require('morgan');
const chalk = require('chalk');

const statusColors = {
  5: '#ff4757', // Rouge pour les erreurs 5xx
  4: '#ffa502', // Orange pour les 4xx
  3: '#2ed573', // Vert pour les redirections
  2: '#2ed573', // Vert pour les succès
  1: '#2ed573'  // Vert pour les info
};

module.exports = morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const color = statusColors[status[0]] || '#ffffff';

  return [
    chalk.hex('#34ace0').bold(tokens.method(req, res)),
    chalk.hex(color).bold(status),
    chalk.hex('#ffb142').bold(tokens.url(req, res)),
    chalk.hex('#2ed573').bold(`${tokens['response-time'](req, res)} ms`),
    chalk.hex('#f78fb3').bold(`@ ${tokens.date(req, res)}`)
  ].join(' ');
});