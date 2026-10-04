/**
 * Global open mechanism so any button on the site can open the SONAR panel
 * without prop drilling: window CustomEvent "sonar:open".
 */
export const SONAR_OPEN_EVENT = "sonar:open";

export function openSonar(): void {
  window.dispatchEvent(new CustomEvent(SONAR_OPEN_EVENT));
}
