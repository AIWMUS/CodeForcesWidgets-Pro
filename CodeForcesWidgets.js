CodeForcesWidgets = (function() {
    var color = {
        "-": "black",
        "newbie": "gray",
        "pupil": "green",
        "specialist": "#03A89E",
        "expert": "blue",
        "candidate master": "#a0a",
        "master": "#FF8C00",
        "international master": "#FF8C00",
        "grandmaster": "red",
        "international grandmaster": "red",
        "legendary grandmaster": "red"
    }
                
    return {
        initUserWidget: function(handle, elemId, hasLogo = true, hasTitle = true, hasRatingChanges = true) {
            elem = document.getElementById(elemId)
            
            elem.innerHTML = ""
            elemHtml = ""
            if (hasLogo)
                elemHtml += "<img src=\"https://st.codeforces.com/s/64266/images/codeforces-logo.png\"/>"
            if (hasTitle)
                elemHtml += "<div id=\"" + elemId + "_title\">Loading...</div>"
            if (hasRatingChanges)
                elemHtml += "<div id=\"" + elemId + "_ratingChanges\">Loading...</div>"
            elem.innerHTML = elemHtml
            
            if (hasTitle) {
                var xmlhttp_title = new XMLHttpRequest()
                var url_title = "https://codeforces.com/api/user.info?handles=" + handle + "&lang=en"
                xmlhttp_title.onreadystatechange = function() {
                    if (xmlhttp_title.readyState == 4/* && xmlhttp_title.status == 200*/)
                        Title(xmlhttp_title.responseText)
                }
                xmlhttp_title.open("GET", url_title, true)
                xmlhttp_title.send()
                
                function getObjTable(obj) {
                    var res = ""
                    res += "<table>"
                    for (var key in obj) {
                        res += "<tr>"
                        res += "<td>" + key + "</td>"
                        res += "<td>" + obj[key] + "</td>"
                        res += "</tr>"
                    }
                    res += "</table>"
                    return res
                }
                
                function Title(response) {
                    var json = JSON.parse(response)
                    var status = json.status
                    var elemTitleHtml = ""
                    if (status == "OK") {
                        var res = json.result[0]
                        if (res.rank == undefined)
                            res.rank = "-"
                        elemTitleHtml += "<div class=\"cfw\">"
                        elemTitleHtml += "<div class=\"handle\">"
                        var handleStr = handle
                        var class_ = ""
                        if (handle == "MikeMirzayanov")
                            class_ = "class=\"god\" "
                        if (res.rank == "legendary grandmaster")
                            handleStr = "<span style=\"color: black\">" + handleStr[0] + "</span>" + handleStr.substr(1)
                        elemTitleHtml += "<a " + class_ + "style=\"color: " + color[res.rank] + ";\" href=\"https://codeforces.com/profile/" + handle + "\">" + 
                            handleStr + 
                            "</a> "
                        elemTitleHtml += "<span style=\"color: " + color[res.rank] + "\">" + 
                            "(" + res.rating +")" + 
                            "</span> "
                        elemTitleHtml += "(max: " + "<span style=\"color: " + color[res.maxRank] + "\">" + res.maxRating + "</span>" + ")"
                        elemTitleHtml += "</div>"
                        var sec = res.lastOnlineTimeSeconds
                        var date = new Date(sec * 1000)
                        var timeString = date.toLocaleString()
                        elemTitleHtml += "<p>Last Online time: " + timeString + "</p>"
                        //elemTitleHtml += getObjTable(res)
                        elemTitleHtml += "</div><br>"
                    } else {
                        elemTitleHtml += "<span style=\"color: red\">Error: status is not \"OK\": status = " + res.status + "</span>"
                    }
                    document.getElementById(elemId + "_title").innerHTML = elemTitleHtml
                }
            }

            if (hasRatingChanges) {
                var xmlhttp_ratingChanges = new XMLHttpRequest()
                var url_ratingChanges = "https://codeforces.com/api/user.rating?handle=" + handle + "&lang=en"
                xmlhttp_ratingChanges.onreadystatechange = function() {
                    if (xmlhttp_ratingChanges.readyState == 4/* && xmlhttp_ratingChanges.status == 200*/)
                        RatingChanges(xmlhttp_ratingChanges.responseText)
                }
                xmlhttp_ratingChanges.open("GET", url_ratingChanges, true)
                xmlhttp_ratingChanges.send()
                    
                function RatingChanges(response) {
                    var json = JSON.parse(response)
                    var status = json.status
                    if (status == "OK") {
                        var res = json.result
                        var elemRatingChangesHtml = ""
                        elemRatingChangesHtml += "<div class=\"cfw\">"
                        elemRatingChangesHtml += "<table>"
                        elemRatingChangesHtml += "<tr><th>Contest ID</th><th>Contest Name</th>" +
                            "<th>Handle</th><th>Rank</th><th>Rating Update Time</th><th>Old Rating</th><th>New Rating</th></tr>"
                        for (var i = 0; i < res.length; ++i) {
                            var sec = res[i].ratingUpdateTimeSeconds
                            var date = new Date(sec * 1000)
                            var timeString = date.toLocaleString()
                            elemRatingChangesHtml += "<tr><td>" + res[i].contestId + "</td><td>" + res[i].contestName + "</td>" +
                                "<td>" + res[i].handle + "</td><td>" + res[i].rank + "</td><td>" + timeString + "</td>" +
                                "<td>" + res[i].oldRating + "</td><td>" + res[i].newRating + "</td></tr>"
                        }
                        elemRatingChangesHtml += "</table>"
                        elemRatingChangesHtml += "</div>"
                    } else {
                        elemRatingChangesHtml += "<span style=\"color: red\">Error: status is not \"OK\": status = " + res.status + "</span>"
                    }
                    document.getElementById(elemId + "_ratingChanges").innerHTML = elemRatingChangesHtml
                }
            }
        }
    }
})()
