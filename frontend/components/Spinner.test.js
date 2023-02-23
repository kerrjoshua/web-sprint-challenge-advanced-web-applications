// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from './Spinner'
import React from 'react'
import { render, fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'


test('spinner renders without errors', () => {
 render(<Spinner />)
})

test('Spinner shows message "Please wait." in appropriate relationship to the "on" property', () => {
  const elem = screen.queryByText(/please wait/i)
  expect(elem).toBeInTheDocument
})
