from lib import Crawler
import json

with open("findproj.txt", "r")as f0:
    z0 = json.loads(f0.read())

def findProject(lid: str):
    crawler = Crawler()
    try:
        a = crawler.postPage({
            "url": "https://playentry.org/graphql",
            "header": {
                "content-type": "application/json"
            },
            "body": json.dumps({
                "query": z0,
                "variables":{
                    "id": lid
                }
            })
        })

        j = json.loads(a)

        l = j["data"]["project"]
        return {"success": True, "data": l}
    except Exception as e:
        return {"success": False, "data": str(e)}