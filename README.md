# cboe-interview-django-react
A web app that uses a Django Backend and React Frontend.
 ```For the next step in the process, I'd like you to write a sample web application.  Using the PITCH specification document, create an interface that allows a user to upload the attached PITCH data file.  The application should process the data and produce output showing a count of messages by message type.  Note that each line in the attached file begins with an extra 'S' character that is not mentioned in the spec.  This character can be ignored.```
 
## Getting started
If `pipenv` is not installed, install it first following these steps https://pypi.org/project/pipenv/
1. Clone this project
2. ```cd cboe-interview-django-react```
3. ```pipenv shell``` to source the virtual environment
4. ```pipenv install``` to install packages specified in `Pipfile`
5. ```cd frontend && npm install```


## Run the application
Open two terminals. Navigate one to the `frontend` directory, and the other in the `backend` directory.
1. In the backend directory while sourced in the virtual environment, run `python manage.py runserver`
2. In the frontend directory, run `npm run start`

