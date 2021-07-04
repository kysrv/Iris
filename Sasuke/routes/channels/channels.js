const express = require("express");
const { reset } = require("nodemon");
const Channel = require("../../models/Channel");
const Message = require("../../models/Message");
const User = require("../../models/User");
const { jwtAuth } = require("../jwtAuth");
const router = express.Router();
const mongoose = require("mongoose");

router.use(jwtAuth);

const verfiyIfUserMemberOfThisChannel = async (userId, channelID) => {
  let channel = await Channel.findById(channelID);
  return channel.members.includes(userId);
};

const verifyUserExist = async (userId) => {
  const user = await User.findById(userId);
  return user != null;
};

const createNewMessage = async (authorId, content) => {
  const message = new Message({ author: authorId, content });
  await message.save();
  const msg = await Message.findById(message.id).populate({ path: "author", select: "pp username" })

  return msg;
};



// * pour créer un channel
router.post("/create", async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.json({ error: "wtf" });

    const channel = new Channel({
      members: [req.userId],
      messages: [],
      name: name ? name : `${user.username}'s channel`
    });

    await channel.save();

    // * on l'enregistre dans l'utilisateur
    user.channels.push(channel._id);
    await user.save()

    res.send(channel);

  } catch (err) {
    res.json({ error: err.toString() });
  }
});

// * retourne un channel
// * avec seulement ses 50 derniers messages
router.get("/:channelID", async (req, res) => {
  const { channelID } = req.params;
  try {
    // * lister les channels de l'utilisateur
    if (channelID == "@me") {
      const user = await User.findById(req.userId)
        .select("channels")
        .populate({
          path: "channels",
          populate: [
            {
              path: "members",
              select: "_id username pp"
            },
            {
              path: "messages",
              populate: { path: "author", select: "_id username pp" }
            }
          ]
        });
      return res.json(user.channels);
    }


    // * autrement
    const canAccess = await verfiyIfUserMemberOfThisChannel(
      req.userId,
      channelID
    );

    if (!canAccess) return res.json({ error: "Unauthorized" });

    // { messages: { $slice: 50 } } -> pour ne récuperer que les 50 derniers messages
    let channel = await Channel.findById(channelID, { messages: { $slice: -50 } })
      .populate("members", "_id username pp")
      .populate({ path: "messages", populate: { path: "author", select: "_id username pp" } })


    channel.lastMessageID = channel.messages[channel.messages.length];
    res.json(channel);
  } catch (err) {
    return res.json({ error: err.toString() });
  }
});


// * pour envoyer un message
router.post("/:channelID/message", async (req, res) => {
  const { channelID } = req.params;
  const { content } = req.body;
  try {
    // * test si le salon existe
    let channel = await Channel.findById(channelID);
    if (!channel) return res.json({ error: "channel didn't exist" })

    // * vérifie si l'utilisateur peut y acceder
    const canAccess = await verfiyIfUserMemberOfThisChannel(
      req.userId,
      channelID
    );

    if (!canAccess) return res.json({ error: "Unauthorized" });

    // * on crée un message
    const message = await createNewMessage(req.userId, content);
    // * on l'ajoute à la fin de la liste des messages dans le salon
    channel.messages.push(message._id);
    await channel.save();



    // * on retourne le message
    res.json(message);
  } catch (err) {
    return res.json({ error: err.toString() });
  }
});



// * pour ajouter un membre à un channel qui existe déjà 
router.post("/:channelID/addMember", async (req, res) => {
  const { channelID } = req.params;
  const { newUserID } = req.body;
  if (!mongoose.isValidObjectId(newUserID)) return res.json({ error: "Invalid user id shape" })
  try {
    const canAccess = await verfiyIfUserMemberOfThisChannel(
      req.userId,
      channelID
    );

    if (!canAccess) return res.json({ error: "Unauthorized" });

    // * on test si l'utilisateur que l'on veut ajouter à un id valide
    const validUser = await verifyUserExist(newUserID);
    if (!validUser) return res.json({ error: "new user didn't exist" });

    // * et si il n'est pas déjà sur le groupe
    const alreadyOnGroup = await verfiyIfUserMemberOfThisChannel(
      newUserID,
      channelID
    );
    if (alreadyOnGroup) return res.json({ error: "User is already on the group" });


    // * on trouve le salon
    let channel = await Channel.findById(channelID);
    channel.members.push(newUserID);
    await channel.save();

    const user = await User.findById(newUserID);
    user.channels.push(channel._id);
    await user.save()

    res.json(channel.members);
  } catch (err) {
    return res.json({ error: err.toString() });
  }
});

// * pour enlever un membre d'un channel
router.post("/:channelID/removeMember", async (req, res) => {
  const { channelID } = req.params;
  const { targetedUserID } = req.body;

  if (!mongoose.isValidObjectId(targetedUserID)) return res.json({ error: "Invalid user id shape" })

  try {
    const canAccess = await verfiyIfUserMemberOfThisChannel(
      req.userId,
      channelID
    );


    if (!canAccess) return res.json({ error: "Unauthorized" });

    // * on test si l'utilisateur que l'on veut ajouter à un id valide
    const validTargetuser = await verifyUserExist(targetedUserID);
    if (!validTargetuser) return res.json({ error: "Targeted user didn't exist" });

    // * et si il n'est pas déjà sur le groupe
    const isMember = await verfiyIfUserMemberOfThisChannel(
      targetedUserID,
      channelID
    );

    if (!isMember) return res.json({ error: "User not in group" });


    // * on trouve le salon
    let channel = await Channel.findById(channelID);

    const adminID = channel.members[0]._id;
    if (req.userId != adminID) return res.json({ error: "You're not administrator" })


    channel.members = channel.members.filter(member => member._id != targetedUserID)
    await channel.save();

    const user = await User.findById(newUserID);
    user.channels = user.channels.filter(chanID => chanID != channel._id)
    await user.save()


    res.json(channel);
  } catch (err) {
    return res.json({ error: err.toString() });
  }
});







// * pour lire les messages
router.get("/:channelID/messages", async (req, res) => {
  const { channelID } = req.params;
  const { lastMessageID } = undefined; // ?lastMessageID = A FAIRE !!!!!
  try {
    const canAccess = await verfiyIfUserMemberOfThisChannel(
      req.userId,
      channelID
    );


    if (!canAccess) return res.json({ error: "Unauthorized" });


    res.json({ message: "under dev sorry :C" });
  } catch (err) {
    return res.json({ error: err.toString() });
  }
})


module.exports = router;
