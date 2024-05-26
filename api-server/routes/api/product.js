module.exports = function (express) {
    const router = express.Router();
    const multer = require("multer");
    const fsExtra = require("fs-extra");
    const uuidV4 = require("uuid4");
    const path = require("path");
    const commonFn = require("../../common/functions");

    router.post("/:id/save", async function (req, res, next) {
        try {
            // Multer file storage configuration
            const storage = multer.diskStorage({
                // Set file storage path
                destination: function (req, file, callback) {
                    fsExtra.mkdirsSync(`../web-app/public/uploads/${req.params.id}/`);
                    callback(null, `../web-app/public/uploads/${req.params.id}/`);
                },
                // Rename the file name using uuid
                filename: function (req, file, callback) {
                    const imageName = uuidV4();
                    callback(null, imageName + path.extname(file.originalname));
                }
            });

            // Multer file validation configuration
            const upload = multer({
                storage: storage,
                limits: {
                    fileSize: 50 * 1024 * 1024 // set 50 mb max file size
                },
                fileFilter: function (req, file, cb) {
                    // Supported file types array
                    const filetype = [".jpg", ".jpeg", ".png", ".heic"];
                    // if file type is not from array it will return following error
                    if (filetype.indexOf(path.extname(file.originalname).toLowerCase()) < 0) {
                        // eslint-disable-next-line max-len
                        return cb(new Error("File must be jpg, jpeg, png, heic"));
                    }
                    cb(null, true);
                }
            }).fields([{
                name: "attachments" // set name of attachments to accept from the req.files
            }]);
            // calling the upload function to upload attachments
            upload(req, res, async function (err) {
                if (err) {
                    console.log(err);
                    catchErrorLogs(`${config.messages["1007"]}: ${req.params.id}`, "1007");
                    catchErrorLogs(err);
                    // Return file upload error
                    return res.sendError(err, "1007");
                } else {
                    try {
                        const attachments = [];
                        // Loop through attachments array and prepare the array of attachment to insert in the database
                        for (const file of req.files.attachments) {
                            attachments.push({
                                name: file.filename,
                                originalName: file.originalname,
                                path: file.path,
                                storedIn: "local",
                                date: new Date()
                            });
                        }
                        const productCreated = await db.models.products.create({
                            description: req.body.description,
                            uploadedBy: req.params.id,
                            rent: req.body.rent,
                            time: req.body.time,
                            attachments: attachments
                        })
                        return res.sendCreated(config.messages["1008"], productCreated, "1008");
                    } catch (err) {
                        console.log(err);
                        catchErrorLogs(`${config.messages["1006"]}: ${req.params.id}`, "1006");
                        catchErrorLogs(err);
                        res.sendError(err, "1006");
                    }
                }
            });
        } catch (error) {
            catchErrorLogs(config.messages["1006"], "1006");
            catchErrorLogs(err);
            res.sendError(err, "1006");
        }
    })

    router.post("/", async function (req, res, next) {
        try {
            const sort = {
                createdOn: -1
            }
            const pagination = await commonFn.paginationQuery(req);
            console.log(pagination.offset, "pagination.offset");
            console.log(pagination.row,"pagination.row");
            const products = await db.models.products.aggregate([{
                "$sort": sort
            }, {
                "$skip": pagination.offset
            }, {
                "$limit": pagination.row
            }, { // Lookup for get driver name
                $lookup: {
                    from: "users",
                    let: {
                        user: "$uploadedBy"
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$_id", "$$user"]
                                }]
                            }
                        }
                    }, {
                        $project: {
                            firstName: 1,
                            mobile: 1,
                            email: 1
                        }
                    }],
                    as: "userDetails"
                }
            }, {
                $project: {
                    userDetails: { $arrayElemAt: ["$userDetails", 0] },
                    rent: 1,
                    time: 1,
                    description: 1,
                    attachments: 1,
                    isavailable: 1,
                    uploadedBy: 1
                }
            }]);
            res.sendSuccess(products, "Products list");
        } catch (error) {
            catchErrorLogs(config.messages["1006"], "1006");
            catchErrorLogs(err);
            res.sendError(err, "1006");
        }
    })


    router.put("/:id/change-status", async function (req, res, next) {
        try {
            await db.models.products.updateOne({
                _id: req.params.id
            }, {
                $set: {
                    isavailable: req.body.status
                }
            })
            res.sendSuccess({}, "Product availability status has been changed");
        } catch (error) {
            console.log(error);
            catchErrorLogs(config.messages["1011"], "1011");
            catchErrorLogs(error);
            res.sendError(error, "1011");
        }
    })
    return router;
}