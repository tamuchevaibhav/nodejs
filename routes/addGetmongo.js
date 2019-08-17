var request = require("request");
module.exports = function (app) {
    function create_a_user(req, res) {
        var options = {
            method: 'GET',
            url: 'https://randomuser.me/api/'
        };
        request(options, function (error, response, body) {
            if (error) {
                res.send({ status: 1 });
            } else {
                var Datat = JSON.parse(body);
                var user = userRSchema();
                user = extend(user, Datat.results[0]);
                user.createdOn = new Date();
                user.save(function (err, task) {
                    if (err)
                        res.send({ status: 1 });
                    res.json(task);
                });
            }
        });
    }
    function get_a_user(req, res) {
        userRSchema.aggregate([
            {
                $project: {
                    "_id": 0,
                    "age": "$dob.age",
                    "gender": "$gender",
                    "nat": "$nat"
                }
            },
            {
                $project: {
                    "range": {
                        $concat: [
                            { $cond: [{ $lte: ["$age", 0] }, "Unknown", ""] },
                            { $cond: [{ $and: [{ $gte: ["$age", 0] }, { $lt: ["$age", 30] }] }, "0 - 30", ""] },
                            { $cond: [{ $and: [{ $gte: ["$age", 30] }, { $lt: ["$age", 50] }] }, "30 - 50", ""] },
                            { $cond: [{ $gte: ["$age", 50] }, "Over 50", ""] }
                        ]
                    },
                    "gender": "$gender",
                    "nat": "$nat"
                }
            },
            { "$group": {
                "_id": {
                    "gender": "$gender",
                    "range": "$range",
                    "nat":"$nat"
                },
                "bookCount": { "$sum": 1 }
            }},
            { "$group": {
                "_id": "$_id.gender",
                "range": { 
                    "$push": { 
                        "range": "$_id.range",
                        "nat":"$_id.nat",
                        "count": "$bookCount"
                    },
                },
                "count": { "$sum": "$bookCount" }
            }}
        ], function (err, task) {
            if (err)
                res.send({ status: 1 });
            res.json(task);
        });
    }
    function extend(obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) obj[key] = src[key];
        }
        return obj;
    }
    app.route('/randomuser')
        .post(create_a_user)
        .get(get_a_user);
}