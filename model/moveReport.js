const db = require("../server/db_config");
module.exports = function moveReport(from,to,id,time,communityOrClassName,discordLink,email,fullname,reason){
    db.ref(to).child(id).set({
        time:time,
        communityOrClassName:communityOrClassName,
        discordLink:discordLink,
        email:email,
        fullname:fullname,
        reason:reason
    })
    db.ref(from).child(id).remove();
}