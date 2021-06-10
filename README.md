# cboe-interview-django-react
 
## About this project
This project was originally created with a React frontend and Django behind the scenes. I quickly learned how tedious it was to manage on a dev environment, and I wanted to make it as easy as possible for the user who will try to run it. I decided to switch to Django and Visualize data with Vanilla JS. 

## How it works
The user uploads a PITCH file and it gets stored in their media directory. I decided to utilize this instead of keeping tons of large files in the default sqlite database or making the user set up a connection to a db running on their local. 
The file is then parsed and returned to the front end using django templates and JSON, and then it gets visualized with Vanilla JS and chart.js. The user is able to see a visual breakdown of every PITCH message type and its important information.

## Requirements 
pipenv 
python 3.7.5

## Getting started
If `pipenv` is not installed, install it first following these steps https://pypi.org/project/pipenv/
1. ```cd root directory```
2. ```pipenv shell``` to source the virtual environment
3. ```pipenv install``` to install packages specified in `Pipfile`
4. Run ```python --version``` and verify that you have AT LEAST python 3 running on your virtual environment. I attempted it with multiple versions of python, and it will break with if it is any version of python 2. I am running it with python 3.7.5 perfectly, so if you run into any errors please try to upgrade your python version. 

## Run the application
1. run `python manage.py collectstatic`
2. `cd python_pitch`, and run `python manage.py runserver`


