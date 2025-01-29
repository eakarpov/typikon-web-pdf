cd typikon-web-pdf
git checkout master
git pull
npm i
npm run build
sudo systemctl restart typikon-web-pdf.service
