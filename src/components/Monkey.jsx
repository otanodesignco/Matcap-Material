import { useTexture, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

export default function Monkey( props )
{

    const { texture } = props

    const matcapUrl = texture ? texture : 'matcaps/matcap.png'

    const matcap = useTexture( matcapUrl )

    const uniforms =
    {
        uMatcap: { value: matcap }
    }

    const vertex = /*glsl*/`
    
   out vec3 vViewNormals;

   void main()
   {

        // normals in view space
        vViewNormals = normalize( normalMatrix * normal );
   
        // set position in clip space
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

   }

    `

    const fragment = /*glsl*/`

    uniform sampler2D uMatcap;

    in vec3 vViewNormals;

    void main()
    {

        // view normals as uv & center uv coords for textures
        vec2 uv = ( vViewNormals.xy * 0.5 ) + 0.5; 

        // map texture using normals in view space, lighting controled by camera position
        vec4 matcap = texture( uMatcap , uv );

        // set fragment color to matcap texture
        gl_FragColor = matcap;

    }

    `

    // import model
    const { nodes } = useGLTF('./models/Monkey.glb')

    const monkey = useRef()

    useFrame( ( state ) =>
    {
        monkey.current.rotation.y = state.clock.elapsedTime * 0.5
    })


    return  <mesh
                ref={ monkey }
                { ...props }
                geometry={ nodes.Suzanne.geometry }
            >

                <shaderMaterial
                    vertexShader={ vertex }
                    fragmentShader={ fragment }
                    uniforms={ uniforms }
                />

            </mesh>

}