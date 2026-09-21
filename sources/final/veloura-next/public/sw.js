const CACHE="veloura-v2.6.0";
const CORE=["/","/shop/","/search/","/about/","/faq/","/offline/","/manifest.webmanifest","/icon.svg","/maskable-icon.svg","/cinematic/fatikhan-poster.jpg"];

self.addEventListener("install",(event)=>{
  event.waitUntil(caches.open(CACHE).then((cache)=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",(event)=>{
  event.waitUntil(
    caches.keys()
      .then((keys)=>Promise.all(keys.filter((key)=>key.startsWith("veloura-")&&key!==CACHE).map((key)=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",(event)=>{
  const request=event.request;
  if(request.method!=="GET") return;
  const url=new URL(request.url);
  if(url.origin!==location.origin) return;

  if(request.mode==="navigate"){
    event.respondWith(
      fetch(request)
        .then((response)=>{
          const copy=response.clone();
          caches.open(CACHE).then((cache)=>cache.put(request,copy));
          return response;
        })
        .catch(()=>caches.match(request).then((cached)=>cached||caches.match("/offline/")))
    );
    return;
  }

  if(url.pathname.startsWith("/_next/")||/\.(?:jpg|jpeg|png|webp|svg|css|js)$/.test(url.pathname)){
    event.respondWith(
      caches.match(request).then((cached)=>cached||fetch(request).then((response)=>{
        if(response.ok){
          const copy=response.clone();
          caches.open(CACHE).then((cache)=>cache.put(request,copy));
        }
        return response;
      }))
    );
  }
});
