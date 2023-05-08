from re import template
from flask import Flask, render_template, render_template_string, request, redirect, session, sessions
from users import Users
from articles import Articles


users = Users()
articles  = Articles()
app = Flask(__name__, template_folder='templates')
app.secret_key = '(:secret:)'


@app.context_processor
def inject_user():
    return dict(session=session)

@app.route("/create", methods=["POST"])
def create_article():
    name, content = request.form.get('name'), request.form.get('content')
    if type(name) != str or type(content) != str or len(name) == 0:
        return redirect('/articles')
    articles.set(name, content)
    return redirect('/articles')

@app.route("/remove/<name>")
def remove_article(name):
    articles.remove(name)
    return redirect('/articles')

@app.route("/articles/<name>")
def render_page(name):
    article_content = articles[name]
    if article_content == None:
        pass
    if 'user' in session and users[session['user']['username']]['seeTemplate'] != False:
        article_content = render_template_string(article_content)
    return render_template('article.html', article={'name':name, 'content':article_content})

@app.route("/articles")
def get_all_articles():
    return render_template('articles.html', articles=articles.get_all())

@app.route('/show_template')
def show_template():
    if 'user' in session and users[session['user']['username']]['restricted'] == False:
        if request.args.get('value') == '1':
            users[session['user']['username']]['seeTemplate'] = True
            session['user']['seeTemplate'] = True
        else:
            users[session['user']['username']]['seeTemplate'] = False
            session['user']['seeTemplate'] = False
    return redirect('/articles')


@app.route("/register", methods=["POST", "GET"])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    username, password = request.form.get('username'), request.form.get('password')
    if type(username) != str or type(password) != str:
        return render_template("register.html", error="Wtf are you trying bro ?!")
    result = users.create(username, password)
    if result == 1:
        session['user'] = {'username':username, 'seeTemplate': users[username]['seeTemplate']}
        return redirect("/")
    elif result == 0:
        return render_template("register.html", error="User already registered")
    else:
        return render_template("register.html", error="Error while registering user")


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    username, password = request.form.get('username'), request.form.get('password')
    if type(username) != str or type(password) != str:
        return render_template('login.html', error="Wtf are you trying bro ?!")
    if users.login(username, password) == True:
        session['user'] = {'username':username, 'seeTemplate': users[username]['seeTemplate']}
        return redirect("/")
    else:
        return render_template("login.html", error="Error while login user")


@app.route('/logout')
def logout():
    session.pop('user')
    return redirect('/')

@app.route('/')
def index():
    return render_template("home.html")


app.run('0.0.0.0', 5000, debug=True)
