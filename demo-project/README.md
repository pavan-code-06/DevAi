# Demo Project — Intentionally Broken Flask App

This is a sample project used to demonstrate DevGuard AI's root-cause analysis.

## The Bug

This project has a **dependency version mismatch**: `Flask 2.x` requires
`Werkzeug>=2.0.0` but this project pins `Werkzeug==0.16.1` (a 1.x version),
causing an `ImportError` at startup.

## How to use with DevGuard AI

1. Push this directory to a public GitHub repository, OR use the hosted demo repo.
2. In DevGuard AI dashboard, paste the repository URL.
3. Paste the error log below into the "Error / Log" textarea.
4. Click "Analyze".

## Sample Error Log (paste this into DevGuard AI)

```
Traceback (most recent call last):
  File "app.py", line 1, in <module>
    from flask import Flask, jsonify
  File "/usr/local/lib/python3.10/site-packages/flask/__init__.py", line 14, in <module>
    from .app import Flask as Flask
  File "/usr/local/lib/python3.10/site-packages/flask/app.py", line 28, in <module>
    from werkzeug.datastructures import Headers, ImmutableDict
ImportError: cannot import name 'ImmutableDict' from 'werkzeug.datastructures'
(/usr/local/lib/python3.10/site-packages/werkzeug/datastructures/__init__.py)
```
