import json
from findproject import findProject

ERROR = json.dumps({
  "status": "error"
})

def api(data):
    try:
        dt = str(data)
        p = json.loads(dt)
        typ = p["apiType"]
        if typ == "searchProject":
            lid = p["id"]
            data = findProject(lid)
            if data["success"]:
                return json.dumps(data["data"])
            else:
                return ERROR
        return "null"
    except Exception as e:
        return ERROR
    