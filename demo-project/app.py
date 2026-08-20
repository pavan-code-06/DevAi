"""
Demo Flask Application — DevGuard AI Sample Project

This app has an intentional dependency bug:
  - Flask 2.3.3 is used
  - Werkzeug is pinned to 0.16.1 (incompatible — Flask 2.x requires Werkzeug >=2.0.0)

The app will crash at import time with:
  ImportError: cannot import name 'ImmutableDict' from 'werkzeug.datastructures'
"""

import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL", "postgresql://user:password@localhost/devguard_demo"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class User(db.Model):
    """Simple user model for demonstration."""
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }


@app.route("/api/users", methods=["GET"])
def get_users():
    """Return all users."""
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])


@app.route("/api/users", methods=["POST"])
def create_user():
    """Create a new user."""
    data = request.get_json()
    user = User(username=data["username"], email=data["email"])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
