var getAPI = async function(data){
    return await (await fetch("/api", {
        "method": "POST",
        "body": JSON.stringify(data)
    })).json();
};