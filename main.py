from bottle import route, run, static_file, template, get, post, error,request, redirect, response
from uuid import uuid4
import json
import utils
import pymysql

###### https://www.db4free.net/phpMyAdmin/index.php

connection = pymysql.connect(host='db4free.net',
                             user='rootzapp',
                             password='rootzapp',
                             db='rootzapp',
                             charset='utf8',
                             cursorclass=pymysql.cursors.DictCursor)

@route('/')
def handle_root_url():
    redirect("/welcome")

@route('/account')
def account():
    return template("account.html", root="")

@route('/data')
def data():
    num = request.GET.dict["num[]"]
    sectionData = []
    for i in num:
        sectionData.append(utils.getJsonFromFile(i).replace("'", '"'))
    return json.dumps(sectionData)

@route('/runners')
def runners():
    try:
        with connection.cursor() as cursor:
            sql = 'SELECT latitude, longitude, status FROM user_loc'
            cursor.execute(sql)
            cursor.execute(sql)
            result = cursor.fetchall()
            return json.dumps(result)
    except Exception as e:
        return {"ERROR": str(e)}

@get("/welcome")
def go_app():
    if userIsLoggedIn(request):
        return template("index.html")
    else:
        redirect("/login?next_url=/welcome")


@get("/login")
@post("/login")
def login():
    if request.method == "POST":
        return handleLogin(request)
    else:
        requestedUrl = request.GET.get("next_url", "/")
        context = {"next_url": requestedUrl, "err_msg": ""}
        return template("templates/app.html", **context)


def handleLogin(request):
    nickname = request.forms.get("nickname")
    password = request.forms.get("password")
    requestedUrl = request.forms.get("next_url")
    userVerified = verifyUser(nickname, password)
    if userVerified:
        redirect(requestedUrl)
    else:
        context = {"next_url": requestedUrl, "err_msg": "Wrong nickname or password"}
        return template("templates/app.html", **context)


def verifyUser(nickname, password):
    with connection.cursor() as cursor:
        sql = 'SELECT * FROM users WHERE nickname = "{}" AND password = "{}"'.format(nickname, password)
        cursor.execute(sql)
        result = cursor.fetchone()
        if result:
            updateUserSessionId(nickname, password)
            return True
        return False


def updateUserSessionId(nickname, password):
    sessionId = str(uuid4().hex)[:8]
    with connection.cursor() as cursor:
        sql = 'UPDATE users SET session_id = "{}" WHERE nickname = "{}" AND password = "{}"'.format(sessionId, nickname, password)
        cursor.execute(sql)
        connection.commit()
    response.set_cookie("session_id", sessionId)
    response.set_cookie("nickname", nickname)


def userIsLoggedIn(request):
    nicknameFromCookie = request.get_cookie("nickname")
    sessionFromCookie = request.get_cookie("session_id")
    with connection.cursor() as cursor:
        sql = 'SELECT * FROM users WHERE nickname = "{}" AND session_id = "{}"'.format(nicknameFromCookie, sessionFromCookie)
        cursor.execute(sql)
        result = cursor.fetchone()
        return result

@get("/JS/<filepath:re:.*\.js>")
def js(filepath):
    return static_file(filepath, root="./js")

@get("/CSS/<filepath:re:.*\.css>")
def css(filepath):
    return static_file(filepath, root="./css")

@get("/img/<filepath:re:.*\.(jpg|png|gif|ico|svg)>")
def img(filepath):
    return static_file(filepath, root="./img")

@error(404)
def error404(error):
    return "<h1>Error 404</h1>"



def main():
        run(host='localhost', port=7000)


if __name__ == '__main__':
        main()
