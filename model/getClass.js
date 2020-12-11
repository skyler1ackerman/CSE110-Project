const db = require("../server/db_config");

module.exports = async function getClass(className) {
    var classRef = "classes/".concat(className);
    var ref = db.ref(classRef);
    var resultsString = { str: "" };
    var results = {};
    await ref.once("value", function (snapshot) {
        snapshot.forEach(function (snapshot) {
            var info_year = snapshot.child("year").val(); //discord info
            var info_quarter = snapshot.child("quarter").val(); //discord info
            var info_profname = snapshot.child("profName").val(); //discord info
            var info_inviteurl = snapshot.child("inviteURL").val(); //discord info
            if (info_quarter === "") {
                return;
            }
            var item = info_quarter.concat(" ", info_year);
            // if Quarter Year is not already in the dict, add it
            if (!(item in results)) {
                results[item] = [];
            }

            // Add to list associated with Quarter Year
            // results = Dictionary where
            // { Fall 2020 : [ {prof: ... , discord : ... } , {...} ] }
            var profDiscordInfo = { "prof": info_profname, "discord": info_inviteurl };
            results[item].push(profDiscordInfo);
        });
    });

    return results;
}