import hashlib

class Users:

    users = {}

    def __init__(self):
        self.users['admin'] = {'password': None, 'restricted': False, 'seeTemplate':True }

    def create(self, username, password):
        if username in self.users:
            return 0
        self.users[username]= {'password': hashlib.sha256(password.encode()).hexdigest(), 'restricted': True, 'seeTemplate': False}
        return 1
    
    def login(self, username, password):
        if username in self.users and self.users[username]['password'] == hashlib.sha256(password.encode()).hexdigest():
            return True
        return False
    
    def seeTemplate(self, username, value):
        if username in self.users and self.users[username].restricted == False:
            self.users[username].seeTemplate = value

    def __getitem__(self, username):
        if username in self.users:
            return self.users[username]
        return None
