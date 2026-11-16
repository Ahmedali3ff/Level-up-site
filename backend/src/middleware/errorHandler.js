export const notFound = (req, res) => res.status(404).json({ error: 'Not found' });

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  const status = err.status && err.status < 500 ? err.status : 500;
  return res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
}
