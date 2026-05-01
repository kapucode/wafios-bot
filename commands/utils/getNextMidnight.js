function getNextMidnight() {
  const now = new Date();
  const next = new Date(now);

  next.setHours(24, 0, 0, 0); // vai pra próxima meia-noite

  return next.getTime();
}

module.exports = { getNextMidnight }