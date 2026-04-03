# NGINX
#### nginx hides web-client and API behind a prxi so Ngrok can tunnel it on a single URL:
```sh
# Terminal 1: Run all API containers with docker compose
cd ~/work/data/pg/company/
docker compose up -d
# Terminal 2:  Run web-client on localhost:3000
cd ~/work/nobrain-web-client
nx serve @nx-mono/nobrain-app
# Terminal 3: Run nginx container
cd ~/work/nobrain-web-client
docker compose up -d
# Terminal 4: Run ngrok on 80
ngrok http 80
```
## Pay attention to .env
#### TODO: add runtime param to switch URL
- #### LAN network mode
- #### Ngrok mode
- #### localhost mode

## Pay attention to CORS when tunneled
#### ~/work/data/pg/company/api/main.py
```sh
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://cleotilde-ectogenetic-viscidly.ngrok-free.dev",
    ],  # In production, specify your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```