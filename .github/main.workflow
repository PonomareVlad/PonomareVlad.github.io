workflow "Clean CF cache on Push" {
  on = "push"
  resolves = ["HTTP client"]
}

action "HTTP client" {
  uses = "swinton/httpie.action@8ab0a0e926d091e0444fcacd5eb679d2e2d4ab3d"
  args = [
    "DELETE", 
    "api.cloudflare.com/client/v4/zones/55227cee6cd0bc221cb974ee29aa4e91/purge_cache", 
    "X-Auth-Email: sys.system@mail.ru", 
    "X-Auth-Key: $CF_API_KEY", 
    "Content-Type: application/json", 
    "{purge_everything:true}"
  ]
  secrets = ["CF_API_KEY"]
}
