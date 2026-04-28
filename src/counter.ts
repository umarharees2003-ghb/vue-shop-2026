/**
 * Simple counter component for demonstration purposes
 * This file shows a basic pattern for creating interactive elements
 */

/**
 * Sets up a clickable counter button
 * @param element - The button element to attach the counter to
 */
export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  
  /**
   * Updates the button text with the current count
   */
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `Count is ${counter}`;
  };
  
  // Add click listener to increment and update display
  element.addEventListener('click', () => setCounter(counter + 1));
  
  // Initialize the display
  setCounter(0);
}
