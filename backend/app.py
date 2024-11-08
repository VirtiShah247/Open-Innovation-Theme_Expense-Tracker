import os
import googleapiclient.discovery
import matplotlib.pyplot as plt
import pandas as pd
from dotenv import load_dotenv
from flask import Flask, jsonify
from google.oauth2.service_account import Credentials

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource

from flask_socketio import SocketIO, emit

# Local imports
from config import app, db, api
from models import *

load_dotenv()

app = Flask(__name__)


# class CheckSession(Resource):
#     # this allows a user to stay logged in to athe site even after refresh
#     # since the user_id will not be removed from the session until a request is
#     # made to /logout
#     def get(self):
#         user = User.query.filter(User.id == session.get("user_id")).first()
#         if not user:
#             return make_response(
#                 {"error": "Unauthorized: you must be logged in to make that request"},
#                 401,
#             )
#         else:
#             return make_response(user.to_dict(), 200)


# api.add_resource(CheckSession, "/check_session", endpoint="check_session")


# class Signup(Resource):

#     def post(self):
#         json = request.get_json()
#         try:
#             user = User(
#                 username=json["username"],
#                 name=json["name"],
#             )
#             user.password_hash = json["password"]
#             db.session.add(user)
#             db.session.commit()
#             # this line will and the user_id to your session, essentially
#             # signing them into your site automatically on signup
#             session["user_id"] = user.id

#             return make_response(user.to_dict(), 201)

#         except Exception as e:
#             return make_response({"errors": str(e)}, 422)


# api.add_resource(Signup, "/signup", endpoint="signup")


# class Login(Resource):

#     def post(self):
#         username = request.get_json()["username"]

#         user = User.query.filter(User.username == username).first()
#         password = request.get_json()["password"]

#         if not user:
#             response_body = {"error": "User not found"}
#             status = 404
#         else:
#             # this sends the password the user put in to the method in our
#             # user class, and which will return True if it is a match to what
#             # what is in our database--authenticating the user--or False if not
#             if user.authenticate(password):
#                 session["user_id"] = user.id
#                 response_body = user.to_dict()
#                 status = 200
#             else:
#                 response_body = {"error": "Invalid username or password"}
#                 status = 401
#         return make_response(response_body, status)


# api.add_resource(Login, "/login", endpoint="login")

# class Logout(Resource):

#     def delete(self):
#         session["user_id"] = None
#         return {}, 204


# api.add_resource(Logout, "/logout", endpoint="logout")


def fetch_data():
    # Add your credentials
    creds = Credentials.from_service_account_file(
        "./expense-tracker-430605-6cafa04bed91.json"
    )

    # Authorize the client
    service = googleapiclient.discovery.build("sheets", "v4", credentials=creds)

    spreadsheet_id = os.getenv("GOOGLE_SHEET_ID")
    range_name = "Sheet1!A1:D"

    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=spreadsheet_id, range=range_name)
        .execute()
    )
    values = result.get("values", [])
    if not values:
        print("No data found.")
    else:
        df = pd.DataFrame(values[1:], columns=values[0])
        df["expense"] = pd.to_numeric(df["expense"])
        df["date"] = pd.to_datetime(df["date"], format="%d-%m-%Y")
        json = df.to_json(date_format="iso")
    return json


@app.route("/get-expenses", methods=["GET"])
def get_expenses():
    data = fetch_data()
    response = app.response_class(
        response=jsonify.dumps(data), status=200, mimetype="application/json"
    )
    return response


@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.json
    # Handle the event, like fetching updated data from Google Sheets
    # Optionally, re-fetch the data and store/update it
    data = fetch_data()
    response = app.response_class(
        response=jsonify.dumps(data), status=200, mimetype="application/json"
    )
    print("Data fetched successfully")
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5555, debug=True)
