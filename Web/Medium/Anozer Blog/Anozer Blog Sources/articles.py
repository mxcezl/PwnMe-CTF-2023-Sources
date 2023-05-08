import pydash

class Articles:

    def __init__(self):
        self.set('welcome', 'Test of new template system: {%block test%}Block test{%endblock%}')

    def set(self, article_name, article_content):
        pydash.set_(self, article_name, article_content)
        return True


    def get(self, article_name):
        if hasattr(self, article_name):
            return (self.__dict__[article_name])
        return None
    
    def remove(self, article_name):
        if hasattr(self, article_name):
            delattr(self, article_name)

    def get_all(self):
        return self.__dict__

    def __getitem__(self, article_name):
        return self.get(article_name)

