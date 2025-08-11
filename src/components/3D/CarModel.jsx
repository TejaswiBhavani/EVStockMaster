import React from 'react'
import RealisticCar from './RealisticCar'

export default function CarModel({ selectedPart, onPartClick }) {
  return (
    <RealisticCar 
      selectedPart={selectedPart} 
      onPartClick={onPartClick}
    />
  )
}