const attempts = new Map();

export default function rateLimiter(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    const record = attempts.get(key);

    if (now > record.resetAt) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxAttempts) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      return res.status(429).json({
        error: `Too many attempts. Try again in ${retryAfter} seconds.`,
      });
    }

    record.count++;
    next();
  };
}
