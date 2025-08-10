import React from 'react'
import { EffectComposer, Bloom, SSAO, ToneMapping } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'

export default function PostFX() {
  return (
    <EffectComposer multisampling={4}>
      <SSAO intensity={0.3} radius={0.15} luminanceInfluence={0.6} />
      <Bloom intensity={0.6} luminanceThreshold={0.7} luminanceSmoothing={0.2} mipmapBlur blendFunction={BlendFunction.SCREEN} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} adaptive />
    </EffectComposer>
  )
}