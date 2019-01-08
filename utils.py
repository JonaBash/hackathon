from bottle import template

JSON_FOLDER = './data'
AVAILABE_SHOWS = ["1"]

# def getVersion():
#     return "0.0.1"

def getJsonFromFile(showData):
    try:
        return template("{folder}/{filename}.txt".format(folder=JSON_FOLDER, filename=showData))
    except:
        return "{}"