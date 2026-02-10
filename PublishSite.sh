git init
git remote add origin https://github.com/GADijkhuis/DijkhuisAppOnline.git
git add .
git commit -m "Deploy version 0.1.3 of Dijkhuis App Online"
git branch -M main
git push -u origin main --force
