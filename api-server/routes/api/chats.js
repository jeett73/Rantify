module.exports = function (express) {
    const router = express.Router();
    const mongoose = require("mongoose");
    const ObjectId = mongoose.Types.ObjectId;

    router.get("/:sendBy/:receivedBy", async function (req, res, next) {
        try {
            const chats = await db.models.chats.aggregate([{
                $match: {
                    receivedBy: {
                        $in: [new ObjectId(req.params.receivedBy), new ObjectId(req.params.sendBy)]
                    },
                    sendBy: {
                        $in: [new ObjectId(req.params.receivedBy), new ObjectId(req.params.sendBy)]
                    }
                }
            }, {
                $sort: {
                    createdOn: 1
                }
            }, {
                $lookup: {
                    from: "users",
                    localField: "sendBy",
                    foreignField: "_id",
                    as: "sender"
                }
            },
            {
                $unwind: "$sender"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "receivedBy",
                    foreignField: "_id",
                    as: "receiver"
                }
            },
            {
                $unwind: "$receiver"
            },
            {
                $project: {
                    "message": 1,
                    "senderName": "$sender.firstName",
                    "receiverName": "$receiver.firstName",
                    "createdOn": 1,
                    "updatedOn": 1,
                    "sendBy": 1,
                    "receivedBy": 1
                }
            }])
            res.sendSuccess(chats, "Chats");
        } catch (error) {
            catchErrorLogs(config.messages["1012"], "1012");
            catchErrorLogs(error);
            res.sendError(error, "1012");
        }
    })

    router.get("/chat/persons/:id", async function (req, res, next) {
        try {
            const chatPersons = await db.models.chats.aggregate([{
                $match: {
                    $or: [{
                        sendBy: new ObjectId(req.params.id)
                    }]
                }
            }, {
                "$group": {
                    "_id": "$receivedBy",
                    "message": {
                        "$last": "$message"
                    },
                    "receivedBy": {
                        "$first": "$receivedBy"
                    }
                }
            }, {
                "$lookup": {
                    "from": "users",
                    "let": {
                        "userId": "$receivedBy"
                    },
                    "pipeline": [{
                        "$match": {
                            "$expr": {
                                "$and": [{
                                    "$eq": ["$_id", "$$userId"]
                                }]
                            }
                        }
                    }, {
                        "$project": {
                            "firstName": 1
                        }
                    }],
                    "as": "userDetails"
                }
            }, {
                $project: {
                    "message": 1,
                    // "name": {
                    //     $arrayElemAt: ["userDetails.firstName", 0]
                    // }
                    "userDetails": 1
                }
            }]);
            res.sendSuccess(chatPersons, "Chat persons")
        } catch (error) {
            catchErrorLogs(config.messages["1013"], "1013");
            catchErrorLogs(error);
            res.sendError(error, "1013");
        }
    })
    return router;
}