"""Build a complete, automatically refreshed update register from repository commits."""
import json, os, urllib.request
from datetime import datetime, timezone
from pathlib import Path

def collect():
    repo = os.environ.get('GITHUB_REPOSITORY', 'science-vault/science-vault-wa')
    headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'Learning-Vault-Update-History'}
    if os.environ.get('GITHUB_TOKEN'):
        headers['Authorization'] = 'Bearer ' + os.environ['GITHUB_TOKEN']
    entries = []
    page = 1
    while True:
        request = urllib.request.Request(f'https://api.github.com/repos/{repo}/commits?sha=main&per_page=100&page={page}', headers=headers)
        with urllib.request.urlopen(request, timeout=60) as response:
            batch = json.load(response)
        for commit in batch:
            lines = commit['commit']['message'].strip().split('\n', 1)
            entries.append({'id': commit['sha'], 'recordedAt': commit['commit']['committer']['date'], 'title': lines[0], 'details': lines[1].strip() if len(lines)>1 else '', 'url': commit['html_url']})
        if len(batch) < 100:
            break
        page += 1
    return {'generatedAt': datetime.now(timezone.utc).isoformat(), 'timezone': 'Australia/Perth', 'timestampMeaning': 'Repository change recorded time; not the exact deployment time.', 'entries': entries}

if __name__ == '__main__':
    data = collect()
    Path('update-history.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
    print(f"Update history: {len(data['entries'])} recorded changes")
