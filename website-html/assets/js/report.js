const setNewReport = (reportRef, community_or_class_name, discord_link, report_contact_email, user_fullname, report_reason) => {
    let config = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            reportRef, 
            community_or_class_name, 
            discord_link, 
            report_contact_email, 
            user_fullname, 
            report_reason
        })
    };
    fetch('http://18.237.22.223:8000/setNewReport', config)
    .catch(error => console.log(error));
}

async function submitReport() {
    let server_type = localStorage.getItem('isCommunitySelected') === "True" ? 'Community' : 'Class';
    var reportRef = `Report/${server_type}`;

    var community_or_class_name = localStorage.getItem("communityOrClassNameSelected");
    var discord_link = localStorage.getItem("communityOrClassDiscordServerSelected");
    var report_contact_email = document.getElementById("reportContactEmail").value;
    var user_fullname = localStorage.getItem("user-displayname");
    var report_reason =  document.getElementById("reportReason").value;
    
    if (!report_reason) {
        alert("Please enter the reason for reporting.");
        return
    } else {
        setNewReport(reportRef, community_or_class_name, discord_link, report_contact_email, user_fullname, report_reason);
        alert("Successfully submitted! Thank you for your report!");
    }

    window.location.href = "afterlogin.html";
    
}
