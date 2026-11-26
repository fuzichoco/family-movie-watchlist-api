
import { Router } from "express";

import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie
} from "../utils/db.js";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

const router = Router();

// Tất cả các API đều yêu cầu JWT
router.use(authenticate);

// GET: Xem danh sách phim
router.get("/:userId", (req, res) => {
  const list = getWatchlist(Number(req.params.userId));

  if (list === null) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  return res.status(200).json(list);
});

// POST: Thêm phim
router.post("/:userId/movies", authorizeModification, (req, res) => {
  const movie = addMovie(
    Number(req.params.userId),
    req.body
  );

  if (movie === null) {
    return res.status(404).json({
      error: "User not found"
    });
  }

  return res.status(201).json(movie);
});

// PUT: Cập nhật phim
router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const movie = updateMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
    req.body
  );

  if (movie === null) {
    return res.status(404).json({
      error: "Movie not found"
    });
  }

  return res.status(200).json(movie);
});

// DELETE: Xóa phim
router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const deleted = deleteMovie(
    Number(req.params.userId),
    Number(req.params.movieId)
  );

  if (deleted === null) {
    return res.status(404).json({
      error: "Movie not found"
    });
  }

  return res.status(200).json({
    message: "Movie deleted successfully"
  });
});

export default router;
