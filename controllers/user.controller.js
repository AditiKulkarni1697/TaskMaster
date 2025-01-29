const { UserModel } = require("../databases/mongodb/models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 8);

    const alreadyPresent = await UserModel.findOne({ email: email });

    if (alreadyPresent) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new UserModel({ name, email, password: hashed, role });

    await user.save();

    res.status(201).send({ msg: "User created successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isPresent = await UserModel.findOne({ email: email });

    if (!isPresent) {
      return res.status(400).send({ msg: "Invalid Credentials" });
    }

    const isValid = await bcrypt.compare(password, isPresent.password);

    if (!isValid) {
      return res.status(400).send({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: isPresent.email, role: isPresent.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).send({ msg: "Logged in successfully", token });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;
  try {
    if (req.user._id !== userId) {
      return res.status(403).send({ msg: "Forbidden" });
    }
    
    const hashed = await bcrypt.hash(password, 8);
    await UserModel.findByIdAndUpdate(userId, {
      name,
      email,
      password: hashed,
    });
    res.status(200).send({ msg: "User updated successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

//make sure the assigned role is not Project manager
const updateRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  const teamId = req.params.team_id;
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(400).send({ msg: "User not found" });
    }

    if (user.role === "Project Manager" || role === "Project Manager") {
      return res
        .status(400)
        .send({
          msg: "Not allowed to change the role of Project Manager or to assign Project Manager role",
        });
    }

    const team = await TeamModel.findById(teamId);

    if (!team.members.includes(userId)) {
      return res.status(400).send({ msg: "User is not a member of the team" });
    }
    await UserModel.findByIdAndUpdate(userId, { role });

    res.status(200).send({ msg: "Role updated successfully" });
  } catch (err) {
    console.log("error in updateRole", err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).send({ msg: "User not found" });
    }
    res
      .status(200)
      .send({ name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.log("error in getUser", err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = new BlacklistModel({ token: req.token });
    await token.save();
    res.status(200).send({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

module.exports = { createUser, loginUser, updateRole, updateUser, getUser, logoutUser };
