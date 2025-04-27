/*
  Author: Ryan Ferrel
  Date: 4.1.25
  Filename: main.tsx
  Purpose: Entry point for the React application; sets up and renders the root component.
  System Context: Initializes frontend UI of the PlayBack application.
  Written: 4.1.25
  Revised: 4.2.25
  Description: This file bootstraps the React app by attaching the App component to the root DOM element.
  Data Structures & Algorithms: None.
  Expected Input: None directly; runs automatically when the frontend loads.
  Output: Renders the application UI to the screen.
  Expected Extensions: May later integrate global context providers, error boundaries, or theming wrappers.
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')!;

const root = createRoot(rootElement);

/*
  Method: render()
  Author: Ryan Ferrel
  Written: 4.1.25
  Revised: 4.2.25
  Purpose: Mounts the App component to the DOM inside a StrictMode wrapper.
  Called By: Browser on application startup
  System Context: Initializes frontend and renders the App interface
  Data Structures: Uses ReactDOM rendering system
  Expected Input: JSX tree containing the main App component
  Output: Renders the App UI into the #root DOM node
  Expected Revisions: May wrap App in context providers, theming, or routing layers
*/

// Render the React application with strict mode enabled for highlighting potential issues
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
