#!/usr/bin/env bash
# Deploy Cert Prep (MS-credential) to this machine: static app at
# /var/www/ms-credential, sync service under systemd, nginx site for
# ms.71177117.xyz. Idempotent — re-run after pulling updates.
# Usage: sudo bash server/deploy.sh
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"

# --- sync service user and data
id -u mscred >/dev/null 2>&1 || useradd --system --no-create-home --shell /usr/sbin/nologin mscred
install -d -o mscred -g mscred -m 750 /var/lib/mscred-sync
install -d -m 755 /opt/mscred-sync
install -m 644 "$SRC/server/sync_server.py" /opt/mscred-sync/sync_server.py
install -m 644 "$SRC/server/mscred-sync.service" /etc/systemd/system/mscred-sync.service
systemctl daemon-reload
systemctl enable --now mscred-sync
systemctl restart mscred-sync

# --- static app
install -d -m 755 /var/www/ms-credential
cp -r "$SRC/index.html" "$SRC/assets" "$SRC/data" /var/www/ms-credential/
chmod -R a+rX /var/www/ms-credential

# --- nginx
install -m 644 "$SRC/server/nginx-ms.conf" /etc/nginx/sites-available/mscred
ln -sfn /etc/nginx/sites-available/mscred /etc/nginx/sites-enabled/mscred
nginx -t
systemctl reload nginx

echo "Deployed. If https is not set up yet: certbot --nginx -d ms.71177117.xyz --redirect"
