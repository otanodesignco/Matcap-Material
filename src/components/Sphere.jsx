import { useTexture } from "@react-three/drei"

export default function Sphere( { texture }, props )
{

    const matcapUrl = texture ? texture : 'matcaps/matcap.png'

    const matcap = useTexture( matcapUrl )

    const uniforms =
    {
        uMatcap: { value: matcap }
    }

    const vertex = /*glsl*/`
    
   out vec2 vUv;

   void main()
   {

        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

   }

    `

    const fragment = /*glsl*/`

    uniform sampler2D uMatcap;

    in vec2 vUv;

    void main()
    {

        vec2 uv = vUv;

        vec4 matcap = texture( uMatcap , uv );

        gl_FragColor = matcap;

    }

    `

    return  <mesh
                { ...props }
            >

                <icosahedronGeometry />

                <shaderMaterial
                    vertexShader={ vertex }
                    fragmentShader={ fragment }
                    uniforms={ uniforms }
                />

            </mesh>

}