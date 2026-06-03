import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders title, subtitle, and the save slot', () => {
    render(<Hero title=".ini Editor" subtitle="sub text" save={<span>SAVE</span>} />)
    expect(screen.getByText('.ini Editor')).toBeTruthy()
    expect(screen.getByText('sub text')).toBeTruthy()
    expect(screen.getByText('SAVE')).toBeTruthy()
  })
})
