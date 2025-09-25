from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask("comentarios")
CORS(app)  
app.debug = True

comments = {}
comment_counter = 1


@app.route('/api/comment/new', methods=['POST'])
def api_comment_new():
    global comment_counter
    data = request.get_json()

    email = data.get('email')
    comment = data.get('comment')
    content_id = str(data.get('content_id'))

    new_comment = {
        "id": comment_counter,
        "email": email,
        "comment": comment,
        "content_id": content_id,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    comment_counter += 1

    if content_id in comments:
        comments[content_id].append(new_comment)
    else:
        comments[content_id] = [new_comment]

    return jsonify({
        "status": "SUCCESS",
        "message": f"Comentário criado e associado ao content_id {content_id}",
        "comment": new_comment
    })


@app.route('/api/comment/list/<content_id>')
def api_comment_list(content_id):
    if content_id in comments:
        return jsonify(comments[content_id])
    return jsonify({"status": "NOT-FOUND", "message": f"content_id {content_id} não encontrado"}), 404


@app.route('/api/comment/stats')
def api_comment_stats():
    total = sum(len(lst) for lst in comments.values())
    stats = {
        "total_comments": total,
        "by_content": {cid: len(lst) for cid, lst in comments.items()}
    }
    return jsonify(stats)


@app.route('/api/health')
def api_health():
    return jsonify({"status": "ok"})
