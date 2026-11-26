
export function authorizeModification(req, res, next) {
  const { role, id } = req.user;

  if (
    role === "parent" ||
    (role === "child" && String(id) === String(req.params.userId))
  ) {
    return next();
  }

  return res.status(403).json({
    error: "Access denied"
  });
}
