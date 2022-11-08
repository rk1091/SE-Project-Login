const router = require("express").Router();
const { isAuth } = require("./authMiddleware");
const connection = require("../config/database");
const User = connection.models.User;
router.put("/update", isAuth, async (req, res) => {
  const { moods } = req.body;
  console.log({ moods });

  const user = await User.findById(req.user.id);
  console.log({ user });

  res.send({ user });
});

module.exports = router;
