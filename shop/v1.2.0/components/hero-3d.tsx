'use client'
import { useEffect, useRef, useState } from 'react'

export default function Hero3D(){
  const ref=useRef<HTMLCanvasElement>(null)
  const [fallback,setFallback]=useState(false)

  useEffect(()=>{
    const canvas=ref.current
    if(!canvas) return

    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cores=navigator.hardwareConcurrency || 4
    if(reduceMotion || cores<=2){
      setFallback(true)
      return
    }

    let alive=true
    let visible=true
    let cleanup=()=>{}

    import('three').then(THREE=>{
      if(!alive||!ref.current)return
      try{
        const renderer=new THREE.WebGLRenderer({canvas:ref.current,alpha:true,antialias:true,powerPreference:'high-performance'})
        renderer.setPixelRatio(Math.min(devicePixelRatio,1.35))
        const scene=new THREE.Scene()
        const camera=new THREE.PerspectiveCamera(34,1,.1,100)
        camera.position.set(0,.25,7)
        const group=new THREE.Group()
        scene.add(group)

        const dark=new THREE.MeshStandardMaterial({color:0x171016,metalness:.82,roughness:.16})
        const rose=new THREE.MeshStandardMaterial({color:0x9a365f,metalness:.48,roughness:.2})
        const glass=new THREE.MeshPhysicalMaterial({color:0xf0d9e6,roughness:.08,transmission:.35,transparent:true,opacity:.92,metalness:.05})
        const base=new THREE.Mesh(new THREE.CylinderGeometry(.82,.9,2.65,48),dark)
        base.position.y=-1
        group.add(base)
        const collar=new THREE.Mesh(new THREE.CylinderGeometry(.69,.72,.42,48),glass)
        collar.position.y=.53
        group.add(collar)
        const bullet=new THREE.Mesh(new THREE.CylinderGeometry(.48,.62,1.75,48),rose)
        bullet.position.y=1.55
        group.add(bullet)
        const tip=new THREE.Mesh(new THREE.SphereGeometry(.49,48,24,0,Math.PI*2,0,Math.PI*.52),rose)
        tip.position.y=2.42
        tip.scale.y=.65
        group.add(tip)

        scene.add(new THREE.HemisphereLight(0xffedf6,0x27121e,2.5))
        const key=new THREE.DirectionalLight(0xffffff,4.2)
        key.position.set(4,5,5)
        scene.add(key)
        const rim=new THREE.PointLight(0xb34d77,18,12)
        rim.position.set(-3,1,3)
        scene.add(rim)

        let mx=0,my=0,raf=0
        const onMove=(e:PointerEvent)=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)}
        addEventListener('pointermove',onMove,{passive:true})

        const resize=()=>{const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
        const ro=new ResizeObserver(resize)
        ro.observe(canvas)
        resize()

        const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting},{rootMargin:'160px'})
        io.observe(canvas)

        const tick=()=>{
          if(visible){
            group.rotation.y+=.0035
            group.rotation.x+=(my*.16-group.rotation.x)*.04
            group.rotation.z+=(-mx*.09-group.rotation.z)*.04
            renderer.render(scene,camera)
          }
          raf=requestAnimationFrame(tick)
        }
        tick()

        cleanup=()=>{
          alive=false
          cancelAnimationFrame(raf)
          removeEventListener('pointermove',onMove)
          io.disconnect()
          ro.disconnect()
          renderer.dispose()
          scene.traverse(o=>{const m=o as THREE.Mesh;if(m.geometry)m.geometry.dispose()})
        }
      }catch{
        setFallback(true)
      }
    }).catch(()=>setFallback(true))

    return()=>{alive=false;cleanup()}
  },[])

  if(fallback){
    return <div className="w-full h-full min-h-[420px] grid place-items-center" aria-label="نمای محصول وِلورا">
      <img src="/luxury-lipstick.jpg" alt="محصول لوکس وِلورا" className="max-h-[500px] w-auto object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,.35)]"/>
    </div>
  }

  return <canvas ref={ref} className="w-full h-full min-h-[420px]" aria-label="نمای سه‌بعدی محصول وِلورا"/>
}
